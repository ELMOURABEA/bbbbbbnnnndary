import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/shell";
import type { Branch } from "@/data/network";
import { allows } from "@/lib/access";
import { L, useBendary, useBranchBook } from "@/lib/store";

export const Route = createFileRoute("/branches")({
  head: () => ({ meta: [{ title: "الفروع | El-Bendary" }] }),
  component: BranchesPage,
});

function BranchesPage() {
  const lang = useBendary((s) => s.lang);
  const portal = useBendary((s) => s.portal);
  const role = useBendary((s) => s.role);
  const matrix = useBendary((s) => s.matrix);
  const saveBranch = useBendary((s) => s.saveBranch);
  const removeBranch = useBendary((s) => s.removeBranch);
  const branches = useBranchBook();
  const canEdit = portal === "team" && allows(matrix, role, "branches");
  const [region, setRegion] = useState<"all" | "tanta" | "cairo" | "coast">("all");
  const [editing, setEditing] = useState<string | null>(null);
  const list = branches.filter((b) => region === "all" || b.region === region);
  const filters = [
    ["all", "الكل", "All"],
    ["tanta", "طنطا", "Tanta"],
    ["cairo", "القاهرة والجيزة", "Cairo & Giza"],
    ["coast", "الساحل", "Coast"],
  ] as const;

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-4xl font-extrabold">{L(lang, "الفروع", "Branches")}</h1>
        <p className="mt-2 max-w-2xl text-muted">
          {L(
            lang,
            "العناوين المنشورة لفروع البنداري، بأرقام الصفحة الحيّة. ملف ون درايف كان خاصاً فلم يُفتح. الفريق يعدّل الفرع من هنا وتبقى التعديلات على هذا الجهاز.",
            "Published Bendary counters, with the live page numbers. The OneDrive workbook was private, so it stayed closed. The team can edit a branch here; changes stay on this device.",
          )}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map(([id, ar, en]) => (
            <button
              key={id}
              type="button"
              onClick={() => setRegion(id)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${region === id ? "bg-ink text-paper" : "bg-sand"}`}
            >
              {L(lang, ar, en)}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map((b) => (
            <article key={b.id} className="rounded-card border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-red">{lang === "ar" ? b.cityAr : b.cityEn}</p>
                {b.main && <span className="text-xs font-semibold text-leaf">{L(lang, "الفرع الرئيسي", "Main branch")}</span>}
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">{lang === "ar" ? b.nameAr : b.nameEn}</h2>
              <p className="mt-2 flex gap-2 text-sm text-muted">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {lang === "ar" ? b.addressAr : b.addressEn}
              </p>
              <p className="mt-2 text-sm">{lang === "ar" ? b.hoursAr : b.hoursEn}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {b.phone && (
                  <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5">
                    <Phone className="size-3.5" />
                    {b.phone}
                  </a>
                )}
                {b.phone2 && (
                  <a href={`tel:${b.phone2}`} className="rounded-full border border-line px-3 py-1.5">
                    {b.phone2}
                  </a>
                )}
                <a href={`https://wa.me/${b.whatsapp}`} className="rounded-full bg-leaf px-3 py-1.5 font-semibold text-paper">
                  WhatsApp
                </a>
                <a href={b.maps} className="rounded-full border border-line px-3 py-1.5">
                  {L(lang, "الخريطة", "Map")}
                </a>
                {canEdit && (
                  <button type="button" onClick={() => setEditing(editing === b.id ? null : b.id)} className="rounded-full bg-sand px-3 py-1.5 font-semibold">
                    {L(lang, "تعديل", "Edit")}
                  </button>
                )}
              </div>
              {canEdit && editing === b.id && <BranchForm branch={b} onSave={(next) => { saveBranch(next); setEditing(null); }} onRemove={() => removeBranch(b.id)} />}
            </article>
          ))}
        </div>
        {canEdit && (
          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold">{L(lang, "فرع جديد", "New branch")}</h2>
            <BranchForm
              branch={{
                id: "",
                nameAr: "",
                nameEn: "",
                cityAr: "طنطا",
                cityEn: "Tanta",
                region: "tanta",
                addressAr: "",
                addressEn: "",
                whatsapp: "201200400094",
                hoursAr: "حسب الوردية",
                hoursEn: "Shift hours",
                maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy",
              }}
              onSave={(next) => saveBranch({ ...next, id: next.id || next.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `b-${Date.now()}` })}
            />
          </div>
        )}
      </div>
    </Shell>
  );
}

function BranchForm({ branch, onSave, onRemove }: { branch: Branch; onSave: (b: Branch) => void; onRemove?: () => void }) {
  const lang = useBendary((s) => s.lang);
  const [draft, setDraft] = useState(branch);
  function set<K extends keyof Branch>(key: K, value: Branch[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  return (
    <form
      className="mt-4 grid gap-2 border-t border-line pt-3 text-sm md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
      }}
    >
      <input value={draft.nameAr} onChange={(e) => set("nameAr", e.target.value)} placeholder="الاسم عربي" className="rounded-xl border border-line px-3 py-2" />
      <input value={draft.nameEn} onChange={(e) => set("nameEn", e.target.value)} placeholder="English name" className="rounded-xl border border-line px-3 py-2" />
      <input value={draft.addressAr} onChange={(e) => set("addressAr", e.target.value)} placeholder="العنوان" className="rounded-xl border border-line px-3 py-2" />
      <input value={draft.addressEn} onChange={(e) => set("addressEn", e.target.value)} placeholder="Address" className="rounded-xl border border-line px-3 py-2" />
      <input value={draft.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder={L(lang, "هاتف", "Phone")} className="rounded-xl border border-line px-3 py-2" />
      <input value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} placeholder="WhatsApp" className="rounded-xl border border-line px-3 py-2" />
      <select value={draft.region} onChange={(e) => set("region", e.target.value as Branch["region"])} className="rounded-xl border border-line px-3 py-2">
        <option value="tanta">Tanta</option>
        <option value="cairo">Cairo</option>
        <option value="coast">Coast</option>
      </select>
      <input value={draft.hoursAr} onChange={(e) => set("hoursAr", e.target.value)} className="rounded-xl border border-line px-3 py-2" />
      <div className="flex gap-2 md:col-span-2">
        <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">{L(lang, "حفظ", "Save")}</button>
        {onRemove && (
          <button type="button" onClick={onRemove} className="rounded-full border border-red px-4 py-2 text-sm font-semibold text-red">
            {L(lang, "إخفاء الفرع", "Hide branch")}
          </button>
        )}
      </div>
    </form>
  );
}
