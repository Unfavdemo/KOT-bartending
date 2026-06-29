import { getDb, hasDatabase } from "@/lib/db";

export type EventInquiry = {
  id: number;
  eventDate: string | null;
  guestCount: number | null;
  eventType: string | null;
  spiritPreferences: string[];
  spiritFree: boolean;
  menuNotes: string | null;
  name: string;
  email: string;
  phone: string | null;
  venue: string | null;
  message: string | null;
  createdAt: string;
};

type InquiryRow = {
  id: number;
  event_date: string | null;
  guest_count: number | null;
  event_type: string | null;
  spirit_preferences: string[] | null;
  spirit_free: boolean;
  menu_notes: string | null;
  name: string;
  email: string;
  phone: string | null;
  venue: string | null;
  message: string | null;
  created_at: string;
};

function mapRow(row: InquiryRow): EventInquiry {
  return {
    id: row.id,
    eventDate: row.event_date,
    guestCount: row.guest_count,
    eventType: row.event_type,
    spiritPreferences: row.spirit_preferences ?? [],
    spiritFree: row.spirit_free,
    menuNotes: row.menu_notes,
    name: row.name,
    email: row.email,
    phone: row.phone,
    venue: row.venue,
    message: row.message,
    createdAt: row.created_at,
  };
}

export async function fetchEventInquiries(limit = 50): Promise<EventInquiry[]> {
  if (!hasDatabase()) return [];

  const sql = getDb();
  if (!sql) return [];

  const rows = (await sql`
    SELECT id, event_date::text, guest_count, event_type, spirit_preferences,
           spirit_free, menu_notes, name, email, phone, venue, message,
           created_at::text
    FROM bookings
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as InquiryRow[];

  return rows.map(mapRow);
}
