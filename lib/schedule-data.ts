import { getDb, hasDatabase } from "@/lib/db";
import { getAvailableDates, SCHEDULE } from "@/lib/scheduling";

export type BookingStatus = "pending" | "confirmed" | "blocked" | "cancelled";
export type BookingKind = "consultation" | "block";

export type ScheduleBooking = {
  id: string;
  slotDate: string;
  slotTime: string;
  status: BookingStatus;
  kind: BookingKind;
  label: string;
  name?: string;
  email?: string;
  note?: string;
  createdAt: string;
};

export type OccupiedSlot = {
  time: string;
  label: string;
  status: BookingStatus;
};

export type ScheduleAvailability = {
  dates: ReturnType<typeof getAvailableDates>;
  occupied: Record<string, OccupiedSlot[]>;
};

type BookingRow = {
  id: string;
  slot_date: string;
  slot_time: string;
  status: BookingStatus;
  kind: BookingKind;
  label: string;
  name: string | null;
  email: string | null;
  note: string | null;
  created_at: string;
};

function getSql() {
  const sql = getDb();
  if (!sql) throw new Error("Database not configured");
  return sql;
}

function mapRow(row: BookingRow): ScheduleBooking {
  return {
    id: row.id,
    slotDate: row.slot_date,
    slotTime: row.slot_time,
    status: row.status,
    kind: row.kind,
    label: row.label,
    name: row.name ?? undefined,
    email: row.email ?? undefined,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

function publicLabel(row: BookingRow): string {
  if (row.kind === "block") return row.label || "Unavailable";
  if (row.status === "pending") return "Pending";
  return "Booked";
}

export async function fetchScheduleAvailability(): Promise<ScheduleAvailability> {
  const dates = getAvailableDates();
  const occupied: Record<string, OccupiedSlot[]> = {};

  if (!hasDatabase()) {
    return { dates, occupied };
  }

  const dateKeys = dates.map((d) => d.date);
  if (dateKeys.length === 0) return { dates, occupied };

  const sql = getSql();
  const minDate = dateKeys[0];
  const maxDate = dateKeys[dateKeys.length - 1];

  const rows = (await sql`
    SELECT id, slot_date::text, slot_time, status, kind, label,
           name, email, note, created_at::text
    FROM schedule_bookings
    WHERE slot_date >= ${minDate}::date
      AND slot_date <= ${maxDate}::date
      AND status IN ('pending', 'confirmed', 'blocked')
    ORDER BY slot_date ASC, slot_time ASC
  `) as BookingRow[];

  for (const row of rows) {
    const key = row.slot_date;
    if (!occupied[key]) occupied[key] = [];
    occupied[key].push({
      time: row.slot_time,
      label: publicLabel(row),
      status: row.status,
    });
  }

  return { dates, occupied };
}

export async function isSlotAvailable(
  date: string,
  time: string,
): Promise<boolean> {
  if (!hasDatabase()) return true;

  const sql = getSql();
  const rows = (await sql`
    SELECT id FROM schedule_bookings
    WHERE slot_date = ${date}::date
      AND slot_time = ${time}
      AND status IN ('pending', 'confirmed', 'blocked')
    LIMIT 1
  `) as { id: string }[];

  return rows.length === 0;
}

export async function createScheduleBooking(input: {
  date: string;
  time: string;
  name: string;
  email: string;
  note?: string;
}): Promise<ScheduleBooking | null> {
  if (!hasDatabase()) return null;

  const sql = getSql();

  try {
    const rows = (await sql`
      INSERT INTO schedule_bookings (
        slot_date, slot_time, status, kind, label, name, email, note
      )
      VALUES (
        ${input.date}::date,
        ${input.time},
        'pending',
        'consultation',
        'Planning call',
        ${input.name},
        ${input.email},
        ${input.note ?? null}
      )
      RETURNING id, slot_date::text, slot_time, status, kind, label,
                name, email, note, created_at::text
    `) as BookingRow[];

    return mapRow(rows[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("schedule_bookings_active_slot_idx")) {
      return null;
    }
    throw err;
  }
}

export async function fetchAllBookings(limit = 50): Promise<ScheduleBooking[]> {
  if (!hasDatabase()) return [];

  const sql = getSql();
  const rows = (await sql`
    SELECT id, slot_date::text, slot_time, status, kind, label,
           name, email, note, created_at::text
    FROM schedule_bookings
    WHERE status != 'cancelled'
    ORDER BY slot_date DESC, slot_time DESC
    LIMIT ${limit}
  `) as BookingRow[];

  return rows.map(mapRow);
}

export async function fetchBookingById(id: string): Promise<ScheduleBooking | null> {
  if (!hasDatabase()) return null;

  const sql = getSql();
  const rows = (await sql`
    SELECT id, slot_date::text, slot_time, status, kind, label,
           name, email, note, created_at::text
    FROM schedule_bookings
    WHERE id = ${id}::uuid
    LIMIT 1
  `) as BookingRow[];

  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

export async function createBlockedSlot(input: {
  date: string;
  time: string;
  label: string;
  note?: string;
}): Promise<ScheduleBooking | null> {
  if (!hasDatabase()) return null;

  const sql = getSql();

  if (!(SCHEDULE.slots as readonly string[]).includes(input.time)) {
    throw new Error("invalid time slot");
  }

  try {
    const rows = (await sql`
      INSERT INTO schedule_bookings (
        slot_date, slot_time, status, kind, label, note
      )
      VALUES (
        ${input.date}::date,
        ${input.time},
        'blocked',
        'block',
        ${input.label},
        ${input.note ?? null}
      )
      RETURNING id, slot_date::text, slot_time, status, kind, label,
                name, email, note, created_at::text
    `) as BookingRow[];

    return mapRow(rows[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("schedule_bookings_active_slot_idx")) {
      return null;
    }
    throw err;
  }
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<ScheduleBooking | null> {
  if (!hasDatabase()) return null;

  const sql = getSql();
  const rows = (await sql`
    UPDATE schedule_bookings
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}::uuid
    RETURNING id, slot_date::text, slot_time, status, kind, label,
              name, email, note, created_at::text
  `) as BookingRow[];

  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

export async function cancelBooking(id: string): Promise<boolean> {
  const updated = await updateBookingStatus(id, "cancelled");
  return updated !== null;
}
