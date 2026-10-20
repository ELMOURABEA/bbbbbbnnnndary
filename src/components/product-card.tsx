import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { categoryName, money, type Product } from "@/data/catalog";
import { L, useBendary, type Lang } from "@/lib/store";

const tile: Record<string, string> = {
  medicine: "bg-red-soft text-red-deep",
  digestion: "bg-sand text-ink",
  pain: "bg-red-soft text-red-deep",
  allergy: "bg-leaf-soft text-leaf",
  diabetes: "bg-sand text-ink",
  vitamins: "bg-leaf-soft text-leaf",
  mother: "bg-[#fde7c7] text-[#8a4b12]",
  skin: "bg-[#f7e7ea] text-red-deep",
  hair: "bg-sand text-ink",
  beauty: "bg-[#f7e7ea] text-red-deep",
  fragrance: "bg-sand text-ink",
  personal: "bg-leaf-soft text-leaf",
  devices: "bg-sand text-ink",
};

export function ProductCard({ product }: { product: Product }) {
  const lang = useBendary((s) => s.lang);
  const add = useBendary((s) => s.addToCart);
  const wish = useBendary((s) => s.wishlist.includes(product.sku));
  const toggleWish = useBendary((s) => s.toggleWish);
  const name = lang === "ar" ? product.nameAr : product.nameEn;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <Link to="/product/$sku" params={{ sku: product.sku }} className={`relative grid h-32 place-items-center ${tile[product.category] ?? "bg-sand"}`}>
        <span className="font-display text-3xl font-extrabold">{name.slice(0, 2)}</span>
        {product.offerAr && (
          <span className="absolute start-2 top-2 rounded-md bg-red px-1.5 py-0.5 text-[10px] font-bold text-paper">
            {L(lang, "عرض", "OFFER")}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWish(product.sku);
          }}
          className="absolute end-2 top-2 grid size-8 place-items-center rounded-full bg-surface/90"
          aria-label={L(lang, "مفضلة", "Favourite")}
        >
          <Heart className={`size-4 ${wish ? "fill-red text-red" : "text-ink"}`} />
        </button>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-semibold text-red">{categoryName(product.category, lang)}</p>
        <Link to="/product/$sku" params={{ sku: product.sku }} className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-snug">
          {name}
        </Link>
        <p className="mt-2 font-display text-lg font-extrabold tabular-nums">{money(product.price, lang)}</p>
        <p className={`text-xs font-semibold ${product.stock > 0 ? "text-leaf" : "text-muted"}`}>
          {product.stock > 0 ? L(lang, "متوفر", "In stock") : L(lang, "غير متوفر", "Out of stock")}
        </p>
        {product.rx ? (
          <Link to="/prescription" className="mt-3 rounded-full bg-sand py-2 text-center text-xs font-bold">
            {L(lang, "روشتة", "Needs Rx")}
          </Link>
        ) : (
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => add(product.sku, 1)}
            className="mt-3 inline-flex items-center justify-center gap-1 rounded-full bg-leaf py-2 text-xs font-bold text-paper disabled:opacity-40"
          >
            <ShoppingCart className="size-3.5" />
            {L(lang, "أضف للسلة", "Add to cart")}
          </button>
        )}
      </div>
    </article>
  );
}

export function priceBand(price: number) {
  if (price < 100) return "u100";
  if (price < 300) return "u300";
  if (price < 700) return "u700";
  return "over";
}

export function bandLabel(id: string, lang: Lang) {
  const map: Record<string, [string, string]> = {
    all: ["كل الأسعار", "Any price"],
    u100: ["أقل من ١٠٠", "Under 100"],
    u300: ["١٠٠ – ٣٠٠", "100 – 300"],
    u700: ["٣٠٠ – ٧٠٠", "300 – 700"],
    over: ["أكثر من ٧٠٠", "Over 700"],
  };
  const pair = map[id] ?? map.all;
  return L(lang, pair[0], pair[1]);
}