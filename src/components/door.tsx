import { useState, type FormEvent } from "react";
import { roleLabel, type StaffRole } from "@/lib/access";
import { L, useBendary } from "@/lib/store";

export function Door() {
  const lang = useBendary((s) => s.lang);
  const setLang = useBendary((s) => s.setLang);
  const enterCustomer = useBendary((s) => s.enterCustomer);
  const enterTeam = useBendary((s) => s.enterTeam);
  const staff = useBendary((s) => s.staff);
  const [door, setDoor] = useState<"customer" | "team">("customer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("pharmacist");
  const [error, setError] = useState("");

  function submitCustomer(e: FormEvent) {
    e.preventDefault();
    const clean = phone.replace(/\D/g, "");
    if (name.trim().length < 2 || clean.length < 10) {
      setError(L(lang, "اكتب الاسم وموبايل مصري من ١٠ أرقام على الأقل.", "Enter a name and a mobile of at least 10 digits."));
      return;
    }
    enterCustomer(name, clean);
  }

  function submitTeam(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError(L(lang, "اكتب اسم صاحب الوردية.", "Enter the name on this shift."));
      return;
    }
    enterTeam(name, role);
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <img src="/brand/logo.png" alt="El-Bendary Pharmacies" className="h-12 w-auto" />
        <button type="button" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="rounded-full border border-line px-3 py-2 text-xs font-semibold">
          {lang === "ar" ? "EN" : "عربي"}
        </button>
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <p className="text-xs font-semibold tracking-[0.16em] text-red">EL-BENDARY · SINCE 1980</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">
          {L(lang, "ادخل كعميل أو كفريق الوردية.", "Enter as a customer or as the shift team.")}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          {L(
            lang,
            "العميل يرى الواجهة والمتجر ومحادثاته فقط. الفريق يرى مكتب MoSTaa والمخزون والمالية حسب الدور. الجلسة تبقى على هذا الجهاز.",
            "Customers see the home, the market, and their own chats. The team sees MoSTaa, stock, and finance according to role. The session stays on this device.",
          )}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-sand p-1">
          <button type="button" onClick={() => setDoor("customer")} className={`rounded-full py-2 text-sm font-semibold ${door === "customer" ? "bg-surface" : ""}`}>
            {L(lang, "عميل", "Customer")}
          </button>
          <button type="button" onClick={() => setDoor("team")} className={`rounded-full py-2 text-sm font-semibold ${door === "team" ? "bg-surface" : ""}`}>
            {L(lang, "فريق", "Team")}
          </button>
        </div>
        {error && <p className="mt-4 text-sm font-semibold text-red-deep">{error}</p>}
        {door === "customer" ? (
          <form onSubmit={submitCustomer} className="mt-6 space-y-3 rounded-card border border-line bg-surface p-5">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">{L(lang, "الاسم", "Name")}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">{L(lang, "الموبايل", "Mobile")}</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="w-full rounded-xl border border-line bg-paper px-3 py-2.5" placeholder="01xxxxxxxxx" />
            </label>
            <button type="submit" className="rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-paper">
              {L(lang, "دخول المتجر", "Enter the market")}
            </button>
          </form>
        ) : (
          <form onSubmit={submitTeam} className="mt-6 space-y-3 rounded-card border border-line bg-surface p-5">
            <div className="flex flex-wrap gap-2">
              {staff.filter((s) => s.active).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setName(s.name);
                    setRole(s.role);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${name === s.name ? "bg-ink text-paper" : "bg-sand"}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">{L(lang, "الاسم على الوردية", "Name on the shift")}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">{L(lang, "الدور", "Role")}</span>
              <select value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className="w-full rounded-xl border border-line bg-paper px-3 py-2.5">
                {roleLabel.map((r) => (
                  <option key={r.id} value={r.id}>
                    {L(lang, r.ar, r.en)}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper">
              {L(lang, "دخول المكتب", "Enter the desk")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
