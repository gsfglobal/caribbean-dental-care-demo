import type { IconKey } from "@/lib/treatments";

type P = { className?: string };
const base = (children: React.ReactNode, className = "h-7 w-7") => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
);
const tooth = "M16 6.5c-2.2-1.6-4.9-1.9-6.8-.7-2.4 1.5-2.8 4.9-1.9 8.2.7 2.6 1.2 5.5 1.7 8.4.4 1.9 1 3.4 2.2 3.4 1.4 0 1.8-1.9 2.2-4.1.3-1.5 1-2.6 2.6-2.6s2.3 1.1 2.6 2.6c.4 2.2.8 4.1 2.2 4.1 1.2 0 1.8-1.5 2.2-3.4.5-2.9 1-5.8 1.7-8.4.9-3.3.5-6.7-1.9-8.2-1.9-1.2-4.6-.9-6.8.7Z";

export const icons: Record<IconKey, (p: P) => React.ReactElement> = {
  check: ({ className }) => base(<><path d={tooth} /><path d="m12.5 13 2.5 2.5 4.5-5" /></>, className),
  clean: ({ className }) => base(<><path d={tooth} /><path d="M24.5 4.5v3M23 6h3M6 22.5v2.5M4.8 23.8h2.5" /></>, className),
  filling: ({ className }) => base(<><path d={tooth} /><path d="M13.5 10.5c1.4 1.2 3.6 1.2 5 0" /><circle cx="16" cy="12.6" r="1.6" /></>, className),
  root: ({ className }) => base(<><path d={tooth} /><path d="M13.6 21.5c.6-2 1.3-3.2 2.4-3.2s1.8 1.2 2.4 3.2M16 9v6" /></>, className),
  crown: ({ className }) => base(<><path d="M8 13.5 10 7l3.5 3.5L16 6l2.5 4.5L22 7l2 6.5" /><path d="M8.6 13.5h14.8c-.5 4-1.1 8-1.9 11-.4 1.6-1 2.5-1.9 2.5-1.1 0-1.4-1.6-1.8-3.4-.3-1.3-.8-2.1-1.8-2.1s-1.5.8-1.8 2.1c-.4 1.8-.7 3.4-1.8 3.4-.9 0-1.5-.9-1.9-2.5-.8-3-1.4-7-1.9-11Z" /></>, className),
  kids: ({ className }) => base(<><circle cx="16" cy="11" r="5" /><path d="M14 10.5h.01M18 10.5h.01M14.2 13c1 .8 2.6.8 3.6 0" /><path d="M8.5 27c.6-4.4 3.6-7 7.5-7s6.9 2.6 7.5 7" /></>, className),
  extraction: ({ className }) => base(<><path d={tooth} transform="translate(0 2) scale(.94) translate(1 0)" /><path d="M16 2.5v4M13.8 4.6 16 2.5l2.2 2.1" /></>, className),
  pain: ({ className }) => base(<><path d={tooth} /><path d="M24 4l-1.5 3.5H25L23.2 11" /><path d="M6 6.5l2 1.6" /></>, className),
  braces: ({ className }) => base(<><rect x="5" y="10" width="6" height="12" rx="3" /><rect x="13" y="10" width="6" height="12" rx="3" /><rect x="21" y="10" width="6" height="12" rx="3" /><path d="M4 16h24" /><path d="M7 14.5h2v3H7zM15 14.5h2v3h-2zM23 14.5h2v3h-2z" /></>, className),
  aligner: ({ className }) => base(<><path d="M5 12c3 6 19 6 22 0" /><path d="M5 12c0 6 4 11 11 11s11-5 11-11" strokeDasharray="2 2.6" /><path d="M9 14.5v2M13 15.6v2.2M19 15.6v2.2M23 14.5v2" /></>, className),
  whitening: ({ className }) => base(<><path d={tooth} /><path d="M24.5 3.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" /><path d="M5.5 5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4L3.5 7l1.4-.6z" /></>, className),
};

export function TreatmentIcon({ name, className }: { name: IconKey; className?: string }) {
  const C = icons[name];
  return <C className={className} />;
}
