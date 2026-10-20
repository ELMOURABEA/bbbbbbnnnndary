import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, GitCompare, Heart, MapPin, Phone, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { findProduct } from "@/data/catalog";
import { HOTLINE } from "@/data/network";
import { L, useBendary } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "حسابي | El-Bendary" }] }),
  component: AccountPage,
});

function AccountPage() {
  const lang = useBendary((s) => s.lang);
  const setLang = useBendary((s) => s.setLang);
  const name = useBendary((s) => s.displayName);
  const phone = useBendary((s) => s.phone);
  const orders = useBendary((s) => s.orders);
  const wishlist = useBendary((s) => s.wishlist);
  const reminders = useBendary((s) => s.reminders);
  const addReminder = useBendary((s) => s.addReminder);
  const removeReminder = useBendary((s) => s.removeReminder);
  const leave = useBendary((s) => s.leave);
  const [note, setNote] = useState("");
  const saved = wishlist.map((sku) => findProduct(sku)).filter((item) => item != null);

  return (
    <Shell>
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-14 place-items-center rounded-full bg-red text-lg font-bold text-paper">
            {(name || "B").slice(0, 1)}
          </span>
          <div>
            <p className="font-display text-2xl font-extrabold">{name || L(lang, "عميل", "Customer")}</p>
            <p className="text-sm text-muted">{phone}</p>
          </div>
        </div>

        <p className="mt-6 text-xs font-bold tracking-wide text-muted">{L(lang, "حسابي", "My account")}</p>
        <ul className="mt-2 overflow-hidden rounded-2xl border border-line bg-surface">
          <Row icon={User} title={L(lang, "الملف", "Profile")} hint={L(lang, "الاسم والموبايل على هذا الجهاز", "Name and mobile on this device")} />
          <Row icon={Heart} title={L(lang, "المفضلة", "Favourites")} hint={L(lang, `${saved.length} أصناف`, `${saved.length} items`)} />
          <Row icon={GitCompare} title={L(lang, "مقارنة", "Compare")} hint={L(lang, "من صفحة الصنف", "From a product page")} />
          <Link to="/track" search={{ id: "" }} className="block">
            <Row icon={ShoppingBag} title={L(lang, "الطلبات", "Orders")} hint={L(lang, `${orders.length} طلبات`, `${orders.length} orders`)} />
          </Link>
        </ul>

        {saved.length > 0 && (
          <ul className="mt-3 space-y-2">
            {saved.map((p) => (
              <li key={p.sku}>
                <Link to="/product/$sku" params={{ sku: p.sku }} className="block rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold">
                  {lang === "ar" ? p.nameAr : p.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-xs font-bold tracking-wide text-muted">{L(lang, "إعدادات", "Settings")}</p>
        <ul className="mt-2 overflow-hidden rounded-2xl border border-line bg-surface">
          <li className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Bell className="size-5 text-leaf" />
            <form
              className="flex min-w-0 flex-1 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return;
                addReminder(note.trim());
                setNote("");
              }}
            >
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={L(lang, "أضف تذكير دواء", "Add a medicine reminder")} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              <button type="submit" className="text-xs font-bold text-red">{L(lang, "حفظ", "Save")}</button>
            </form>
          </li>
          {reminders.map((item) => (
            <li key={item.id} className="flex items-center justify-between border-b border-line px-4 py-2 text-sm">
              <span>{item.text}</span>
              <button type="button" onClick={() => removeReminder(item.id)} className="text-xs text-muted">{L(lang, "حذف", "Remove")}</button>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="flex w-full items-center gap-3 px-4 py-3 text-start">
              <span className="grid size-9 place-items-center rounded-full bg-leaf-soft text-xs font-bold text-leaf">{lang === "ar" ? "EN" : "ع"}</span>
              <span>
                <span className="block font-semibold">{L(lang, "اللغة", "Language")}</span>
                <span className="text-xs text-muted">{L(lang, "اختر اللغة", "Choose your language")}</span>
              </span>
            </button>
          </li>
        </ul>

        <p className="mt-6 text-xs font-bold tracking-wide text-muted">{L(lang, "تواصل", "Reach us")}</p>
        <ul className="mt-2 overflow-hidden rounded-2xl border border-line bg-surface">
          <li>
            <a href={`tel:${HOTLINE}`} className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Phone className="size-5 text-leaf" />
              <span>
                <span className="block font-semibold">{L(lang, "اتصل بنا", "Contact us")}</span>
                <span className="text-xs text-muted tabular-nums">{HOTLINE}</span>
              </span>
            </a>
          </li>
          <li>
            <Link to="/branches" className="flex items-center gap-3 px-4 py-3">
              <MapPin className="size-5 text-leaf" />
              <span className="font-semibold">{L(lang, "الفروع", "Branches")}</span>
            </Link>
          </li>
        </ul>
        <button type="button" onClick={() => leave()} className="mt-6 w-full rounded-2xl border border-line py-3 text-sm font-semibold">
          {L(lang, "خروج", "Log out")}
        </button>
      </div>
    </Shell>
  );
}

function Row({ icon: Icon, title, hint }: { icon: typeof User; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
      <span className="grid size-9 place-items-center rounded-full bg-leaf-soft text-leaf">
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="text-xs text-muted">{hint}</span>
      </span>
    </div>
  );
}
