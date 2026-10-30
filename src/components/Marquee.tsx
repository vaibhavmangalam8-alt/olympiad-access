const ITEMS = [
  "STRUCTURED",
  "STEP-WISE",
  "DAILY PRACTICE",
  "IOQM TRACK",
  "ALGEBRA",
  "NUMBER THEORY",
  "GEOMETRY",
  "NSEP MECHANICS",
  "NO SKIPPED DAYS",
];

export default function Marquee() {
  const row = (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-6 pr-6">
          <span className="mono-label text-(--color-faint)">{item}</span>
          <span className="h-1.5 w-1.5 rotate-45 bg-(--color-volt)" />
        </span>
      ))}
    </>
  );
  return (
    <div className="relative overflow-hidden border-y hairline py-3.5 select-none">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}
