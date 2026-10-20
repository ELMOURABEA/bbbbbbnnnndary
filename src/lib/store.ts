import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findProduct } from "@/data/catalog";
import { branches as seedBranches, type Branch } from "@/data/network";
import { allows, defaultMatrix, type Perm, type StaffRole } from "@/lib/access";
import {
  seedChannels,
  seedConversations,
  seedTenders,
  type Channel,
  type Conversation,
  type Tender,
} from "@/data/desk";

export type Lang = "ar" | "en";
export type PayMethod = "instapay" | "fawry" | "paymob" | "vodafone" | "cod";
export type Portal = "customer" | "team";
export type { StaffRole, Perm };
export type TenderKind = "cash" | "instapay" | "vodafone" | "card";

export type CartLine = { sku: string; qty: number };

export type Order = {
  id: string;
  createdAt: string;
  items: { sku: string; nameAr: string; nameEn: string; qty: number; price: number }[];
  total: number;
  method: PayMethod;
  status: "confirmed" | "preparing" | "out" | "delivered";
  branchId: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  note: string;
  ref: string;
};

export type RxRequest = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  branchId: string;
  note: string;
  fileName: string;
  status: "received" | "reviewing" | "ready";
};

export type ReceiptLine = {
  sku: string;
  nameAr: string;
  nameEn: string;
  qty: number;
  price: number;
};

export type Receipt = {
  id: string;
  kind: "pos" | "purchase";
  at: string;
  branchId: string;
  staff: string;
  lines: ReceiptLine[];
  total: number;
  tender: TenderKind;
  supplier: string;
  shiftId: string;
  note: string;
};

export type Shift = {
  id: string;
  branchId: string;
  staff: string;
  openedAt: string;
  closedAt: string | null;
  openingFloat: number;
  closingCash: number | null;
  note: string;
};

export type Movement = {
  id: string;
  at: string;
  sku: string;
  qty: number;
  fromBranch: string;
  toBranch: string;
  reason: "purchase" | "sale" | "transfer" | "adjust";
  ref: string;
};

export type StaffAccount = {
  id: string;
  name: string;
  role: StaffRole;
  branchId: string;
  active: boolean;
};

const seedStaff: StaffAccount[] = [
  { id: "s-owner", name: "صاحب المجموعة", role: "owner", branchId: "galaa-1", active: true },
  { id: "s-hr", name: "شؤون الفريق", role: "hr", branchId: "galaa-1", active: true },
  { id: "s-mgr", name: "مدير الجلاء", role: "manager", branchId: "galaa-1", active: true },
  { id: "s-ph", name: "صيدلي الوردية", role: "pharmacist", branchId: "galaa-1", active: true },
  { id: "s-cash", name: "كاشير المهندسين", role: "cashier", branchId: "mohandessin", active: true },
  { id: "s-inv", name: "أمين المخزن", role: "inventory", branchId: "galaa-1", active: true },
  { id: "s-drv", name: "مندوب التوصيل", role: "driver", branchId: "galaa-1", active: true },
];

type OrderDraft = {
  items: Order["items"];
  total: number;
  method: PayMethod;
  branchId: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  note: string;
};

type RxDraft = Omit<RxRequest, "id" | "createdAt" | "status">;

type BendaryState = {
  lang: Lang;
  cart: CartLine[];
  wishlist: string[];
  reminders: { id: string; text: string; at: string }[];
  orders: Order[];
  rxs: RxRequest[];
  memberId: string | null;
  portal: Portal | null;
  displayName: string;
  phone: string;
  role: StaffRole;
  branchBook: Branch[] | null;
  onHand: Record<string, number>;
  receipts: Receipt[];
  shifts: Shift[];
  movements: Movement[];
  staff: StaffAccount[];
  matrix: Record<StaffRole, Perm[]>;
  channels: Channel[];
  conversations: Conversation[];
  tenders: Tender[];
  visitor: string;
  setLang: (lang: Lang) => void;
  addToCart: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  clearCart: () => void;
  toggleWish: (sku: string) => void;
  addReminder: (text: string) => void;
  removeReminder: (id: string) => void;
  placeOrder: (draft: OrderDraft) => Order;
  addRx: (draft: RxDraft) => RxRequest;
  setMember: (id: string | null) => void;
  enterCustomer: (name: string, phone: string) => void;
  enterTeam: (name: string, role: StaffRole) => void;
  leave: () => void;
  setRole: (role: StaffRole) => void;
  saveBranch: (branch: Branch) => void;
  removeBranch: (id: string) => void;
  onHandQty: (branchId: string, sku: string) => number;
  savePos: (draft: Omit<Receipt, "id" | "at" | "kind" | "staff" | "shiftId">) => Receipt;
  savePurchase: (draft: Omit<Receipt, "id" | "at" | "kind" | "staff" | "shiftId">) => Receipt;
  transferStock: (sku: string, qty: number, fromBranch: string, toBranch: string) => void;
  adjustStock: (sku: string, branchId: string, qty: number) => void;
  openShift: (branchId: string, openingFloat: number) => Shift;
  closeShift: (shiftId: string, closingCash: number, note: string) => void;
  togglePerm: (role: StaffRole, perm: Perm) => void;
  saveStaff: (account: StaffAccount) => void;
  toggleChannel: (id: string) => void;
  reply: (conversationId: string, text: string) => void;
  inbound: (conversationId: string, text: string, sender: string) => void;
  ensureWebThread: (customer: string, text: string) => string;
  startCustomerThread: (text: string) => string;
  setAssignee: (id: string, assignee: string) => void;
  setConvoStatus: (id: string, status: Conversation["status"]) => void;
  markTender: (id: string, status: Tender["status"]) => void;
  setVisitor: (name: string) => void;
};

function stamp() {
  return new Date().toISOString();
}

function code(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function handKey(branchId: string, sku: string) {
  return `${branchId}|${sku}`;
}

export function readOnHand(onHand: Record<string, number>, branchId: string, sku: string) {
  const key = handKey(branchId, sku);
  if (key in onHand) return onHand[key];
  const product = findProduct(sku);
  if (!product) return 0;
  if (branchId === "galaa-1") return product.stock;
  return Math.max(0, Math.floor(product.stock / 5));
}

function pushMessage(
  conversations: Conversation[],
  conversationId: string,
  message: Conversation["messages"][number],
): Conversation[] {
  return conversations.map((c) =>
    c.id === conversationId ? { ...c, messages: [...c.messages, message], status: "open" as const } : c,
  );
}

export const useBendary = create<BendaryState>()(
  persist(
    (set, get) => ({
      lang: "ar",
      cart: [],
      wishlist: [],
      reminders: [],
      orders: [],
      rxs: [],
      memberId: null,
      portal: null,
      displayName: "",
      phone: "",
      role: "pharmacist",
      branchBook: null,
      onHand: {},
      receipts: [],
      shifts: [],
      movements: [],
      staff: seedStaff,
      matrix: defaultMatrix,
      channels: seedChannels,
      conversations: seedConversations,
      tenders: seedTenders,
      visitor: "",
      setLang: (lang) => set({ lang }),
      addToCart: (sku, qty = 1) =>
        set((s) => {
          const hit = s.cart.find((l) => l.sku === sku);
          if (hit) {
            return { cart: s.cart.map((l) => (l.sku === sku ? { ...l, qty: l.qty + qty } : l)) };
          }
          return { cart: [...s.cart, { sku, qty }] };
        }),
      setQty: (sku, qty) =>
        set((s) => ({
          cart: qty <= 0 ? s.cart.filter((l) => l.sku !== sku) : s.cart.map((l) => (l.sku === sku ? { ...l, qty } : l)),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWish: (sku) =>
        set((s) => ({
          wishlist: s.wishlist.includes(sku) ? s.wishlist.filter((id) => id !== sku) : [...s.wishlist, sku],
        })),
      addReminder: (text) =>
        set((s) => ({
          reminders: [{ id: code("RM"), text, at: stamp() }, ...s.reminders],
        })),
      removeReminder: (id) => set((s) => ({ reminders: s.reminders.filter((item) => item.id !== id) })),
      placeOrder: (draft) => {
        const order: Order = {
          ...draft,
          id: code("BND"),
          createdAt: stamp(),
          status: "preparing",
          ref:
            draft.method === "fawry"
              ? String(Math.floor(1000000000 + Math.random() * 9000000000))
              : draft.method === "instapay"
                ? code("IPAY")
                : draft.method === "vodafone"
                  ? code("VC")
                  : draft.method === "paymob"
                    ? code("PMB")
                    : code("COD"),
        };
        const convo: Conversation = {
          id: `c-${order.id}`,
          customer: order.customer,
          phone: order.phone,
          channelId: "wa-orders",
          status: "open",
          assignee: null,
          topicAr: `طلب ${order.id}`,
          topicEn: `Order ${order.id}`,
          messages: [
            {
              id: `m-${order.id}`,
              direction: "in",
              text: `طلب جديد من المتجر: ${order.id} — ${order.total} ج.م عبر ${order.method}. العنوان: ${order.address}، ${order.city}.`,
              at: order.createdAt,
              sender: order.customer,
            },
          ],
        };
        set((s) => ({
          orders: [order, ...s.orders],
          cart: [],
          conversations: [convo, ...s.conversations],
          tenders: [
            {
              id: order.ref,
              method: order.method,
              amount: order.total,
              status: order.method === "cod" ? "pending" : "pending",
              ref: order.ref,
              noteAr: `طلب المتجر ${order.id}`,
              noteEn: `Store order ${order.id}`,
            },
            ...s.tenders,
          ],
        }));
        return order;
      },
      addRx: (draft) => {
        const rx: RxRequest = {
          ...draft,
          id: code("RX"),
          createdAt: stamp(),
          status: "received",
        };
        const convo: Conversation = {
          id: `c-${rx.id}`,
          customer: rx.name,
          phone: rx.phone,
          channelId: "web",
          status: "open",
          assignee: null,
          topicAr: `روشتة ${rx.id}`,
          topicEn: `Prescription ${rx.id}`,
          messages: [
            {
              id: `m-${rx.id}`,
              direction: "in",
              text: `روشتة مرفوعة (${rx.fileName || "بدون ملف"}). ${rx.note || "بدون ملاحظات."}`,
              at: rx.createdAt,
              sender: rx.name,
            },
          ],
        };
        set((s) => ({ rxs: [rx, ...s.rxs], conversations: [convo, ...s.conversations] }));
        return rx;
      },
      setMember: (id) => set({ memberId: id }),
      enterCustomer: (name, phone) =>
        set({
          portal: "customer",
          displayName: name.trim(),
          phone: phone.replace(/\s/g, ""),
          visitor: name.trim(),
        }),
      enterTeam: (name, role) =>
        set({
          portal: "team",
          displayName: name.trim(),
          role,
          visitor: name.trim(),
        }),
      leave: () => set({ portal: null, displayName: "", phone: "" }),
      setRole: (role) => set({ role }),
      saveBranch: (branch) =>
        set((s) => {
          const book = s.branchBook ?? seedBranches;
          const exists = book.some((b) => b.id === branch.id);
          return { branchBook: exists ? book.map((b) => (b.id === branch.id ? branch : b)) : [...book, branch] };
        }),
      removeBranch: (id) =>
        set((s) => ({ branchBook: (s.branchBook ?? seedBranches).filter((b) => b.id !== id) })),
      onHandQty: (branchId, sku) => readOnHand(get().onHand, branchId, sku),
      savePos: (draft) => {
        const staff = get().displayName || "كاشير";
        const shift = get().shifts.find((item) => item.branchId === draft.branchId && !item.closedAt);
        const receipt: Receipt = {
          ...draft,
          id: code("RCP"),
          kind: "pos",
          at: stamp(),
          staff,
          shiftId: shift?.id ?? "open",
        };
        const onHand = { ...get().onHand };
        const movements: Movement[] = draft.lines.map((line) => {
          const key = handKey(draft.branchId, line.sku);
          onHand[key] = Math.max(0, readOnHand(onHand, draft.branchId, line.sku) - line.qty);
          return {
            id: code("MV"),
            at: receipt.at,
            sku: line.sku,
            qty: line.qty,
            fromBranch: draft.branchId,
            toBranch: "",
            reason: "sale" as const,
            ref: receipt.id,
          };
        });
        set((s) => ({
          onHand,
          receipts: [receipt, ...s.receipts],
          movements: [...movements, ...s.movements],
        }));
        return receipt;
      },
      savePurchase: (draft) => {
        const staff = get().displayName || "مخزن";
        const receipt: Receipt = {
          ...draft,
          id: code("PUR"),
          kind: "purchase",
          at: stamp(),
          staff,
          shiftId: "purchase",
        };
        const onHand = { ...get().onHand };
        const movements: Movement[] = draft.lines.map((line) => {
          const key = handKey(draft.branchId, line.sku);
          onHand[key] = readOnHand(onHand, draft.branchId, line.sku) + line.qty;
          return {
            id: code("MV"),
            at: receipt.at,
            sku: line.sku,
            qty: line.qty,
            fromBranch: "",
            toBranch: draft.branchId,
            reason: "purchase" as const,
            ref: receipt.id,
          };
        });
        set((s) => ({
          onHand,
          receipts: [receipt, ...s.receipts],
          movements: [...movements, ...s.movements],
        }));
        return receipt;
      },
      transferStock: (sku, qty, fromBranch, toBranch) => {
        if (qty <= 0 || fromBranch === toBranch) return;
        const onHand = { ...get().onHand };
        onHand[handKey(fromBranch, sku)] = Math.max(0, readOnHand(onHand, fromBranch, sku) - qty);
        onHand[handKey(toBranch, sku)] = readOnHand(onHand, toBranch, sku) + qty;
        const movement: Movement = {
          id: code("MV"),
          at: stamp(),
          sku,
          qty,
          fromBranch,
          toBranch,
          reason: "transfer",
          ref: code("TR"),
        };
        set((s) => ({ onHand, movements: [movement, ...s.movements] }));
      },
      adjustStock: (sku, branchId, qty) => {
        const onHand = { ...get().onHand, [handKey(branchId, sku)]: Math.max(0, qty) };
        const movement: Movement = {
          id: code("MV"),
          at: stamp(),
          sku,
          qty,
          fromBranch: branchId,
          toBranch: branchId,
          reason: "adjust",
          ref: code("ADJ"),
        };
        set((s) => ({ onHand, movements: [movement, ...s.movements] }));
      },
      openShift: (branchId, openingFloat) => {
        const existing = get().shifts.find((item) => item.branchId === branchId && !item.closedAt);
        if (existing) return existing;
        const shift: Shift = {
          id: code("SH"),
          branchId,
          staff: get().displayName || "وردية",
          openedAt: stamp(),
          closedAt: null,
          openingFloat,
          closingCash: null,
          note: "",
        };
        set((s) => ({ shifts: [shift, ...s.shifts] }));
        return shift;
      },
      closeShift: (shiftId, closingCash, note) =>
        set((s) => ({
          shifts: s.shifts.map((item) =>
            item.id === shiftId ? { ...item, closedAt: stamp(), closingCash, note } : item,
          ),
        })),
      togglePerm: (role, perm) =>
        set((s) => {
          if (role === "owner") return s;
          if (!allows(s.matrix, s.role, "team") && s.role !== "owner") return s;
          const current = s.matrix[role] ?? [];
          const next = current.includes(perm) ? current.filter((item) => item !== perm) : [...current, perm];
          return { matrix: { ...s.matrix, [role]: next } };
        }),
      saveStaff: (account) =>
        set((s) => {
          const exists = s.staff.some((item) => item.id === account.id);
          return {
            staff: exists ? s.staff.map((item) => (item.id === account.id ? account : item)) : [account, ...s.staff],
          };
        }),
      toggleChannel: (id) =>
        set((s) => ({
          channels: s.channels.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
        })),
      reply: (conversationId, text) =>
        set((s) => ({
          conversations: pushMessage(s.conversations, conversationId, {
            id: code("MSG"),
            direction: "out",
            text,
            at: stamp(),
            sender: "صيدلي البنداري",
          }),
        })),
      inbound: (conversationId, text, sender) =>
        set((s) => ({
          conversations: pushMessage(s.conversations, conversationId, {
            id: code("MSG"),
            direction: "in",
            text,
            at: stamp(),
            sender,
          }),
        })),
      ensureWebThread: (customer, text) => {
        const phone = get().phone;
        const id = phone ? `c-cust-${phone}` : "c-web-visitor";
        const existing = get().conversations.find((c) => c.id === id);
        if (!existing) {
          const convo: Conversation = {
            id,
            customer: customer || get().displayName || "زائر الموقع",
            phone: phone || undefined,
            channelId: "web",
            status: "open",
            assignee: null,
            topicAr: "شات الموقع",
            topicEn: "Website chat",
            messages: [
              {
                id: code("MSG"),
                direction: "in",
                text,
                at: stamp(),
                sender: customer || "زائر الموقع",
              },
            ],
          };
          set((s) => ({ conversations: [convo, ...s.conversations] }));
          return convo.id;
        }
        get().inbound(existing.id, text, customer || existing.customer);
        return existing.id;
      },
      startCustomerThread: (text: string) => {
        const phone = get().phone;
        const customer = get().displayName || "عميل";
        const convo: Conversation = {
          id: `c-cust-${phone || "guest"}-${code("T")}`,
          customer,
          phone: phone || undefined,
          channelId: "web",
          status: "open",
          assignee: null,
          topicAr: "محادثة جديدة",
          topicEn: "New conversation",
          messages: text
            ? [{ id: code("MSG"), direction: "in" as const, text, at: stamp(), sender: customer }]
            : [],
        };
        set((s) => ({ conversations: [convo, ...s.conversations] }));
        return convo.id;
      },
      setAssignee: (id, assignee) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === id ? { ...c, assignee, status: "pending" } : c)),
        })),
      setConvoStatus: (id, status) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
      markTender: (id, status) =>
        set((s) => ({
          tenders: s.tenders.map((tender) => (tender.id === id ? { ...tender, status } : tender)),
        })),
      setVisitor: (name) => set({ visitor: name }),
    }),
    {
      name: "bendary-desk",
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<BendaryState>;
        const rawRole = (persisted as { role?: string } | null)?.role;
        const role = rawRole === "delivery" ? "driver" : rawRole;
        return {
          ...current,
          ...saved,
          role: (role as StaffRole) || current.role,
          portal: saved.portal ?? null,
          matrix: saved.matrix ?? current.matrix,
          staff: saved.staff?.length ? saved.staff : current.staff,
          receipts: saved.receipts ?? [],
          shifts: saved.shifts ?? [],
          movements: saved.movements ?? [],
          onHand: saved.onHand ?? {},
          phone: saved.phone ?? "",
          displayName: saved.displayName ?? "",
          branchBook: saved.branchBook ?? null,
          wishlist: saved.wishlist ?? [],
          reminders: saved.reminders ?? [],
        };
      },
    },
  ),
);

export function useBranchBook() {
  const book = useBendary((s) => s.branchBook);
  return book ?? seedBranches;
}

export function cartCount(cart: CartLine[]) {
  return cart.reduce((n, l) => n + l.qty, 0);
}

export function cartDetailed(cart: CartLine[]) {
  return cart
    .map((l) => {
      const product = findProduct(l.sku);
      if (!product) return null;
      return { ...l, product, line: product.price * l.qty };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
}

export function L(lang: Lang, ar: string, en: string) {
  return lang === "ar" ? ar : en;
}
