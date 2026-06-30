"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  BOTTLE_HIT,
  DEFAULT_SIGN_LAYOUT,
  GLASS_BASE,
  STREAM_HIT,
  STREAM_ORIGIN,
  isSignEditMode,
  loadSignLayout,
  saveSignLayout,
  signLayoutCode,
  type Point,
  type SignLayout,
} from "@/lib/led-sign-layout";

const MARQUEE =
  "KITTY ON TOP  •  PREMIUM BARTENDING  •  GLENSIDE PA  •  KOT  •  ";

const PIVOT = { x: 96, y: 104 };
const STREAM_PATH = "M0 0 Q10 6 17 14 Q26 20 33 23 L39 29";

const BOTTLE_BOTTOM = 86;
const BOTTLE_FILL_FULL = 34;
const BOTTLE_FILL_TOP = BOTTLE_BOTTOM - BOTTLE_FILL_FULL;
const BOTTLE_FILL_DRAIN = 12;
const BOTTLE_DRAIN_SCALE = BOTTLE_FILL_DRAIN / BOTTLE_FILL_FULL;

const GLASS_TOP = GLASS_BASE.bottom - GLASS_BASE.fillHeight;

/** Single master clock — every pour element shares these keyframe times */
const DURATION = 4;
const KF = {
  tiltStart: 0.1,
  tiltEnd: 0.28,
  pourEnd: 0.68,
  returnEnd: 0.84,
  loop: 1,
} as const;
const phaseTimes = [0, KF.tiltStart, KF.tiltEnd, KF.pourEnd, KF.returnEnd, KF.loop] as const;

const tiltTransition = {
  duration: DURATION,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [...phaseTimes],
};

const pourTransition = {
  duration: DURATION,
  repeat: Infinity,
  ease: "linear" as const,
  times: [...phaseTimes],
};

type LedBarSignProps = {
  className?: string;
  /** Always-on editor — use /sign-edit route */
  forceEdit?: boolean;
};

export function LedBarSign({ className = "", forceEdit = false }: LedBarSignProps) {
  if (forceEdit) {
    return <LedBarSignInner className={className} editMode />;
  }

  return (
    <Suspense fallback={<LedBarSignInner className={className} editMode={false} />}>
      <LedBarSignWithQuery className={className} />
    </Suspense>
  );
}

function LedBarSignWithQuery({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const [urlEdit, setUrlEdit] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUrlEdit(params.get("signEdit") === "1");
  }, []);

  const editMode = isSignEditMode(searchParams) || urlEdit;
  return <LedBarSignInner className={className} editMode={editMode} />;
}

function LedBarSignInner({ className = "", editMode }: { className?: string; editMode: boolean }) {
  const uid = useId().replace(/:/g, "");
  const glowOrange = `glow-o-${uid}`;
  const glowYellow = `glow-y-${uid}`;
  const glassClip = `glass-clip-${uid}`;
  const bottleClip = `bottle-clip-${uid}`;
  const liquidGrad = `liquid-grad-${uid}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const layoutRef = useRef<SignLayout>(DEFAULT_SIGN_LAYOUT);
  const dragSession = useRef<{
    target: "bottle" | "stream";
    origin: Point;
    clientX: number;
    clientY: number;
  } | null>(null);

  const [layout, setLayout] = useState<SignLayout>(DEFAULT_SIGN_LAYOUT);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState<"bottle" | "stream" | null>(null);

  useEffect(() => {
    const saved = loadSignLayout();
    layoutRef.current = saved;
    setLayout(saved);
  }, []);

  const persistLayout = useCallback((next: SignLayout) => {
    const rounded: SignLayout = {
      bottle: { x: Math.round(next.bottle.x), y: Math.round(next.bottle.y) },
      stream: { x: Math.round(next.stream.x), y: Math.round(next.stream.y) },
    };
    layoutRef.current = rounded;
    setLayout(rounded);
    saveSignLayout(rounded);
  }, []);

  const clientDeltaToSvg = useCallback((clientX: number, clientY: number, startClientX: number, startClientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { dx: 0, dy: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      dx: ((clientX - startClientX) / rect.width) * 260,
      dy: ((clientY - startClientY) / rect.height) * 180,
    };
  }, []);

  const startDrag = useCallback(
    (target: "bottle" | "stream") => (e: ReactPointerEvent) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragSession.current = {
        target,
        origin: { ...layoutRef.current[target] },
        clientX: e.clientX,
        clientY: e.clientY,
      };
      setDragging(target);
    },
    [editMode],
  );

  const onDragMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!dragSession.current) return;
      const { target, origin, clientX, clientY } = dragSession.current;
      const { dx, dy } = clientDeltaToSvg(e.clientX, e.clientY, clientX, clientY);
      const next = {
        ...layoutRef.current,
        [target]: { x: origin.x + dx, y: origin.y + dy },
      };
      layoutRef.current = next;
      setLayout(next);
    },
    [clientDeltaToSvg],
  );

  const onDragEnd = useCallback(() => {
    if (!dragSession.current) return;
    dragSession.current = null;
    setDragging(null);
    persistLayout(layoutRef.current);
  }, [persistLayout]);

  const resetLayout = useCallback(() => {
    persistLayout(DEFAULT_SIGN_LAYOUT);
  }, [persistLayout]);

  const copyLayout = useCallback(async () => {
    await navigator.clipboard.writeText(signLayoutCode(layoutRef.current));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const bottleTransform = `translate(${layout.bottle.x}, ${layout.bottle.y})`;
  const streamTransform = `translate(${STREAM_ORIGIN.x + layout.stream.x}, ${STREAM_ORIGIN.y + layout.stream.y})`;

  const streamVisible = editMode ? [1, 1, 1, 1, 1, 1] : [0, 0, 1, 1, 0, 0];
  const pourActive = editMode ? [1, 1, 1, 1, 1, 1] : [0, 0, 0, 1, 1, 0];

  return (
    <div className={`led-sign ${className}`}>
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <filter id={glowOrange} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#ff6b2c" floodOpacity="0.95" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={glowYellow} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feFlood floodColor="#f5b800" floodOpacity="0.95" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="flex justify-center gap-[38%]" aria-hidden>
        <div className="led-sign-chain" />
        <div className="led-sign-chain" />
      </div>

      <div className="led-sign-body relative mx-auto w-full max-w-xl">
        <svg
          className="led-sign-trace pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          aria-hidden
        >
          <rect
            x="4"
            y="4"
            width="392"
            height="292"
            rx="10"
            fill="none"
            stroke="url(#trace-gradient)"
            strokeWidth="2"
            className="led-sign-trace-path"
          />
          <defs>
            <linearGradient id="trace-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b2c" />
              <stop offset="50%" stopColor="#f5b800" />
              <stop offset="100%" stopColor="#ff6b2c" />
            </linearGradient>
          </defs>
        </svg>

        <div className={`relative rounded-xl ${editMode ? "overflow-visible" : "overflow-hidden"}`}>
          <LedMarquee text={MARQUEE} />

          <div className="relative bg-[#030303] px-4 py-7 sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_45%,rgba(255,107,44,0.1),transparent)]" />

            <motion.p
              className="led-sign-brand text-center font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.22em] text-[var(--yellow)] sm:text-[11px] sm:tracking-[0.45em]"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Kitty on Top
            </motion.p>

            <motion.h2
              className="led-sign-kot mt-1 text-center font-[family-name:var(--font-display)] text-5xl font-bold uppercase tracking-widest text-[var(--orange)] sm:text-6xl"
              animate={{ opacity: [1, 0.88, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              KOT
            </motion.h2>

            <div className={`relative mx-auto mt-2 h-48 w-full max-w-[320px] sm:h-52 ${editMode ? "pb-28" : ""}`}>
              {editMode && (
                <div className="pointer-events-none absolute inset-0 z-10 rounded border-2 border-dashed border-[var(--orange)]" />
              )}

              {/* HTML drag handle — works reliably vs SVG drag */}
              {editMode && (
                <>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Drag to move bottle"
                    className={`absolute z-30 touch-none rounded border-2 border-[var(--orange)] bg-[var(--orange)]/15 ${
                      dragging === "bottle" ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{
                      left: `${((BOTTLE_HIT.x + layout.bottle.x) / 260) * 100}%`,
                      top: `${((BOTTLE_HIT.y + layout.bottle.y) / 180) * 100}%`,
                      width: `${(BOTTLE_HIT.w / 260) * 100}%`,
                      height: `${(BOTTLE_HIT.h / 180) * 100}%`,
                    }}
                    onPointerDown={startDrag("bottle")}
                    onPointerMove={onDragMove}
                    onPointerUp={onDragEnd}
                    onPointerCancel={onDragEnd}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Drag to move pour stream"
                    className={`absolute z-30 touch-none rounded border-2 border-[var(--yellow)] bg-[var(--yellow)]/15 ${
                      dragging === "stream" ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{
                      left: `${((STREAM_HIT.x + layout.stream.x) / 260) * 100}%`,
                      top: `${((STREAM_HIT.y + layout.stream.y) / 180) * 100}%`,
                      width: `${(STREAM_HIT.w / 260) * 100}%`,
                      height: `${(STREAM_HIT.h / 180) * 100}%`,
                    }}
                    onPointerDown={startDrag("stream")}
                    onPointerMove={onDragMove}
                    onPointerUp={onDragEnd}
                    onPointerCancel={onDragEnd}
                  />
                </>
              )}

              <svg
                ref={svgRef}
                viewBox="0 0 260 180"
                className="h-full w-full overflow-visible"
                aria-label="Animated bottle pouring into a glass"
                role="img"
              >
                <defs>
                  <clipPath id={bottleClip}>
                    <path d="M74 28 H118 V86 Q118 104 96 104 Q74 104 74 86 V28 Z" />
                  </clipPath>
                  <linearGradient id={liquidGrad} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5b800" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ff6b2c" stopOpacity="1" />
                  </linearGradient>
                </defs>

                <g>
                  <defs>
                    <clipPath id={glassClip}>
                      <path d={GLASS_BASE.path} />
                    </clipPath>
                  </defs>

                  <g filter={`url(#${glowYellow})`}>
                    <path
                      d={GLASS_BASE.path}
                      fill="#060606"
                      stroke="#f5b800"
                      strokeWidth={3}
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* Liquid on top of glass interior so fill is visible */}
                  <motion.rect
                    clipPath={`url(#${glassClip})`}
                    x={GLASS_BASE.fillX}
                    y={GLASS_TOP}
                    width={GLASS_BASE.fillWidth}
                    height={GLASS_BASE.fillHeight}
                    fill={`url(#${liquidGrad})`}
                    style={{
                      transformOrigin: `${GLASS_BASE.cx}px ${GLASS_BASE.bottom}px`,
                      transformBox: "fill-box",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: pourActive }}
                    transition={pourTransition}
                  />
                  <motion.ellipse
                    clipPath={`url(#${glassClip})`}
                    cx={GLASS_BASE.cx}
                    cy={GLASS_TOP}
                    rx={11}
                    ry={2}
                    fill="#f5b800"
                    style={{
                      transformOrigin: `${GLASS_BASE.cx}px ${GLASS_BASE.bottom}px`,
                      transformBox: "fill-box",
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{
                      scaleY: pourActive,
                      opacity: editMode ? [0.65, 0.65, 0.65, 0.65, 0.65, 0.65] : [0, 0, 0, 0.75, 0.75, 0],
                    }}
                    transition={pourTransition}
                  />
                </g>

                <g transform={bottleTransform}>
                <motion.g
                  style={{ transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}
                  animate={{ rotate: [0, 0, 48, 48, 0, 0] }}
                  transition={tiltTransition}
                >
                  <g filter={`url(#${glowOrange})`}>
                    <rect x="82" y="12" width="28" height="18" rx="4" fill="#0a0a0a" stroke="#ff6b2c" strokeWidth="3" />
                    <path
                      d="M74 28 H118 V86 Q118 104 96 104 Q74 104 74 86 V28 Z"
                      fill="#080808"
                      stroke="#ff6b2c"
                      strokeWidth={editMode ? 4 : 3}
                      strokeLinejoin="round"
                    />
                    <rect x="78" y="50" width="36" height="14" rx="2" fill="#ff6b2c" opacity="0.25" />
                  </g>

                  <motion.rect
                    clipPath={`url(#${bottleClip})`}
                    x={78}
                    y={BOTTLE_FILL_TOP}
                    width={36}
                    height={BOTTLE_FILL_FULL}
                    fill={`url(#${liquidGrad})`}
                    style={{
                      transformOrigin: `96px ${BOTTLE_BOTTOM}px`,
                      transformBox: "fill-box",
                    }}
                    initial={{ scaleY: 1 }}
                    animate={{
                      scaleY: editMode
                        ? [1, 1, 1, 1, 1, 1]
                        : [1, 1, 1, BOTTLE_DRAIN_SCALE, BOTTLE_DRAIN_SCALE, 1],
                    }}
                    transition={pourTransition}
                  />

                </motion.g>
                </g>

                <g transform={streamTransform}>
                  <motion.g
                    animate={{ opacity: streamVisible }}
                    transition={pourTransition}
                    filter={`url(#${glowYellow})`}
                  >
                    <circle cx={0} cy={0} r={4.5} fill="#f5b800" stroke="#ff6b2c" strokeWidth={editMode ? 2 : 1} />
                    <motion.path
                      d={STREAM_PATH}
                      fill="none"
                      stroke="#f5b800"
                      strokeWidth={editMode ? 6 : 5}
                      strokeLinecap="round"
                      initial={{ pathLength: editMode ? 1 : 0 }}
                      animate={{ pathLength: streamVisible }}
                      transition={pourTransition}
                    />
                  </motion.g>
                </g>
              </svg>

              {editMode && (
                <div className="absolute bottom-0 left-0 right-0 z-40 rounded-lg border border-[var(--orange)] bg-black p-3 text-left text-[11px] shadow-lg">
                  <p className="font-bold uppercase tracking-wide text-[var(--orange)]">
                    Orange = bottle · Yellow = stream
                  </p>
                  <p className="mt-1 font-mono text-[var(--cream)]">
                    bottle x: {layout.bottle.x} · y: {layout.bottle.y}
                  </p>
                  <p className="font-mono text-[var(--cream)]">
                    stream x: {layout.stream.x} · y: {layout.stream.y}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={copyLayout}
                      className="rounded bg-[var(--orange)] px-2 py-1 text-[10px] font-bold uppercase text-black"
                    >
                      {copied ? "Copied!" : "Copy values"}
                    </button>
                    <button
                      type="button"
                      onClick={resetLayout}
                      className="rounded border border-[var(--border)] px-2 py-1 text-[10px] font-bold uppercase text-[var(--muted)]"
                    >
                      Reset
                    </button>
                  </div>
                  <p className="mt-2 text-[var(--muted)]">
                    When it looks right, tell me &quot;save it&quot; and I&apos;ll commit these numbers.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-1 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--cream)]/70 sm:text-[10px] sm:tracking-[0.35em]">
              Pouring · Style · Presence
            </p>
          </div>

          <LedMarquee text={MARQUEE} reverse />
        </div>
      </div>
    </div>
  );
}

function LedMarquee({ text, reverse = false }: { text: string; reverse?: boolean }) {
  return (
    <div className="led-marquee-mask border-y border-[var(--orange)]/15 bg-[#060606] py-2">
      <div className={`led-marquee-track ${reverse ? "led-marquee-reverse" : ""}`}>
        <span className="led-marquee-text">{text}</span>
        <span className="led-marquee-text" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  );
}
