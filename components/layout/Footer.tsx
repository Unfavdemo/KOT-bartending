import Link from "next/link";
import { Globe, Mail, MapPin, Share2 } from "lucide-react";
import { siteConfig, bookHref } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4">
            <p className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-wider text-[var(--cream)]">
              {siteConfig.name}
            </p>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Elite mobile bartending and event experiences. Landing on your feet
              with style.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--yellow)]" />
                {siteConfig.location}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[var(--yellow)]" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="break-all transition-colors hover:text-[var(--orange)]"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
              Hours & Regions
            </p>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>{siteConfig.hours}</li>
              <li>{siteConfig.regions}</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
              Explore
            </p>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link href="/about" className="transition-colors hover:text-[var(--orange)]">
                  About KOT
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition-colors hover:text-[var(--orange)]">
                  Services
                </Link>
              </li>
              <li>
                <Link href={bookHref} className="transition-colors hover:text-[var(--orange)]">
                  Book an Event
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
              Follow
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--border-orange)] hover:text-[var(--orange)]"
                aria-label="Instagram"
              >
                <Share2 className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target rounded-lg border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--border-orange)] hover:text-[var(--orange)]"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--muted)]">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[var(--muted)]">
            <Link href="/privacy" className="transition-colors hover:text-[var(--orange)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--orange)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
