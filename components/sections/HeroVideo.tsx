"use client";

import { useRef, useState, useEffect } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const YOUTUBE_ID = process.env.NEXT_PUBLIC_HERO_YOUTUBE_ID;

type HeroVideoProps = {
  className?: string;
};

export function HeroVideo({ className = "" }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localReady, setLocalReady] = useState(false);
  const [localFailed, setLocalFailed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const useYoutube = Boolean(YOUTUBE_ID) && localFailed;
  const useLocal = localReady && !localFailed;
  const showControls = useLocal || useYoutube;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || localFailed) return;
    v.play().catch(() => {});
  }, [localReady, localFailed]);

  function togglePlay() {
    if (useYoutube) {
      setPlaying((p) => !p);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.pause();
    else v.play();
    setPlaying(!playing);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (v) v.muted = !muted;
    setMuted(!muted);
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Cinematic fallback when no video file */}
      {!useLocal && !useYoutube && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/hero-cocktail.svg')] bg-cover bg-center opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--orange)]/10 via-black/50 to-[var(--yellow)]/10 animate-pulse" style={{ animationDuration: "8s" }} />
        </div>
      )}

      {/* Local MP4 */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          useLocal ? "opacity-70" : "opacity-0"
        } ${!playing && useLocal ? "opacity-30" : ""}`}
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-cocktail.svg"
        onCanPlay={() => setLocalReady(true)}
        onError={() => setLocalFailed(true)}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Optional YouTube fallback */}
      {useYoutube && YOUTUBE_ID && (
        <iframe
          title="KOT hero video"
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity ${
            playing ? "opacity-70" : "opacity-40"
          }`}
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&playsinline=1&rel=0&modestbranding=1`}
          allow="autoplay; encrypted-media"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/60" />

      {showControls && (
        <div className="absolute right-4 top-4 z-20 flex gap-2 sm:bottom-8 sm:top-auto sm:right-8">
          <button
            type="button"
            onClick={togglePlay}
            className="touch-target rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-colors hover:border-[var(--orange)] hover:text-[var(--orange)]"
            aria-label={playing ? "Pause video" : "Play video"}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          {useLocal && (
            <button
              type="button"
              onClick={toggleMute}
              className="touch-target rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-colors hover:border-[var(--orange)] hover:text-[var(--orange)]"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
