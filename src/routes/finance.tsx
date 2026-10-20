import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { products } from "@/data/catalog";
import { allows, type Perm } from "@/lib/access";
import { L, useBendary, useBranchBook, type Receipt, type TenderKind } from "@/lib/store";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "المالية | El-Bendary" }] }),
  component: FinancePage,
});

type Line = { sku: string; nameAr: string; nameEn: string; qty: number; price: number };

function FinancePage() {
  const lang = useBendary((s) => s.lang);
  const role = useBendary((s) => s.role);
  const matrix = useBendary((s) => s.matrix);
  const tabs = (
    [
      ["pos", "pos"],
      ["purchase", "purchase"],
      ["daily", "reports"],
      ["shift", "shift"],
    ] as const
  ).filter(([, perm]) => allows(matrix, role, perm as Perm));
  const [tab, setTab] = useState<(typeof tabs)[number]["0"] | "receipt">(tabs[0]?.[0] ?? "receipt");
  const [last, setLast] = useState<Receipt | null>(null);

  if (tabs.length === 0) {
    return (
      <Shell>
        <p className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-muted">
          {L(lang, "لا صلاحية مالية لهذا الدور.", "This role has no finance access.")}
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-xs font-semibold tracking-wide text-red">{L(lang, "المالية", "Finance")}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold">{L(lang, "إيصال، شراء، وتقارير الوردية", "Receipts, purchases, shift reports")}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map(([id,]) => (
            <button key={id} type="button" onClick={() => setTab(id)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${tab === id ? "bg-ink text-paper" : "bg-sand"}`}>
              {L(lang, { pos: "نقطة البيع", purchase: "مشتريات", daily: "يومي", shift: "الوردية" }[id], { pos: "POS", purchase: "Purchase", daily: "Daily", shift: "Shift" }[id])}
            </button>
          ))}
          {last && (
            <button type="button" onClick={() => setTab("receipt")} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${tab === "receipt" ? "bg-red text-paper" : "bg-red-soft text-red-deep"}`}>
              {last.id}
            </button>
          )}
        </div>
        {tab === "pos" && allows(matrix, role, "pos") && <SaleForm kind="pos" onSaved={(r) => { setLast(r); setTab("receipt"); }} />}
        {tab === "purchase" && allows(matrix, role, "purchase") && <SaleForm kind="purchase" onSaved={(r) => { setLast(r); setTab("receipt"); }} />}
        {tab === "daily" && allows(matrix, role, "reports") && <DailyReport />}
        {tab === "shift" && allows(matrix, role, "shift") && <ShiftPanel />}
        {tab === "receipt" && last && <ReceiptSheet receipt={last} />}
      </div>
    </Shell>
  );
}

function SaleForm({ kind, onSaved }: { kind: "pos" | "purchase"; onSaved: (r: Receipt) => void }) {
  const lang = useBendary((s) => s.lang);
  const book = useBranchBook();
  const savePos = useBendary((s) => s.savePos);
  const savePurchase = useBendary((s) => s.savePurchase);
  const [branchId, setBranchId] = useState(book[0]?.id ?? "galaa-1");
  const [q, setQ] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [tender, setTender] = useState<TenderKind>("cash");
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState("");
  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    return products.filter((p) => `${p.nameAr} ${p.nameEn} ${p.sku}`.toLowerCase().includes(needle)).slice(0, 6);
  }, [q]);
  const total = lines.reduce((n, l) => n + l.price * l.qty, 0);

  function add(sku: string) {
    const product = products.find((p) => p.sku === sku);
    if (!product) return;
    setLines((prev) => {
      const hit = prev.find((l) => l.sku === sku);
      if (hit) return prev.map((l) => (l.sku === sku ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { sku, nameAr: product.nameAr, nameEn: product.nameEn, qty: 1, price: product.price }];
    });
    setQ("");
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_18rem]">
      <div className="rounded-card border border-line bg-surface p-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">{L(lang, "الفرع", "Branch")}</span>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5">
            {book.map((b) => (
              <option key={b.id} value={b.id}>{lang === "ar" ? b.nameAr : b.nameEn}</option>
            ))}
          </select>
        </label>
        {kind === "purchase" && (
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium">{L(lang, "المورد", "Supplier")}</span>
            <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5" />
          </label>
        )}
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">{L(lang, "ابحث عن صنف", "Find an item")}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5" />
        </label>
        <ul className="mt-2 space-y-1">
          {hits.map((p) => (
            <li key={p.sku}>
              <button type="button" onClick={() => add(p.sku)} className="flex w-full justify-between rounded-xl px-2 py-1.5 text-start text-sm hover:bg-sand">
                <span>{lang === "ar" ? p.nameAr : p.nameEn}</span>
                <span className="tabular-nums">{p.price}</span>
              </button>
            </li>
          ))}
        </ul>
        <ul className="mt-4 space-y-2">
          {lines.map((l) => (
            <li key={l.sku} className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate">{lang === "ar" ? l.nameAr : l.nameEn}</span>
              <span className="tabular-nums">{l.qty} × {l.price}</span>
              <button type="button" onClick={() => setLines((prev) => prev.filter((x) => x.sku !== l.sku))} className="text-xs text-red">
                {L(lang, "حذف", "Remove")}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit rounded-card border border-line bg-surface p-4">
        <p className="text-sm text-muted">{L(lang, "الإجمالي", "Total")}</p>
        <p className="font-display text-3xl font-extrabold tabular-nums">{total} {L(lang, "ج.م", "EGP")}</p>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">{L(lang, "طريقة الدفع", "Tender")}</span>
          <select value={tender} onChange={(e) => setTender(e.target.value as TenderKind)} className="w-full rounded-xl border border-line bg-paper px-3 py-2">
            <option value="cash">{L(lang, "نقدي", "Cash")}</option>
            <option value="instapay">Instapay</option>
            <option value="vodafone">{L(lang, "فودافون كاش", "Vodafone Cash")}</option>
            <option value="card">{L(lang, "بطاقة", "Card")}</option>
          </select>
        </label>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">{L(lang, "ملاحظة", "Note")}</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2" />
        </label>
        <button
          type="button"
          disabled={lines.length === 0}
          onClick={() => {
            const draft = { branchId, lines, total, tender, supplier, note };
            onSaved(kind === "pos" ? savePos(draft) : savePurchase(draft));
            setLines([]);
            setNote("");
          }}
          className="mt-4 w-full rounded-full bg-red px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-40"
        >
          {L(lang, "حفظ الإيصال", "Save receipt")}
        </button>
      </aside>
    </div>
  );
}

function ReceiptSheet({ receipt }: { receipt: Receipt }) {
  const lang = useBendary((s) => s.lang);
  const book = useBranchBook();
  const branch = book.find((b) => b.id === receipt.branchId);
  return (
    <article className="receipt-print mx-auto mt-6 max-w-md rounded-card border border-line bg-surface p-6">
      <p className="text-xs font-semibold tracking-wide text-red">EL-BENDARY PHARMACIES</p>
      <h2 className="mt-1 font-display text-2xl font-bold">{receipt.kind === "pos" ? L(lang, "إيصال بيع", "Sales receipt") : L(lang, "إيصال شراء", "Purchase receipt")}</h2>
      <p className="mt-2 text-sm">{receipt.id} · {new Date(receipt.at).toLocaleString(lang === "ar" ? "ar-EG" : "en-GB")}</p>
      <p className="text-sm text-muted">{branch ? (lang === "ar" ? branch.nameAr : branch.nameEn) : receipt.branchId} · {receipt.staff}</p>
      {receipt.supplier && <p className="text-sm">{L(lang, "المورد", "Supplier")}: {receipt.supplier}</p>}
      <ul className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
        {receipt.lines.map((l) => (
          <li key={l.sku} className="flex justify-between gap-3">
            <span>{lang === "ar" ? l.nameAr : l.nameEn} × {l.qty}</span>
            <span className="tabular-nums">{l.price * l.qty}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between border-t border-line pt-3 font-display text-xl font-bold">
        <span>{receipt.tender}</span>
        <span className="tabular-nums">{receipt.total} {L(lang, "ج.م", "EGP")}</span>
      </p>
      {receipt.note && <p className="mt-2 text-sm text-muted">{receipt.note}</p>}
      <p className="mt-4 text-xs text-muted">{L(lang, "مستند معاينة على هذا الجهاز. ليس فاتورة ضريبية.", "A preview document on this device. Not a tax invoice.")}</p>
      <button type="button" onClick={() => window.print()} className="no-print mt-4 rounded-full border border-ink px-4 py-2 text-sm font-semibold">
        {L(lang, "طباعة", "Print")}
      </button>
    </article>
  );
}

function DailyReport() {
  const lang = useBendary((s) => s.lang);
  const receipts = useBendary((s) => s.receipts);
  const book = useBranchBook();
  const today = new Date().toDateString();
  const rows = receipts.filter((r) => new Date(r.at).toDateString() === today);
  const sales = rows.filter((r) => r.kind === "pos").reduce((n, r) => n + r.total, 0);
  const buys = rows.filter((r) => r.kind === "purchase").reduce((n, r) => n + r.total, 0);
  return (
    <section className="receipt-print mt-6 rounded-card border border-line bg-surface p-4">
      <h2 className="font-display text-2xl font-bold">{L(lang, "تقرير اليوم", "Today’s report")}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Stat label={L(lang, "مبيعات", "Sales")} value={`${sales}`} />
        <Stat label={L(lang, "مشتريات", "Purchases")} value={`${buys}`} />
        <Stat label={L(lang, "مستندات", "Documents")} value={String(rows.length)} />
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {rows.length === 0 && <li className="text-muted">{L(lang, "لا حركة اليوم بعد.", "No movement yet today.")}</li>}
        {rows.map((r) => {
          const branch = book.find((b) => b.id === r.branchId);
          return (
            <li key={r.id} className="flex justify-between gap-3 border-t border-line py-2">
              <span>{r.id} · {r.kind} · {branch ? (lang === "ar" ? branch.nameAr : branch.nameEn) : r.branchId}</span>
              <span className="tabular-nums">{r.total}</span>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={() => window.print()} className="no-print mt-4 rounded-full border border-ink px-4 py-2 text-sm font-semibold">
        {L(lang, "طباعة التقرير", "Print report")}
      </button>
    </section>
  );
}

function ShiftPanel() {
  const lang = useBendary((s) => s.lang);
  const book = useBranchBook();
  const shifts = useBendary((s) => s.shifts);
  const receipts = useBendary((s) => s.receipts);
  const openShift = useBendary((s) => s.openShift);
  const closeShift = useBendary((s) => s.closeShift);
  const [branchId, setBranchId] = useState(book[0]?.id ?? "galaa-1");
  const [floatCash, setFloatCash] = useState(500);
  const [closing, setClosing] = useState(0);
  const [note, setNote] = useState("");
  const open = shifts.find((s) => s.branchId === branchId && !s.closedAt);
  const taken = open ? receipts.filter((r) => r.shiftId === open.id && r.kind === "pos" && r.tender === "cash").reduce((n, r) => n + r.total, 0) : 0;
  const closed = shifts.filter((s) => s.closedAt).slice(0, 6);

  return (
    <section className="mt-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-card border border-line bg-surface p-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">{L(lang, "الفرع", "Branch")}</span>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5">
            {book.map((b) => (
              <option key={b.id} value={b.id}>{lang === "ar" ? b.nameAr : b.nameEn}</option>
            ))}
          </select>
        </label>
        {!open ? (
          <div className="mt-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">{L(lang, "عهدة الافتتاح", "Opening float")}</span>
              <input type="number" value={floatCash} onChange={(e) => setFloatCash(Number(e.target.value))} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5" />
            </label>
            <button type="button" onClick={() => openShift(branchId, floatCash)} className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">
              {L(lang, "فتح الوردية", "Open shift")}
            </button>
          </div>
        ) : (
          <div className="receipt-print mt-3 text-sm">
            <p className="font-semibold">{open.id} · {open.staff}</p>
            <p className="text-muted">{L(lang, "افتتاح", "Opened")} {new Date(open.openedAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-GB")}</p>
            <p className="mt-2">{L(lang, "العهدة", "Float")} {open.openingFloat} · {L(lang, "نقد المبيعات", "Cash sales")} {taken}</p>
            <p>{L(lang, "المتوقع في الدرج", "Expected drawer")} {open.openingFloat + taken}</p>
            <label className="mt-3 block">
              <span className="mb-1 block font-medium">{L(lang, "العد الفعلي", "Counted cash")}</span>
              <input type="number" value={closing} onChange={(e) => setClosing(Number(e.target.value))} className="w-full rounded-xl border border-line bg-paper px-3 py-2" />
            </label>
            <label className="mt-2 block">
              <span className="mb-1 block font-medium">{L(lang, "ملاحظة الإقفال", "Close note")}</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2" />
            </label>
            <p className="mt-2 font-semibold">{L(lang, "الفرق", "Variance")} {closing - (open.openingFloat + taken)}</p>
            <div className="no-print mt-3 flex gap-2">
              <button type="button" onClick={() => closeShift(open.id, closing, note)} className="rounded-full bg-red px-4 py-2 text-sm font-semibold text-paper">
                {L(lang, "إقفال الوردية", "Close shift")}
              </button>
              <button type="button" onClick={() => window.print()} className="rounded-full border border-ink px-4 py-2 text-sm font-semibold">
                {L(lang, "طباعة", "Print")}
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className="font-display text-xl font-bold">{L(lang, "ورديات مغلقة", "Closed shifts")}</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {closed.length === 0 && <li className="text-muted">{L(lang, "لا إقفال بعد.", "Nothing closed yet.")}</li>}
          {closed.map((s) => (
            <li key={s.id} className="rounded-2xl border border-line bg-surface px-3 py-2">
              <p className="font-semibold">{s.id} · {s.staff}</p>
              <p className="text-muted">{L(lang, "عهدة", "Float")} {s.openingFloat} → {s.closingCash} · {s.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-paper p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-display text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
