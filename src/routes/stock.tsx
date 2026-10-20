import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { findProduct, products } from "@/data/catalog";
import { allows } from "@/lib/access";
import { L, useBendary, useBranchBook } from "@/lib/store";

export const Route = createFileRoute("/stock")({
  head: () => ({ meta: [{ title: "المخزون | El-Bendary" }] }),
  component: StockPage,
});

function StockPage() {
  const lang = useBendary((s) => s.lang);
  const role = useBendary((s) => s.role);
  const matrix = useBendary((s) => s.matrix);
  const book = useBranchBook();
  const movements = useBendary((s) => s.movements);
  const onHandQty = useBendary((s) => s.onHandQty);
  const transfer = useBendary((s) => s.transferStock);
  const adjust = useBendary((s) => s.adjustStock);
  const [q, setQ] = useState("");
  const [sku, setSku] = useState("GA");
  const [from, setFrom] = useState("galaa-1");
  const [to, setTo] = useState("mohandessin");
  const [qty, setQty] = useState(1);
  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    return products.filter((p) => `${p.sku} ${p.nameAr} ${p.nameEn}`.toLowerCase().includes(needle)).slice(0, 6);
  }, [q]);
  const product = findProduct(sku);

  if (!allows(matrix, role, "stock")) {
    return (
      <Shell>
        <p className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-muted">{L(lang, "لا صلاحية مخزون لهذا الدور.", "This role cannot move stock.")}</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-xs font-semibold tracking-wide text-red">{L(lang, "حركة المخزون", "Stock movement")}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold">{L(lang, "الرصيد في كل الفروع", "On-hand at every branch")}</h1>
        <label className="mt-4 block max-w-md text-sm">
          <span className="mb-1 block font-medium">{L(lang, "بحث", "Search")}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-line bg-surface px-3 py-2.5" />
        </label>
        <ul className="mt-2 max-w-md">
          {hits.map((p) => (
            <li key={p.sku}>
              <button type="button" onClick={() => { setSku(p.sku); setQ(""); }} className="w-full rounded-xl px-2 py-1.5 text-start text-sm hover:bg-sand">
                {p.sku} · {lang === "ar" ? p.nameAr : p.nameEn}
              </button>
            </li>
          ))}
        </ul>
        {product && (
          <div className="mt-4 overflow-x-auto rounded-card border border-line bg-surface">
            <p className="px-4 pt-4 font-semibold">{lang === "ar" ? product.nameAr : product.nameEn}</p>
            <table className="mt-2 w-full min-w-[28rem] text-sm">
              <tbody>
                {book.map((b) => (
                  <tr key={b.id} className="border-t border-line">
                    <td className="px-4 py-2">{lang === "ar" ? b.nameAr : b.nameEn}</td>
                    <td className="px-4 py-2 tabular-nums">{onHandQty(b.id, product.sku)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <form
          className="mt-6 grid gap-3 rounded-card border border-line bg-surface p-4 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            transfer(sku, qty, from, to);
          }}
        >
          <label className="text-sm">
            <span className="mb-1 block font-medium">{L(lang, "من", "From")}</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-2 py-2">
              {book.map((b) => <option key={b.id} value={b.id}>{lang === "ar" ? b.nameAr : b.nameEn}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">{L(lang, "إلى", "To")}</span>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-2 py-2">
              {book.map((b) => <option key={b.id} value={b.id}>{lang === "ar" ? b.nameAr : b.nameEn}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">{L(lang, "الكمية", "Qty")}</span>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full rounded-xl border border-line bg-paper px-2 py-2" />
          </label>
          <div className="flex items-end gap-2">
            <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">{L(lang, "تحويل", "Transfer")}</button>
            <button type="button" onClick={() => adjust(sku, from, qty)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
              {L(lang, "ضبط الرصيد", "Set qty")}
            </button>
          </div>
        </form>
        <h2 className="mt-8 font-display text-2xl font-bold">{L(lang, "آخر الحركات", "Latest movements")}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {movements.length === 0 && <li className="text-muted">{L(lang, "لا حركات بعد. البيع والشراء والتحويل يظهرون هنا.", "No movements yet. Sales, purchases, and transfers show up here.")}</li>}
          {movements.slice(0, 20).map((m) => (
            <li key={m.id} className="rounded-2xl border border-line bg-surface px-3 py-2">
              {m.reason} · {m.sku} · {m.qty} · {m.fromBranch || "—"} → {m.toBranch || "—"} · {m.ref}
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
