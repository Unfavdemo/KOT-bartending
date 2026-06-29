export interface BookingPrefill {
  eventType: "private" | "corporate" | "class";
  guestCount: number;
  eventDate?: string;
  spiritPreferences?: string[];
  menuNotes?: string;
}

const STORAGE_KEY = "kot-booking-prefill";

export function saveBookingPrefill(data: BookingPrefill) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadBookingPrefill(): BookingPrefill | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BookingPrefill;
  } catch {
    return null;
  }
}

export function clearBookingPrefill() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getVoterFingerprint(): string {
  if (typeof window === "undefined") return "anonymous";
  const key = "kot-voter-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `voter-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}
