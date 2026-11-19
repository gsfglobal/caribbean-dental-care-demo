"use client";
/** Spring naar een categorie zonder #hash (werkt ook in de preview met hash-routing). */
export function CategoryNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Categorieën" className="rv rv-d3 mt-8 flex flex-wrap gap-2">
      {items.map((i) => (
        <button
          key={i.id}
          type="button"
          onClick={() => {
            const el = document.getElementById(i.id);
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            el?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
          }}
          className="chip min-h-10 hover:border-green hover:text-green-ink"
        >
          {i.label}
        </button>
      ))}
    </nav>
  );
}
