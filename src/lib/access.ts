export type StaffRole = "owner" | "hr" | "manager" | "pharmacist" | "cashier" | "inventory" | "driver";

export type Perm =
  | "desk"
  | "ops"
  | "stock"
  | "pos"
  | "purchase"
  | "reports"
  | "shift"
  | "team"
  | "branches";

export const permList: { id: Perm; ar: string; en: string }[] = [
  { id: "desk", ar: "مكتب MoSTaa", en: "MoSTaa desk" },
  { id: "ops", ar: "التشغيل", en: "Operations" },
  { id: "stock", ar: "حركة المخزون", en: "Stock movement" },
  { id: "pos", ar: "نقطة البيع", en: "POS" },
  { id: "purchase", ar: "المشتريات", en: "Purchases" },
  { id: "reports", ar: "التقارير اليومية", en: "Daily reports" },
  { id: "shift", ar: "إقفال الوردية", en: "Shift close" },
  { id: "team", ar: "الحسابات والصلاحيات", en: "Accounts" },
  { id: "branches", ar: "تعديل الفروع", en: "Edit branches" },
];

export const roleLabel: { id: StaffRole; ar: string; en: string }[] = [
  { id: "owner", ar: "المالك", en: "Owner" },
  { id: "hr", ar: "موارد بشرية", en: "HR" },
  { id: "manager", ar: "مدير", en: "Manager" },
  { id: "pharmacist", ar: "صيدلي", en: "Pharmacist" },
  { id: "cashier", ar: "كاشير", en: "Cashier" },
  { id: "inventory", ar: "مخزون", en: "Inventory" },
  { id: "driver", ar: "مندوب توصيل", en: "Driver" },
];

export const defaultMatrix: Record<StaffRole, Perm[]> = {
  owner: permList.map((p) => p.id),
  hr: ["team", "ops", "branches"],
  manager: ["desk", "ops", "stock", "pos", "purchase", "reports", "shift", "branches"],
  pharmacist: ["desk", "ops", "stock"],
  cashier: ["pos", "reports", "shift"],
  inventory: ["stock", "purchase", "reports"],
  driver: ["ops"],
};

export function allows(matrix: Record<StaffRole, Perm[]>, role: StaffRole, perm: Perm) {
  if (role === "owner") return true;
  return (matrix[role] ?? []).includes(perm);
}
