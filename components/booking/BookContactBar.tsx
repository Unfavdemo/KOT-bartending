import { siteConfig } from "@/lib/site-config";

export function BookContactBar() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8">
      <div className="min-w-0">
        <p className="text-sm text-[var(--muted)]">Prefer email?</p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="mt-0.5 block break-all text-base font-semibold text-[var(--orange)] transition-colors hover:text-[var(--yellow)]"
        >
          {siteConfig.email}
        </a>
      </div>
      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-[var(--muted)]">Response</dt>
          <dd className="font-medium text-[var(--cream)]">24–48 hours</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Service area</dt>
          <dd className="font-medium text-[var(--cream)]">{siteConfig.regions}</dd>
        </div>
      </dl>
    </div>
  );
}
