import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Shell } from "@/components/shell";
import { money } from "@/data/catalog";
import { cartDetailed, L, useBendary } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "السلة | El-Bendary" }] }),
  component: CartPage,
});

function CartPage() {
  const lang = useBendary((s) => s.lang);
  const cart = useBendary((s) => s.cart);
  const setQty = useBendary((s) => s.setQty);
  const lines = cartDetailed(cart);
  const total = lines.reduce((n, l) => n + l.line, 0);

  return (
    <Shell>
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col px-4 py-4">
        <h1 className="font-display text-2xl font-extrabold">{L(lang, "سلة التسوق", "Shopping cart")}</h1>
        {lines.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="text-muted">{L(lang, "السلة فارغة.", "The cart is empty.")}</p>
            <Link to="/shop" search={{ q: "", cat: "all", price: "all", stock: "all" }} className="mt-4 inline-block font-semibold text-red">
              {L(lang, "إلى المتجر", "Go to the store")}
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-muted">{L(lang, "صيدليات البنداري", "El-Bendary Pharmacies")}</p>
            <ul className="mt-2 space-y-3">
              {lines.map((l) => (
                <li key={l.sku} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-sm">
                  <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-sand font-display text-lg font-extrabold text-red">
                    {(lang === "ar" ? l.product.nameAr : l.product.nameEn).slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{lang === "ar" ? l.product.nameAr : l.product.nameEn}</p>
                    <p className="mt-1 font-display text-lg font-extrabold text-red tabular-nums">{money(l.line, lang)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button type="button" className="grid size-8 place-items-center rounded-full bg-sand" onClick={() => setQty(l.sku, l.qty + 1)}>+</button>
                    <span className="tabular-nums">{l.qty}</span>
                    <button type="button" className="grid size-8 place-items-center rounded-full bg-sand" onClick={() => setQty(l.sku, l.qty - 1)}>−</button>
                  </div>
                  <button type="button" onClick={() => setQty(l.sku, 0)} aria-label={L(lang, "حذف", "Remove")} className="text-red">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between rounded-t-2xl bg-[#f6ead4] px-4 py-3">
                <span>{L(lang, "الإجمالي", "Total amount")}</span>
                <span className="font-bold tabular-nums">{money(total, lang)}</span>
              </div>
              <Link to="/checkout" className="block rounded-b-2xl bg-red py-3 text-center font-bold text-paper">
                {L(lang, "متابعة الشحن", "Proceed to shipping")}
              </Link>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
