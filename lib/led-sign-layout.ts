export const LED_SIGN_LAYOUT_STORAGE_KEY = "kot-led-sign-layout";

/** Committed defaults — update after positioning in /sign-edit */
export const DEFAULT_BOTTLE_OFFSET = { x: -18, y: 12 };
export const DEFAULT_STREAM_OFFSET = { x: 2, y: 13 };

/** World-space pour origin when stream offset is zero */
export const STREAM_ORIGIN = { x: 110, y: 30 };

export const GLASS_BASE = {
  path: "M128 88 L172 88 L166 152 Q150 162 134 152 Z",
  fillX: 137,
  fillWidth: 26,
  cx: 150,
  bottom: 152,
  fillHeight: 50,
} as const;

/** Bounding boxes in viewBox coords (for drag handles) */
export const BOTTLE_HIT = { x: 70, y: 10, w: 52, h: 98 } as const;
export const STREAM_HIT = { x: 102, y: 22, w: 54, h: 44 } as const;

export type Point = { x: number; y: number };

export type SignLayout = {
  bottle: Point;
  stream: Point;
};

export const DEFAULT_SIGN_LAYOUT: SignLayout = {
  bottle: DEFAULT_BOTTLE_OFFSET,
  stream: DEFAULT_STREAM_OFFSET,
};

const LEGACY_BOTTLE_KEY = "kot-led-sign-bottle-offset";

export function loadSignLayout(): SignLayout {
  if (typeof window === "undefined") return DEFAULT_SIGN_LAYOUT;
  try {
    const raw = localStorage.getItem(LED_SIGN_LAYOUT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        bottle: { ...DEFAULT_BOTTLE_OFFSET, ...parsed.bottle },
        stream: { ...DEFAULT_STREAM_OFFSET, ...parsed.stream },
      };
    }
    const legacy = localStorage.getItem(LEGACY_BOTTLE_KEY);
    if (legacy) {
      return { bottle: { ...DEFAULT_BOTTLE_OFFSET, ...JSON.parse(legacy) }, stream: DEFAULT_STREAM_OFFSET };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SIGN_LAYOUT;
}

export function saveSignLayout(layout: SignLayout) {
  localStorage.setItem(LED_SIGN_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
}

export function signLayoutCode(layout: SignLayout) {
  return [
    `export const DEFAULT_BOTTLE_OFFSET = { x: ${layout.bottle.x}, y: ${layout.bottle.y} };`,
    `export const DEFAULT_STREAM_OFFSET = { x: ${layout.stream.x}, y: ${layout.stream.y} };`,
  ].join("\n");
}

export function isSignEditMode(searchParams: URLSearchParams | null) {
  if (process.env.NEXT_PUBLIC_LED_SIGN_EDIT === "true") return true;
  return searchParams?.get("signEdit") === "1";
}
