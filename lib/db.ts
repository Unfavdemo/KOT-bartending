import { neon } from "@neondatabase/serverless";

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!hasDatabase()) {
    return null;
  }
  return neon(process.env.DATABASE_URL!);
}

export const schemaSql = `
CREATE TABLE IF NOT EXISTS seasonal_votes (
  id SERIAL PRIMARY KEY,
  option_id TEXT NOT NULL,
  voter_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(option_id, voter_fingerprint)
);

CREATE TABLE IF NOT EXISTS community_submissions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  event_date DATE,
  guest_count INTEGER,
  event_type TEXT,
  spirit_preferences JSONB,
  spirit_free BOOLEAN DEFAULT FALSE,
  menu_notes TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  venue TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  email TEXT,
  items JSONB NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_rsvps (
  id SERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  guest_count INTEGER DEFAULT 1,
  voter_fingerprint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, email)
);

CREATE TABLE IF NOT EXISTS schedule_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'blocked', 'cancelled')),
  kind TEXT NOT NULL DEFAULT 'consultation' CHECK (kind IN ('consultation', 'block')),
  label TEXT NOT NULL DEFAULT 'Planning call',
  name TEXT,
  email TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS schedule_bookings_active_slot_idx
  ON schedule_bookings (slot_date, slot_time)
  WHERE status IN ('pending', 'confirmed', 'blocked');

CREATE INDEX IF NOT EXISTS schedule_bookings_slot_date_idx
  ON schedule_bookings (slot_date);
`;
