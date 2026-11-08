'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  UtensilsCrossed,
  Utensils,
  ShoppingBag,
  Wallet,
  ReceiptText,
  FileSpreadsheet,
  Users,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  User,
  Download,
  RotateCcw,
  UserPlus,
  TrendingUp
} from 'lucide-react';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
export type Role = 'manager' | 'member';

export interface Member {
  id: string;
  name: string;
  phone: string;
  room: string;
  role: Role;
  avatarColor?: string;
  isActive: boolean;
}

export interface DailyMeal {
  id: string;
  date: string;
  memberId: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  notes?: string;
}

export type ExpenseCategory = 'Meat & Fish' | 'Vegetables' | 'Groceries & Spices' | 'Oil & Rice' | 'Gas' | 'Snacks' | 'Others';

export interface Expense {
  id: string;
  date: string;
  shopperId: string;
  shopperName: string;
  category: ExpenseCategory;
  items: string;
  amount: number;
}

export type PaymentMethod = 'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank';

export interface Deposit {
  id: string;
  date: string;
  memberId: string;
  amount: number;
  method: PaymentMethod;
  notes?: string;
}

export interface SharedBill {
  id: string;
  title: string;
  amount: number;
  month: string;
}

export interface MessSettings {
  messName: string;
  currency: string;
  currentMonth: string;
}

export interface MemberFinancialSummary {
  member: Member;
  totalMeals: number;
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  mealCost: number;
  sharedBillCost: number;
  totalCost: number;
  totalDeposit: number;
  netBalance: number;
}

export interface MessSummary {
  totalGroceryCost: number;
  totalMeals: number;
  mealRate: number;
  totalSharedBills: number;
  totalDeposits: number;
  memberSummaries: MemberFinancialSummary[];
}

// ==========================================
// 2. INITIAL SEED DATA
// ==========================================
const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', name: 'Rahim Ahmed (Manager)', phone: '01711-000111', room: '101', role: 'manager', avatarColor: 'bg-emerald-600', isActive: true },
  { id: 'm2', name: 'Tanvir Hossain', phone: '01812-222333', room: '101', role: 'member', avatarColor: 'bg-blue-600', isActive: true },
  { id: 'm3', name: 'Shakil Mahmud', phone: '01913-333444', room: '102', role: 'member', avatarColor: 'bg-indigo-600', isActive: true },
  { id: 'm4', name: 'Hasan Ali', phone: '01614-444555', room: '102', role: 'member', avatarColor: 'bg-purple-600', isActive: true },
  { id: 'm5', name: 'Arifuzzaman Arif', phone: '01515-555666', room: '103', role: 'member', avatarColor: 'bg-rose-600', isActive: true },
];

const INITIAL_SETTINGS: MessSettings = {
  messName: 'Green View Bachelor Mess',
  currency: '৳',
  currentMonth: '2026-11',
};

const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', date: '2026-11-01', shopperId: 'm1', shopperName: 'Rahim Ahmed', category: 'Meat & Fish', items: 'Chicken 2kg, Beef 1kg', amount: 1150 },
  { id: 'e2', date: '2026-11-02', shopperId: 'm2', shopperName: 'Tanvir Hossain', category: 'Vegetables', items: 'Potatoes, Onion, Tomato, Green chili', amount: 380 },
  { id: 'e3', date: '2026-11-03', shopperId: 'm3', shopperName: 'Shakil Mahmud', category: 'Oil & Rice', items: 'Miniket Rice 25kg, Soybean Oil 5L', amount: 2600 },
  { id: 'e4', date: '2026-11-05', shopperId: 'm1', shopperName: 'Rahim Ahmed', category: 'Meat & Fish', items: 'Rui Fish 2.5kg, Eggs 2 dozen', amount: 980 },
  { id: 'e5', date: '2026-11-07', shopperId: 'm4', shopperName: 'Hasan Ali', category: 'Groceries & Spices', items: 'Ginger, Garlic, Turmeric, Cumin, Salt', amount: 450 },
];

const INITIAL_DEPOSITS: Deposit[] = [
  { id: 'd1', date: '2026-11-01', memberId: 'm1', amount: 4000, method: 'Cash', notes: 'Advance for November' },
  { id: 'd2', date: '2026-11-01', memberId: 'm2', amount: 3500, method: 'bKash', notes: 'TrxID: 9XJK2388' },
  { id: 'd3', date: '2026-11-02', memberId: 'm3', amount: 4000, method: 'Nagad', notes: 'TrxID: NG88329' },
  { id: 'd4', date: '2026-11-02', memberId: 'm4', amount: 3000, method: 'bKash', notes: 'TrxID: BK38812' },
  { id: 'd5', date: '2026-11-03', memberId: 'm5', amount: 3500, method: 'Cash', notes: 'Cash handed to Rahim' },
];

const INITIAL_SHARED_BILLS: SharedBill[] = [
  { id: 'b1', title: 'Apartment Rent', amount: 15000, month: '2026-11' },
  { id: 'b2', title: 'Cook / Bua Salary', amount: 3500, month: '2026-11' },
  { id: 'b3', title: 'WiFi Internet Bill', amount: 800, month: '2026-11' },
  { id: 'b4', title: 'Electricity Bill', amount: 1200, month: '2026-11' },
  { id: 'b5', title: 'Waste Management', amount: 200, month: '2026-11' },
];

function generateInitialMeals(): DailyMeal[] {
  const meals: DailyMeal[] = [];
  const days = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08'];
  days.forEach((day, dayIndex) => {
    INITIAL_MEMBERS.forEach((m, mIndex) => {
      const isBreakfast = (dayIndex + mIndex) % 3 !== 0 ? 0.5 : 0;
      const lunchCount = (dayIndex + mIndex) % 4 === 0 ? 0 : 1;
      const dinnerCount = 1;
      meals.push({
        id: `meal-${day}-${m.id}`,
        date: day,
        memberId: m.id,
        breakfast: isBreakfast,
        lunch: lunchCount,
        dinner: dinnerCount,
      });
    });
  });
  return meals;
}

// ==========================================
// 3. STORAGE & RECONCILIATION ENGINE
// ==========================================
class MessStorage {
  static get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  }
  static set(key: string, value: any): void {
    if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
  }
}

function calculateMessFinances(
  members: Member[],
  meals: DailyMeal[],
  expenses: Expense[],
  deposits: Deposit[],
  sharedBills: SharedBill[]
): MessSummary {
  const activeMembers = members.filter((m) => m.isActive);
  const activeCount = Math.max(activeMembers.length, 1);
  const totalGroceryCost = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalSharedBills = sharedBills.reduce((sum, bill) => sum + (Number(bill.amount) || 0), 0);
  const sharedBillPerMember = Math.round((totalSharedBills / activeCount) * 100) / 100;

  const memberMealsMap = new Map<string, { breakfast: number; lunch: number; dinner: number; total: number }>();
  members.forEach((m) => memberMealsMap.set(m.id, { breakfast: 0, lunch: 0, dinner: 0, total: 0 }));

  let totalMeals = 0;
  meals.forEach((m) => {
    const counts = memberMealsMap.get(m.memberId);
    if (counts) {
      const b = Number(m.breakfast) || 0;
      const l = Number(m.lunch) || 0;
      const d = Number(m.dinner) || 0;
      const sum = b + l + d;
      counts.breakfast += b;
      counts.lunch += l;
      counts.dinner += d;
      counts.total += sum;
      totalMeals += sum;
    }
  });

  const mealRate = totalMeals > 0 ? totalGroceryCost / totalMeals : 0;
  const roundedMealRate = Math.round(mealRate * 100) / 100;

  const memberDepositsMap = new Map<string, number>();
  members.forEach((m) => memberDepositsMap.set(m.id, 0));
  let totalDeposits = 0;
  deposits.forEach((d) => {
    const prev = memberDepositsMap.get(d.memberId) || 0;
    const amt = Number(d.amount) || 0;
    memberDepositsMap.set(d.memberId, prev + amt);
    totalDeposits += amt;
  });

  const memberSummaries: MemberFinancialSummary[] = members.map((m) => {
    const mealData = memberMealsMap.get(m.id) || { breakfast: 0, lunch: 0, dinner: 0, total: 0 };
    const memberTotalMeals = mealData.total;
    const memberMealCost = Math.round(memberTotalMeals * roundedMealRate * 100) / 100;
    const memberSharedCost = m.isActive ? sharedBillPerMember : 0;
    const memberTotalCost = Math.round((memberMealCost + memberSharedCost) * 100) / 100;
    const memberDeposit = memberDepositsMap.get(m.id) || 0;
    const netBalance = Math.round((memberDeposit - memberTotalCost) * 100) / 100;

    return {
      member: m,
      totalMeals: memberTotalMeals,
      breakfastCount: mealData.breakfast,
      lunchCount: mealData.lunch,
      dinnerCount: mealData.dinner,
      mealCost: memberMealCost,
      sharedBillCost: memberSharedCost,
      totalCost: memberTotalCost,
      totalDeposit: memberDeposit,
      netBalance,
    };
  });

  return {
    totalGroceryCost,
    totalMeals: Math.round(totalMeals * 100) / 100,
    mealRate: roundedMealRate,
    totalSharedBills,
    totalDeposits,
    memberSummaries,
  };
}
type Tab = 'meals' | 'bazaar' | 'deposits' | 'bills' | 'summary' | 'members';

export default function MessManagerApp() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('meals');

  const [settings, setSettings] = useState<MessSettings>(INITIAL_SETTINGS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [meals, setMeals] = useState<DailyMeal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [deposits, setDeposits] = useState<Deposit[]>(INITIAL_DEPOSITS);
  const [sharedBills, setSharedBills] = useState<SharedBill[]>(INITIAL_SHARED_BILLS);
  const [currentUser, setCurrentUser] = useState<Member>(INITIAL_MEMBERS[0]);

  useEffect(() => {
    setMounted(true);
    setSettings(MessStorage.get('mess_settings', INITIAL_SETTINGS));
    setMembers(MessStorage.get('mess_members', INITIAL_MEMBERS));
    setMeals(MessStorage.get('mess_meals', generateInitialMeals()));
    setExpenses(MessStorage.get('mess_expenses', INITIAL_EXPENSES));
    setDeposits(MessStorage.get('mess_deposits', INITIAL_DEPOSITS));
    setSharedBills(MessStorage.get('mess_shared_bills', INITIAL_SHARED_BILLS));
    setCurrentUser(MessStorage.get('mess_current_user', INITIAL_MEMBERS[0]));
  }, []);

  const summary = useMemo(() => {
    return calculateMessFinances(members, meals, expenses, deposits, sharedBills);
  }, [members, meals, expenses, deposits, sharedBills]);

  const currentMemberSummary = summary.memberSummaries.find((m) => m.member.id === currentUser.id);

  // Persistence helpers
  const saveMeals = (newMeals: DailyMeal[]) => {
    setMeals(newMeals);
    MessStorage.set('mess_meals', newMeals);
  };
  const addExpense = (exp: Expense) => {
    const updated = [exp, ...expenses];
    setExpenses(updated);
    MessStorage.set('mess_expenses', updated);
  };
  const deleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    MessStorage.set('mess_expenses', updated);
  };
  const addDeposit = (dep: Deposit) => {
    const updated = [dep, ...deposits];
    setDeposits(updated);
    MessStorage.set('mess_deposits', updated);
  };
  const deleteDeposit = (id: string) => {
    const updated = deposits.filter((d) => d.id !== id);
    setDeposits(updated);
    MessStorage.set('mess_deposits', updated);
  };
  const addBill = (bill: SharedBill) => {
    const updated = [bill, ...sharedBills];
    setSharedBills(updated);
    MessStorage.set('mess_shared_bills', updated);
  };
  const deleteBill = (id: string) => {
    const updated = sharedBills.filter((b) => b.id !== id);
    setSharedBills(updated);
    MessStorage.set('mess_shared_bills', updated);
  };
  const addMember = (m: Member) => {
    const updated = [...members, m];
    setMembers(updated);
    MessStorage.set('mess_members', updated);
  };
  const toggleMemberActive = (id: string) => {
    const updated = members.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m));
    setMembers(updated);
    MessStorage.set('mess_members', updated);
  };

  // Date state for daily meal sheet
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const currentDateMeals = useMemo(() => {
    return members.map((member) => {
      const existing = meals.find((m) => m.date === selectedDate && m.memberId === member.id);
      return existing || { id: `meal-${selectedDate}-${member.id}`, date: selectedDate, memberId: member.id, breakfast: 0.5, lunch: 1, dinner: 1 };
    });
  }, [members, meals, selectedDate]);

  const totalBreakfast = currentDateMeals.reduce((acc, m) => acc + (Number(m.breakfast) || 0), 0);
  const totalLunch = currentDateMeals.reduce((acc, m) => acc + (Number(m.lunch) || 0), 0);
  const totalDinner = currentDateMeals.reduce((acc, m) => acc + (Number(m.dinner) || 0), 0);
  const grandTotalMealsToday = totalBreakfast + totalLunch + totalDinner;

  const handleUpdateMeal = (memberId: string, field: 'breakfast' | 'lunch' | 'dinner', value: number) => {
    const updated = meals.filter((m) => !(m.date === selectedDate && m.memberId === memberId));
    const existing = currentDateMeals.find((m) => m.memberId === memberId);
    const updatedEntry: DailyMeal = {
      ...(existing || { id: `meal-${selectedDate}-${memberId}`, date: selectedDate, memberId, breakfast: 0, lunch: 0, dinner: 0 }),
      [field]: Math.max(0, value),
    };
    saveMeals([...updated, updatedEntry]);
  };

  // Forms state
  const [showBazaarModal, setShowBazaarModal] = useState(false);
  const [bDate, setBDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bShopper, setBShopper] = useState(currentUser.id);
  const [bCategory, setBCategory] = useState<ExpenseCategory>('Meat & Fish');
  const [bItems, setBItems] = useState('');
  const [bAmount, setBAmount] = useState('');

  const [showDepModal, setShowDepModal] = useState(false);
  const [dDate, setDDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dMember, setDMember] = useState(currentUser.id);
  const [dAmount, setDAmount] = useState('');
  const [dMethod, setDMethod] = useState<PaymentMethod>('bKash');
  const [dNotes, setDNotes] = useState('');

  const [showBillModal, setShowBillModal] = useState(false);
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemName, setNewMemName] = useState('');
  const [newMemPhone, setNewMemPhone] = useState('');
  const [newMemRoom, setNewMemRoom] = useState('');
  const [newMemRole, setNewMemRole] = useState<Role>('member');

  const [selectedSlipMember, setSelectedSlipMember] = useState<MemberFinancialSummary | null>(null);
  const [copied, setCopied] = useState(false);

  const handleWhatsAppCopy = () => {
    let text = `📊 *${settings.messName.toUpperCase()} - HISAB REPORT*\n`;
    text += `🗓️ Month: ${settings.currentMonth}\n`;
    text += `🥗 Bazaar: ${settings.currency}${summary.totalGroceryCost.toLocaleString()} | 🍽️ Meals: ${summary.totalMeals}\n`;
    text += `⚡ Meal Rate: *${settings.currency}${summary.mealRate.toFixed(2)}*\n`;
    text += `🏠 Shared Bills: ${settings.currency}${summary.totalSharedBills.toLocaleString()}\n`;
    text += `💰 Deposits: ${settings.currency}${summary.totalDeposits.toLocaleString()}\n`;
    text += `--------------------------------------\n`;
    summary.memberSummaries.forEach((m, idx) => {
      const status = m.netBalance >= 0 ? `🟢 Pabe: ${settings.currency}${m.netBalance.toFixed(1)}` : `🔴 Dibe: ${settings.currency}${Math.abs(m.netBalance).toFixed(1)}`;
      text += `${idx + 1}. *${m.member.name}* (${m.member.room})\n   Meals: ${m.totalMeals} | Cost: ${settings.currency}${m.totalCost} | Deposit: ${settings.currency}${m.totalDeposit}\n   👉 ${status}\n\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isManager = currentUser.role === 'manager';

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex items-center space-x-2 text-emerald-600 font-bold">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Mess Manager...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-none">{settings.messName}</h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">{settings.currentMonth}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Hostel & Bachelor Mess Manager</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
              <div className="px-1.5 flex items-center space-x-1 text-slate-600 font-medium">
                {currentUser.role === 'manager' ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <User className="w-4 h-4 text-blue-600" />}
                <span className="hidden sm:inline">Role:</span>
              </div>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const selected = members.find((m) => m.id === e.target.value);
                  if (selected) {
                    setCurrentUser(selected);
                    MessStorage.set('mess_current_user', selected);
                  }
                }}
                className="bg-white text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              title="Reset Demo Data"
              className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Personal Status Banner */}
        <div className="mb-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-2xl ${currentUser.avatarColor || 'bg-emerald-600'} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">স্বাগতম, {currentUser.name}</h2>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  {currentUser.role === 'manager' ? 'Mess Manager' : 'Border'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Room: {currentUser.room} • Month: {settings.currentMonth}</p>
            </div>
          </div>

          {currentMemberSummary && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
              <div>
                <span className="text-slate-300 block text-[10px]">Your Meals</span>
                <span className="font-bold text-sm">{currentMemberSummary.totalMeals}</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div>
                <span className="text-slate-300 block text-[10px]">Your Cost</span>
                <span className="font-bold text-sm">{settings.currency}{currentMemberSummary.totalCost.toLocaleString()}</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div>
                <span className="text-slate-300 block text-[10px]">Your Deposit</span>
                <span className="font-bold text-sm text-blue-300">{settings.currency}{currentMemberSummary.totalDeposit.toLocaleString()}</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div>
                <span className="text-slate-300 block text-[10px]">Net Status</span>
                {currentMemberSummary.netBalance >= 0 ? (
                  <span className="font-extrabold text-sm text-emerald-400">পাবে: {settings.currency}{currentMemberSummary.netBalance.toFixed(0)}</span>
                ) : (
                  <span className="font-extrabold text-sm text-rose-400">দিবে: {settings.currency}{Math.abs(currentMemberSummary.netBalance).toFixed(0)}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between opacity-90 text-xs font-medium">
              <span>Meal Rate</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold">{settings.currency}{summary.mealRate.toFixed(2)}</div>
              <p className="text-[11px] text-emerald-100 mt-0.5">per meal</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Meals</span>
              <Utensils className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-900">{summary.totalMeals}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">consumed</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Bazaar Cost</span>
              <ShoppingBag className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-900">{settings.currency}{summary.totalGroceryCost.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">food bazaar</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Deposits</span>
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-900">{settings.currency}{summary.totalDeposits.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                Cash: {settings.currency}{(summary.totalDeposits - summary.totalGroceryCost).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Shared Bills</span>
              <ReceiptText className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-900">{settings.currency}{summary.totalSharedBills.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{settings.currency}{(summary.totalSharedBills / Math.max(members.filter((m) => m.isActive).length, 1)).toFixed(0)} / person</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Active Borders</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-900">{members.filter((m) => m.isActive).length}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">residents</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
          <button onClick={() => setActiveTab('meals')} className={`flex items-center space-x-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl transition ${activeTab === 'meals' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Utensils className="w-4 h-4" /><span>Daily Meals</span>
          </button>
          <button onClick={() => setActiveTab('bazaar')} className={`flex items-center space-x-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl transition ${activeTab === 'bazaar' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            <ShoppingBag className="w-4 h-4" /><span>Bazaar Log</span>
          </button>
          <button onClick={() => setActiveTab('deposits')} className={`flex items-center space-x-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl transition ${activeTab === 'deposits' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Wallet className="w-4 h-4" /><span>Member Deposits</span>
          </button>
          <button onClick={() => setActiveTab('bills')} className={`flex items-center space-x-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl transition ${activeTab === 'bills' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            <ReceiptText className="w-4 h-4" /><span>Shared Bills</span>
          </button>
          <button onClick={() => setActiveTab('summary')} className={`flex items-center space-x-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl transition ${activeTab === 'summary' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            <FileSpreadsheet className="w-4 h-4" /><span>Final Settlement</span>
          </button>
          <button onClick={() => setActiveTab('members')} className={`flex items-center space-x-1.5 py-2.5 px-3.5 text-xs sm:text-sm font-semibold rounded-xl transition ${activeTab === 'members' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Users className="w-4 h-4" /><span>Borders</span>
          </button>
        </div>
        {/* TAB 1: DAILY MEALS */}
        {activeTab === 'meals' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Daily Meal Sheet</h2>
                <p className="text-xs text-slate-500 mt-0.5">Breakfast, lunch, and dinner attendance for each border</p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => {
                    const c = new Date(selectedDate);
                    c.setDate(c.getDate() - 1);
                    setSelectedDate(c.toISOString().split('T')[0]);
                  }}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-1.5 px-2">
                  <CalendarIcon className="w-4 h-4 text-emerald-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => {
                    const c = new Date(selectedDate);
                    c.setDate(c.getDate() + 1);
                    setSelectedDate(c.toISOString().split('T')[0]);
                  }}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="text-[11px] font-semibold bg-white text-emerald-700 px-2.5 py-1 rounded-lg border border-slate-200"
                >
                  Today
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-emerald-950">
              <div className="flex items-center space-x-2">
                <Coffee className="w-4 h-4 text-emerald-700" />
                <div>
                  <div className="text-[11px] text-emerald-700">Breakfast: <strong>{totalBreakfast}</strong></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-[11px] text-amber-700">Lunch: <strong>{totalLunch}</strong></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-600" />
                <div>
                  <div className="text-[11px] text-indigo-700">Dinner: <strong>{totalDinner}</strong></div>
                </div>
              </div>
              <div className="flex items-center space-x-2 font-bold text-emerald-900 bg-white/70 px-3 py-1 rounded-lg">
                <span>Today's Total: {grandTotalMealsToday} meals</span>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                    <th className="py-3 px-3">Border Name</th>
                    <th className="py-3 px-3 text-center">Room</th>
                    <th className="py-3 px-3 text-center">Breakfast</th>
                    <th className="py-3 px-3 text-center">Lunch</th>
                    <th className="py-3 px-3 text-center">Dinner</th>
                    <th className="py-3 px-3 text-center">Total</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((member) => {
                    const entry = currentDateMeals.find((m) => m.memberId === member.id) || { breakfast: 0, lunch: 0, dinner: 0 };
                    const daySum = (Number(entry.breakfast) || 0) + (Number(entry.lunch) || 0) + (Number(entry.dinner) || 0);
                    const canEdit = isManager || currentUser.id === member.id;

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {member.name} {member.role === 'manager' && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">Mgr</span>}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600">{member.room}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex space-x-1 bg-slate-100 p-0.5 rounded-lg">
                            {[0, 0.5, 1].map((val) => (
                              <button
                                key={val}
                                disabled={!canEdit}
                                onClick={() => handleUpdateMeal(member.id, 'breakfast', val)}
                                className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                  entry.breakfast === val ? (val === 0 ? 'bg-white text-rose-600 font-bold' : 'bg-emerald-600 text-white font-bold') : 'text-slate-600'
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex space-x-1 bg-slate-100 p-0.5 rounded-lg">
                            {[0, 1, 2].map((val) => (
                              <button
                                key={val}
                                disabled={!canEdit}
                                onClick={() => handleUpdateMeal(member.id, 'lunch', val)}
                                className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                  entry.lunch === val ? (val === 0 ? 'bg-white text-rose-600 font-bold' : 'bg-emerald-600 text-white font-bold') : 'text-slate-600'
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex space-x-1 bg-slate-100 p-0.5 rounded-lg">
                            {[0, 1, 2].map((val) => (
                              <button
                                key={val}
                                disabled={!canEdit}
                                onClick={() => handleUpdateMeal(member.id, 'dinner', val)}
                                className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                  entry.dinner === val ? (val === 0 ? 'bg-white text-rose-600 font-bold' : 'bg-emerald-600 text-white font-bold') : 'text-slate-600'
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-bold">{daySum}</td>
                        <td className="py-3 px-3 text-right">
                          {canEdit && (
                            <button
                              onClick={() => {
                                const updated = meals.filter((m) => !(m.date === selectedDate && m.memberId === member.id));
                                saveMeals([...updated, { id: `meal-${selectedDate}-${member.id}`, date: selectedDate, memberId: member.id, breakfast: 0, lunch: 0, dinner: 0 }]);
                              }}
                              className="text-[11px] px-2 py-0.5 bg-slate-100 text-rose-600 hover:bg-rose-50 rounded"
                            >
                              Off All
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BAZAAR LOG */}
        {activeTab === 'bazaar' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Bazaar & Grocery Log</h2>
                <p className="text-xs text-slate-500">Log all grocery purchases for the mess</p>
              </div>
              <button onClick={() => setShowBazaarModal(!showBazaarModal)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1">
                <Plus className="w-4 h-4" /><span>Add Bazaar</span>
              </button>
            </div>

            {showBazaarModal && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!bAmount || !bItems.trim()) return;
                  const shopper = members.find((m) => m.id === bShopper);
                  addExpense({ id: `e-${Date.now()}`, date: bDate, shopperId: bShopper, shopperName: shopper ? shopper.name : 'Unknown', category: bCategory, items: bItems.trim(), amount: parseFloat(bAmount) });
                  setBItems('');
                  setBAmount('');
                  setShowBazaarModal(false);
                }}
                className="mt-4 p-4 bg-slate-50 rounded-xl space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
                    <input type="date" required value={bDate} onChange={(e) => setBDate(e.target.value)} className="w-full p-2 bg-white border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Shopper</label>
                    <select value={bShopper} onChange={(e) => setBShopper(e.target.value)} className="w-full p-2 bg-white border rounded-lg">
                      {members.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
                    <select value={bCategory} onChange={(e) => setBCategory(e.target.value as ExpenseCategory)} className="w-full p-2 bg-white border rounded-lg">
                      {['Meat & Fish', 'Vegetables', 'Groceries & Spices', 'Oil & Rice', 'Gas', 'Snacks', 'Others'].map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Amount ({settings.currency})</label>
                    <input type="number" step="any" required placeholder="850" value={bAmount} onChange={(e) => setBAmount(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Items Description</label>
                  <input type="text" required placeholder="e.g. Beef 2kg, Potato 3kg" value={bItems} onChange={(e) => setBItems(e.target.value)} className="w-full p-2 bg-white border rounded-lg" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowBazaarModal(false)} className="px-3 py-1 text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-1 bg-emerald-600 text-white font-bold rounded-lg">Save</button>
                </div>
              </form>
            )}

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500 font-semibold">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Shopper</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Items</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3">{exp.date}</td>
                      <td className="py-2 px-3 font-semibold">{exp.shopperName}</td>
                      <td className="py-2 px-3"><span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-medium">{exp.category}</span></td>
                      <td className="py-2 px-3 text-slate-700">{exp.items}</td>
                      <td className="py-2 px-3 text-right font-bold">{settings.currency}{exp.amount.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">
                        {isManager && (
                          <button onClick={() => deleteExpense(exp.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* TAB 3: DEPOSITS */}
        {activeTab === 'deposits' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Member Deposits (Joma / Fund)</h2>
                <p className="text-xs text-slate-500">Track advance payments from borders</p>
              </div>
              <button onClick={() => setShowDepModal(!showDepModal)} className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1">
                <Plus className="w-4 h-4" /><span>Record Deposit</span>
              </button>
            </div>

            {showDepModal && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!dAmount) return;
                  addDeposit({ id: `d-${Date.now()}`, date: dDate, memberId: dMember, amount: parseFloat(dAmount), method: dMethod, notes: dNotes });
                  setDAmount('');
                  setDNotes('');
                  setShowDepModal(false);
                }}
                className="mt-4 p-4 bg-slate-50 rounded-xl space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
                    <input type="date" required value={dDate} onChange={(e) => setDDate(e.target.value)} className="w-full p-2 bg-white border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Border</label>
                    <select value={dMember} onChange={(e) => setDMember(e.target.value)} className="w-full p-2 bg-white border rounded-lg">
                      {members.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Method</label>
                    <select value={dMethod} onChange={(e) => setDMethod(e.target.value as PaymentMethod)} className="w-full p-2 bg-white border rounded-lg">
                      {['bKash', 'Nagad', 'Cash', 'Rocket', 'Bank'].map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Amount ({settings.currency})</label>
                    <input type="number" step="any" required placeholder="4000" value={dAmount} onChange={(e) => setDAmount(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Transaction ID / Notes</label>
                  <input type="text" placeholder="bKash TrxID: 9XJK2388" value={dNotes} onChange={(e) => setDNotes(e.target.value)} className="w-full p-2 bg-white border rounded-lg" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowDepModal(false)} className="px-3 py-1 text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-1 bg-blue-600 text-white font-bold rounded-lg">Confirm</button>
                </div>
              </form>
            )}

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500 font-semibold">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Member</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3">Notes</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deposits.map((dep) => {
                    const m = members.find((x) => x.id === dep.memberId);
                    return (
                      <tr key={dep.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3">{dep.date}</td>
                        <td className="py-2 px-3 font-semibold">{m ? m.name : 'Unknown'}</td>
                        <td className="py-2 px-3"><span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">{dep.method}</span></td>
                        <td className="py-2 px-3 text-slate-600">{dep.notes || '-'}</td>
                        <td className="py-2 px-3 text-right font-bold text-blue-700">+{settings.currency}{dep.amount.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">
                          {isManager && (
                            <button onClick={() => deleteDeposit(dep.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SHARED BILLS */}
        {activeTab === 'bills' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Fixed & Shared Utility Bills</h2>
                <p className="text-xs text-slate-500">Rent, Maid, WiFi, Electricity split equally</p>
              </div>
              {isManager && (
                <button onClick={() => setShowBillModal(!showBillModal)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1">
                  <Plus className="w-4 h-4" /><span>Add Bill</span>
                </button>
              )}
            </div>

            {showBillModal && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!billAmount || !billTitle.trim()) return;
                  addBill({ id: `b-${Date.now()}`, title: billTitle.trim(), amount: parseFloat(billAmount), month: settings.currentMonth });
                  setBillTitle('');
                  setBillAmount('');
                  setShowBillModal(false);
                }}
                className="mt-4 p-4 bg-slate-50 rounded-xl space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bill Description</label>
                    <input type="text" required placeholder="e.g. Cook / Bua Salary" value={billTitle} onChange={(e) => setBillTitle(e.target.value)} className="w-full p-2 bg-white border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Amount ({settings.currency})</label>
                    <input type="number" step="any" required placeholder="3500" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} className="w-full p-2 bg-white border rounded-lg font-bold" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowBillModal(false)} className="px-3 py-1 text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-1 bg-indigo-600 text-white font-bold rounded-lg">Save</button>
                </div>
              </form>
            )}

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500 font-semibold">
                    <th className="py-2 px-3">Bill Title</th>
                    <th className="py-2 px-3 text-right">Total Bill</th>
                    <th className="py-2 px-3 text-right">Cost Per Person</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sharedBills.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold">{b.title}</td>
                      <td className="py-2 px-3 text-right font-bold">{settings.currency}{b.amount.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        {settings.currency}{(b.amount / Math.max(members.filter((m) => m.isActive).length, 1)).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {isManager && (
                          <button onClick={() => deleteBill(b.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FINAL MONTHLY SUMMARY REPORT */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Monthly Final Settlement Sheet</h2>
                <p className="text-xs text-slate-500">Live calculation of meal rate, dues, and refunds</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={handleWhatsAppCopy} className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center space-x-1">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy for WhatsApp'}</span>
                </button>
                <button onClick={() => window.print()} className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center space-x-1">
                  <Printer className="w-3.5 h-3.5" /><span>Print</span>
                </button>
              </div>
            </div>

            <div className="mt-4 bg-slate-50 border p-3 rounded-xl text-xs flex justify-between items-center">
              <div><strong>Meal Rate Formula: </strong>{settings.currency}{summary.totalGroceryCost.toLocaleString()} (Bazaar) ÷ {summary.totalMeals} (Meals) = <strong className="text-emerald-700">{settings.currency}{summary.mealRate.toFixed(2)}/meal</strong></div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-2 text-center">Room</th>
                    <th className="py-2.5 px-3 text-center">Meals</th>
                    <th className="py-2.5 px-3 text-right">Meal Cost</th>
                    <th className="py-2.5 px-3 text-right">Shared Bills</th>
                    <th className="py-2.5 px-3 text-right font-bold">Total Cost</th>
                    <th className="py-2.5 px-3 text-right font-bold text-blue-700">Total Deposit</th>
                    <th className="py-2.5 px-3 text-center">Net Balance</th>
                    <th className="py-2.5 px-3 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.memberSummaries.map((s) => (
                    <tr key={s.member.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold">{s.member.name}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{s.member.room}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{s.totalMeals}</td>
                      <td className="py-2.5 px-3 text-right">{settings.currency}{s.mealCost.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">{settings.currency}{s.sharedBillCost.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold">{settings.currency}{s.totalCost.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-700">{settings.currency}{s.totalDeposit.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center">
                        {s.netBalance >= 0 ? (
                          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            পাবে: {settings.currency}{s.netBalance.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                            দিবে: {settings.currency}{Math.abs(s.netBalance).toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button onClick={() => setSelectedSlipMember(s)} className="text-emerald-600 p-1 hover:bg-slate-100 rounded">
                          <Receipt className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedSlipMember && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-xs relative">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h3 className="font-bold text-sm">Individual Mess Slip</h3>
                    <button onClick={() => setSelectedSlipMember(null)} className="font-bold text-slate-400">✕</button>
                  </div>
                  <div className="space-y-1.5 mt-3">
                    <div className="flex justify-between"><span>Name:</span><strong>{selectedSlipMember.member.name}</strong></div>
                    <div className="flex justify-between"><span>Total Meals:</span><strong>{selectedSlipMember.totalMeals}</strong></div>
                    <div className="flex justify-between"><span>Meal Cost:</span><span>{settings.currency}{selectedSlipMember.mealCost}</span></div>
                    <div className="flex justify-between"><span>Shared Bills:</span><span>{settings.currency}{selectedSlipMember.sharedBillCost}</span></div>
                    <div className="flex justify-between font-bold border-t pt-1"><span>Total Cost:</span><span>{settings.currency}{selectedSlipMember.totalCost}</span></div>
                    <div className="flex justify-between font-bold text-blue-700"><span>Total Deposit:</span><span>{settings.currency}{selectedSlipMember.totalDeposit}</span></div>
                    <div className="pt-2 text-center">
                      {selectedSlipMember.netBalance >= 0 ? (
                        <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl font-bold">পাবে: {settings.currency}{selectedSlipMember.netBalance.toFixed(1)}</div>
                      ) : (
                        <div className="bg-rose-50 text-rose-800 p-2 rounded-xl font-bold">দিবে: {settings.currency}{Math.abs(selectedSlipMember.netBalance).toFixed(1)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: MEMBERS */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Mess Borders & Roommates</h2>
                <p className="text-xs text-slate-500">Manage roommates, rooms, and contact numbers</p>
              </div>
              {isManager && (
                <button onClick={() => setShowMemberModal(!showMemberModal)} className="bg-purple-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1">
                  <UserPlus className="w-4 h-4" /><span>Add Border</span>
                </button>
              )}
            </div>

            {showMemberModal && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMemName.trim()) return;
                  addMember({
                    id: `m-${Date.now()}`,
                    name: newMemName.trim(),
                    phone: newMemPhone.trim() || 'N/A',
                    room: newMemRoom.trim() || 'General',
                    role: newMemRole,
                    avatarColor: 'bg-emerald-600',
                    isActive: true,
                  });
                  setNewMemName('');
                  setNewMemPhone('');
                  setNewMemRoom('');
                  setShowMemberModal(false);
                }}
                className="mt-4 p-4 bg-slate-50 rounded-xl space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                    <input type="text" required placeholder="Name" value={newMemName} onChange={(e) => setNewMemName(e.target.value)} className="w-full p-2 bg-white border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone</label>
                    <input type="text" placeholder="Phone" value={newMemPhone} onChange={(e) => setNewMemPhone(e.target.value)} className="w-full p-2 bg-white border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Room No</label>
                    <input type="text" placeholder="102" value={newMemRoom} onChange={(e) => setNewMemRoom(e.target.value)} className="w-full p-2 bg-white border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Role</label>
                    <select value={newMemRole} onChange={(e) => setNewMemRole(e.target.value as Role)} className="w-full p-2 bg-white border rounded-lg">
                      <option value="member">Border (Member)</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowMemberModal(false)} className="px-3 py-1 text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-1 bg-purple-600 text-white font-bold rounded-lg">Save</button>
                </div>
              </form>
            )}

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl border bg-slate-50/60 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl ${m.avatarColor || 'bg-slate-600'} text-white flex items-center justify-center font-bold text-sm`}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500">Room {m.room} • {m.phone}</div>
                    </div>
                  </div>
                  {isManager && (
                    <button onClick={() => toggleMemberActive(m.id)} className="text-xs font-semibold px-2 py-1 rounded bg-slate-200 text-slate-700">
                      {m.isActive ? 'Active' : 'Inactive'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
