import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { categoryName, findProduct, money } from "@/data/catalog";
import { L, useBendary } from "@/lib/store";

export const Route = createFileRoute("/product/$sku")({
  head: ({ params }) => ({
    meta: [{ title: `${params.sku} | El-Bendary` }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { sku } = Route.useParams();
  const lang = useBendary((s) => s.lang);
  const add = useBendary((s) => s.addToCart);
  const wish = useBendary((s) => s.wishlist.includes(sku));
  const toggleWish = useBendary((s) => s.toggleWish);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const product = findProduct(sku);

  if (!product) {
    return (
      <Shell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="font-display text-3xl font-extrabold">{L(lang, "الصنف غير موجود", "Item not in the catalog")}</h1>
          <Link to="/shop" search={{ q: "", cat: "all", price: "all", stock: "all" }} className="mt-4 inline-block text-sm font-semibold text-red">
            {L(lang, "العودة للمتجر", "Back to the store")}
          </Link>
        </div>
      </Shell>
    );
  }

  const name = lang === "ar" ? product.nameAr : product.nameEn;

  return (
    <Shell>
      <article className="mx-auto max-w-lg px-4 py-4">
        <div className="relative grid h-72 place-items-center rounded-3xl bg-sand">
          {product.offerAr && (
            <span className="absolute start-4 top-4 rotate-[-8deg] rounded-2xl bg-red px-3 py-2 text-center text-xs font-extrabold leading-tight text-paper">
              {L(lang, "عرض", "SPECIAL")}
              <span className="block text-base">{L(lang, "خاص", "OFFER")}</span>
            </span>
          )}
          <button type="button" onClick={() => toggleWish(product.sku)} className="absolute end-4 top-4 grid size-10 place-items-center rounded-full bg-surface" aria-label="wish">
            <Heart className={`size-5 ${wish ? "fill-red text-red" : ""}`} />
          </button>
          <p className="font-display text-6xl font-extrabold text-ink/20">{name.slice(0, 2)}</p>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="font-semibold text-[#c45512]">{categoryName(product.category, lang)}</p>
          <p className="inline-flex items-center gap-1 text-muted">
            <Star className="size-4 fill-[#e0b15a] text-[#e0b15a]" />
            <Star className="size-4 fill-[#e0b15a] text-[#e0b15a]" />
            <Star className="size-4 fill-[#e0b15a] text-[#e0b15a]" />
            <Star className="size-4 fill-[#e0b15a] text-[#e0b15a]" />
            <Star className="size-4 text-line" />
          </p>
        </div>
        <h1 className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight">{name}</h1>
        <div className="mt-3 flex items-end justify-between">
          <p className="font-display text-3xl font-extrabold text-red tabular-nums">{money(product.price, lang)}</p>
          <p className={`text-sm font-semibold ${product.stock > 0 ? "text-leaf" : "text-muted"}`}>
            {product.stock > 0 ? L(lang, "متوفر", "In stock") : L(lang, "غير متوفر", "Out of stock")}
          </p>
        </div>
        <div className="mt-4 inline-flex items-center gap-4 rounded-2xl bg-sand px-4 py-2">
          <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} className="text-lg">−</button>
          <span className="tabular-nums">{qty}</span>
          <button type="button" onClick={() => setQty((n) => n + 1)} className="text-lg">+</button>
        </div>
        <div className="mt-4">
          {product.rx ? (
            <Link to="/prescription" className="block rounded-2xl bg-red py-3 text-center text-sm font-bold text-paper">
              {L(lang, "هذا الصنف بروشتة", "Upload a prescription")}
            </Link>
          ) : (
            <button type="button" disabled={product.stock <= 0} onClick={() => add(product.sku, qty)} className="w-full rounded-2xl bg-leaf py-3 text-sm font-bold text-paper disabled:opacity-40">
              {L(lang, "أضف إلى السلة", "Add to cart")}
            </button>
          )}
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="mt-4 flex w-full items-center justify-between border-t border-line py-4 text-sm font-semibold">
          {L(lang, "الوصف", "Description")}
          <span>{open ? "–" : ">"}</span>
        </button>
        {open && <p className="pb-4 text-sm text-muted">{lang === "ar" ? product.blurbAr : product.blurbEn}</p>}
        <p className="text-xs text-muted">SKU {product.sku}{product.cold ? L(lang, " · شحن مبرد", " · cooled shipping") : ""}</p>
      </article>
    </Shell>
  );
}
