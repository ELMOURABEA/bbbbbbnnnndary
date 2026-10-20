import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { allows, permList, roleLabel, type StaffRole } from "@/lib/access";
import { L, useBendary, useBranchBook, type StaffAccount } from "@/lib/store";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "الحسابات | El-Bendary" }] }),
  component: TeamPage,
});

function TeamPage() {
  const lang = useBendary((s) => s.lang);
  const role = useBendary((s) => s.role);
  const matrix = useBendary((s) => s.matrix);
  const staff = useBendary((s) => s.staff);
  const saveStaff = useBendary((s) => s.saveStaff);
  const togglePerm = useBendary((s) => s.togglePerm);
  const book = useBranchBook();
  const [name, setName] = useState("");
  const [staffRole, setStaffRole] = useState<StaffRole>("pharmacist");
  const [branchId, setBranchId] = useState(book[0]?.id ?? "galaa-1");

  if (!allows(matrix, role, "team")) {
    return (
      <Shell>
        <p className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-muted">
          {L(lang, "صلاحية الحسابات للمالك والموارد البشرية.", "Accounts are for the owner and HR.")}
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-xs font-semibold tracking-wide text-red">{L(lang, "الحسابات", "Accounts")}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold">{L(lang, "الأدوار والصلاحيات", "Roles and permissions")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {L(lang, "المالك يبقى مفتوحاً لكل الأبواب حتى لا تُقفل المجموعة على نفسها. باقي الأدوار تُضبط من هنا.", "The owner keeps every door, so the group cannot lock itself out. Every other role is set here.")}
        </p>
        <form
          className="mt-5 grid gap-3 rounded-card border border-line bg-surface p-4 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim().length < 2) return;
            const account: StaffAccount = {
              id: `s-${Date.now()}`,
              name: name.trim(),
              role: staffRole,
              branchId,
              active: true,
            };
            saveStaff(account);
            setName("");
          }}
        >
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={L(lang, "اسم الموظف", "Staff name")} className="rounded-xl border border-line bg-paper px-3 py-2 text-sm" />
          <select value={staffRole} onChange={(e) => setStaffRole(e.target.value as StaffRole)} className="rounded-xl border border-line bg-paper px-3 py-2 text-sm">
            {roleLabel.map((r) => <option key={r.id} value={r.id}>{L(lang, r.ar, r.en)}</option>)}
          </select>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="rounded-xl border border-line bg-paper px-3 py-2 text-sm">
            {book.map((b) => <option key={b.id} value={b.id}>{lang === "ar" ? b.nameAr : b.nameEn}</option>)}
          </select>
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">{L(lang, "إضافة", "Add")}</button>
        </form>
        <ul className="mt-4 space-y-2">
          {staff.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
              <span className="font-semibold">{s.name}</span>
              <span className="text-muted">{roleLabel.find((r) => r.id === s.role)?.[lang === "ar" ? "ar" : "en"]} · {book.find((b) => b.id === s.branchId)?.[lang === "ar" ? "nameAr" : "nameEn"] ?? s.branchId}</span>
              <button type="button" onClick={() => saveStaff({ ...s, active: !s.active })} className="rounded-full bg-sand px-3 py-1 text-xs font-semibold">
                {s.active ? L(lang, "إيقاف", "Pause") : L(lang, "تفعيل", "Activate")}
              </button>
            </li>
          ))}
        </ul>
        <h2 className="mt-8 font-display text-2xl font-bold">{L(lang, "مصفوفة الصلاحيات", "Permission matrix")}</h2>
        <div className="mt-3 overflow-x-auto rounded-card border border-line bg-surface">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="text-start text-xs text-muted">
                <th className="px-3 py-2 font-medium">{L(lang, "الدور", "Role")}</th>
                {permList.map((p) => (
                  <th key={p.id} className="px-2 py-2 font-medium">{L(lang, p.ar, p.en)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roleLabel.map((r) => (
                <tr key={r.id} className="border-t border-line">
                  <td className="px-3 py-2 font-semibold">{L(lang, r.ar, r.en)}</td>
                  {permList.map((p) => {
                    const on = allows(matrix, r.id, p.id);
                    return (
                      <td key={p.id} className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={on}
                          disabled={r.id === "owner"}
                          onChange={() => togglePerm(r.id, p.id)}
                          aria-label={`${r.en} ${p.en}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
