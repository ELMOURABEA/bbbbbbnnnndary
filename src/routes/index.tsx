import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, Snowflake, Truck, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Shell } from "@/components/shell";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/data/catalog";
import { HOTLINE } from "@/data/network";
import { L, useBendary } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "صيدليات البنداري | El-Bendary Pharmacies" },
      {
        name: "description",
        content: "El-Bendary Pharmacies since 1980. Shop, delivery, and prescription upload. Hotline 01200400094.",
      },
    ],
  }),
  component: Home,
});

const picks = ["LV-SET", "CPX-01", "GA", "0071491", "DEV-02", "CLR-05", "VIT-D", "BAB-01"];

function Home() {
  const lang = useBendary((s) => s.lang);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const shelf = products.filter((p) => picks.includes(p.sku));
  const offers = products.filter((p) => p.offerAr).slice(0, 4);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    void navigate({ to: "/shop", search: { q, cat: "all", price: "all", stock: "all" } });
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-4">
        <form onSubmit={onSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={L(lang, "ابحث عن صنف", "Search products")}
            className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm shadow-sm"
          />
        </form>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          <Promo
            tone="bg-red text-paper"
            kicker={L(lang, "عرض", "OFFER")}
            title={L(lang, "عروض خاصة", "Special offers")}
            href="/shop"
            search={{ q: "", cat: "all", price: "all", stock: "all" }}
          />
          <Promo
            tone="bg-ink text-paper"
            kicker="24/7"
            title={L(lang, "توصيل سريع", "Fast delivery")}
            href="/branches"
          />
          <Promo
            tone="bg-[#c45512] text-paper"
            kicker={L(lang, "دفع", "PAY")}
            title={L(lang, "دفع سهل وآمن", "Easy & secure payment")}
            href="/checkout"
          />
          <Link to="/prescription" className="flex w-64 shrink-0 flex-col justify-between rounded-3xl bg-red-soft p-4 text-red-deep">
            <Upload className="size-6" />
            <span className="font-display text-2xl font-extrabold leading-tight">{L(lang, "ارفع الروشتة", "Upload your prescription")}</span>
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to="/shop" search={{ q: "", cat: "all", price: "u100", stock: "all" }} className="rounded-2xl border border-line bg-surface px-4 py-4 text-center text-sm font-semibold">
            {L(lang, "عرض اليوم", "Today’s deal")}
          </Link>
          <Link to="/shop" search={{ q: "", cat: "vitamins", price: "all", stock: "all" }} className="rounded-2xl border border-line bg-surface px-4 py-4 text-center text-sm font-semibold">
            {L(lang, "عرض سريع", "Flash deal")}
          </Link>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <h2 className="font-display text-xl font-extrabold">{L(lang, "الأقسام", "Categories")}</h2>
          <Link to="/shop" search={{ q: "", cat: "all", price: "all", stock: "all" }} className="text-sm font-semibold text-red">
            {L(lang, "الكل", "All")}
          </Link>
        </div>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link key={c.id} to="/shop" search={{ q: "", cat: c.id, price: "all", stock: "all" }} className="flex w-20 shrink-0 flex-col items-center gap-2 text-center">
              <span className="grid size-16 place-items-center rounded-full border-4 border-red/20 bg-surface font-display text-lg font-extrabold text-red">
                {(lang === "ar" ? c.ar : c.en).slice(0, 1)}
              </span>
              <span className="text-xs font-semibold leading-tight">{lang === "ar" ? c.ar : c.en}</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-paper">
          <div>
            <p className="text-xs text-sand">{L(lang, "الخط الساخن ٢٤ ساعة", "24-hour hotline")}</p>
            <a href={`tel:${HOTLINE}`} className="font-display text-2xl font-extrabold tabular-nums">{HOTLINE}</a>
          </div>
          <Truck className="size-8 text-red" />
        </div>

        <h2 className="mt-8 font-display text-xl font-extrabold">{L(lang, "أصناف مختارة", "Featured")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {shelf.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>

        {offers.length > 0 && (
          <>
            <h2 className="mt-8 font-display text-xl font-extrabold">{L(lang, "على الكاونتر", "On the counter")}</h2>
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {offers.map((p) => (
                <li key={p.sku}>
                  <Link to="/product/$sku" params={{ sku: p.sku }} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="font-semibold">{lang === "ar" ? p.nameAr : p.nameEn}</span>
                    <span className="text-xs font-semibold text-leaf">{lang === "ar" ? p.offerAr : p.offerEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <Snowflake className="size-5 text-red" />
            <p className="mt-2 font-semibold">{L(lang, "شحن مبرد", "Cooled delivery")}</p>
            <p className="text-sm text-muted">{L(lang, "للأصناف التي لا تحتمل الحرارة.", "For items that should stay cold.")}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <Clock className="size-5 text-red" />
            <p className="mt-2 font-semibold">{L(lang, "صيدلي في الوردية", "Pharmacist on shift")}</p>
            <p className="text-sm text-muted">{L(lang, "الروشتة تُراجع قبل الصرف.", "A prescription is checked before it leaves.")}</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Promo({
  tone,
  kicker,
  title,
  href,
  search,
}: {
  tone: string;
  kicker: string;
  title: string;
  href: "/shop" | "/branches" | "/checkout";
  search?: { q: string; cat: string; price: string; stock: string };
}) {
  return (
    <Link to={href} search={search} className={`flex w-64 shrink-0 flex-col justify-between rounded-3xl p-4 ${tone}`}>
      <span className="text-xs font-bold tracking-[0.2em]">{kicker}</span>
      <span className="font-display text-2xl font-extrabold leading-tight">{title}</span>
    </Link>
  );
}
