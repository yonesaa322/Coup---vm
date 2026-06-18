import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  History,
  AlertTriangle,
  ClipboardList,
  BarChart3,
  FileText,
  LogOut,
  Camera,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  Trash2,
  TrendingUp,
  Building2,
  UserCheck,
  Activity,
  Download,
  Printer,
  Menu,
  Lock,
  Mail,
  Star,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  RefreshCw,
  CheckCircle,
  X,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import * as XLSX from "xlsx";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCHJbye8jtmiIFo0myQlU49HWGaTTpyb74",
  authDomain: "coup---vm.firebaseapp.com",
  projectId: "coup---vm",
  storageBucket: "coup---vm.firebasestorage.app",
  messagingSenderId: "744594733606",
  appId: "1:744594733606:web:80ff3e61dd527923b384e7",
  measurementId: "G-49WNCQE8WV"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const visitsCollection = collection(db, "visits");
const INK = "#121212";
const INK_SOFT = "#2A2A28";
const GOLD = "#C8A24A";
const GOLD_DEEP = "#9C7C2E";
const GOLD_SOFT = "#F3E8CC";
const STONE = "#F4F3F1";
const ACCOUNTS = [
  { id: "u_mgr", name: "Layla Haddad", email: "manager@coup.com", password: "demo123", role: "manager", title: "VM Manager" },
  { id: "u1", name: "Sara Al-Amri", email: "sara@coup.com", password: "demo123", role: "member", title: "VM Specialist" },
  { id: "u2", name: "Omar Khalil", email: "omar@coup.com", password: "demo123", role: "member", title: "VM Specialist" },
  { id: "u3", name: "Nadia Youssef", email: "nadia@coup.com", password: "demo123", role: "member", title: "VM Specialist" },
  { id: "u4", name: "Yousef Saleh", email: "yousef@coup.com", password: "demo123", role: "member", title: "VM Specialist" },
  { id: "u5", name: "Mona Tarek", email: "mona@coup.com", password: "demo123", role: "member", title: "VM Specialist" },
  { id: "u6", name: "Hassan Aziz", email: "hassan@coup.com", password: "demo123", role: "member", title: "VM Specialist" },
  { id: "u7", name: "Dina Farouk", email: "dina@coup.com", password: "demo123", role: "member", title: "VM Specialist" }
];
const BRANCHES = [
  { id: "b1", name: "COUP - Mall of Egypt" },
  { id: "b2", name: "COUP - City Stars" },
  { id: "b3", name: "COUP - Mall of Arabia" },
  { id: "b4", name: "COUP - Cairo Festival City" },
  { id: "b5", name: "COUP - Alexandria City Center" },
  { id: "b6", name: "COUP - Dandy Mall" },
  { id: "b7", name: "COUP - Point 90" },
  { id: "b8", name: "COUP - Downtown Cairo" }
];
const VISIT_TYPES = ["Routine Visit", "Follow-up Visit", "New Store Opening", "Emergency Visit"];
const DURATION_TARGETS = { "Routine Visit": 60, "Follow-up Visit": 45, "New Store Opening": 150, "Emergency Visit": 30 };
const TASK_OPTIONS = [
  "Window Update",
  "Mannequin Styling",
  "Promotional Setup",
  "Re-merchandising",
  "Category Rearrangement",
  "New Collection Setup",
  "Price Correction",
  "Staff Coaching",
  "Store Refresh",
  "Product Reorganization"
];
const ISSUE_TYPES = ["VM Issue", "Pricing Issue", "Stock Issue", "Staffing Issue", "Maintenance Issue", "Customer Flow Issue"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const PRIORITY_STYLES = {
  Low: { bg: "#F1F1EF", text: "#52524C", dot: "#9CA3AF" },
  Medium: { bg: "#F3E8CC", text: "#7A5C13", dot: GOLD },
  High: { bg: "#FCE6D6", text: "#9A3412", dot: "#EA580C" },
  Critical: { bg: "#FBDEDE", text: "#962020", dot: "#DC2626" }
};
const ACTION_STATUSES = ["Open", "In Progress", "Completed"];
const AUDIT_SECTIONS = [
  { key: "windowDisplay", label: "Window Display", items: [
    { key: "cleanliness", label: "Cleanliness" },
    { key: "productPresentation", label: "Product Presentation" },
    { key: "pricingVisibility", label: "Pricing Visibility" },
    { key: "campaignVisibility", label: "Campaign Visibility" }
  ] },
  { key: "mannequins", label: "Mannequins", items: [
    { key: "stylingAccuracy", label: "Styling Accuracy" },
    { key: "visualImpact", label: "Visual Impact" },
    { key: "productAvailability", label: "Product Availability" },
    { key: "commercialAppeal", label: "Commercial Appeal" }
  ] },
  { key: "storeStandards", label: "Store Standards", items: [
    { key: "foldingStandards", label: "Folding Standards" },
    { key: "hangingStandards", label: "Hanging Standards" },
    { key: "categoryArrangement", label: "Category Arrangement" },
    { key: "signage", label: "Signage" },
    { key: "promotionalMaterials", label: "Promotional Materials" },
    { key: "customerFlow", label: "Customer Flow" }
  ] }
];
const WIZARD_STEPS = [
  { n: 1, label: "Check In" },
  { n: 2, label: "Store Info" },
  { n: 3, label: "VM Audit" },
  { n: 4, label: "Tasks" },
  { n: 5, label: "Team Support" },
  { n: 6, label: "Issues" },
  { n: 7, label: "Action Plan" },
  { n: 8, label: "Check Out" }
];
function uid(prefix) {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function avg(arr) {
  const list = (arr || []).filter((v) => typeof v === "number" && !isNaN(v));
  if (!list.length) return 0;
  return list.reduce((a, b) => a + b, 0) / list.length;
}
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function formatDateHuman(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTimeHuman(iso) {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function minutesBetween(isoStart, isoEnd) {
  const a = new Date(isoStart).getTime();
  const b = new Date(isoEnd).getTime();
  if (isNaN(a) || isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 6e4));
}
function durationLabel(mins) {
  if (mins == null) return "\u2014";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return m + "m";
  return h + "h " + m + "m";
}
function ratingItemsFlat() {
  const out = [];
  AUDIT_SECTIONS.forEach((s) => s.items.forEach((i) => out.push({ section: s.key, key: i.key, label: i.label })));
  return out;
}
function emptyAudit() {
  const a = {};
  AUDIT_SECTIONS.forEach((s) => {
    a[s.key] = {};
    s.items.forEach((i) => {
      a[s.key][i.key] = 0;
    });
  });
  return a;
}
function computeComplianceScore(audit) {
  const items = ratingItemsFlat();
  let sum = 0;
  items.forEach((it) => {
    sum += audit && audit[it.section] && audit[it.section][it.key] || 0;
  });
  if (!items.length) return 0;
  return Math.round(sum / (items.length * 5) * 100);
}
function allRatingsFilled(audit) {
  return ratingItemsFlat().every((it) => (audit && audit[it.section] && audit[it.section][it.key] || 0) >= 1);
}
function sectionAverage(audit, sectionKey) {
  const section = AUDIT_SECTIONS.find((s) => s.key === sectionKey);
  if (!section) return 0;
  const values = section.items.map((i) => audit && audit[sectionKey] && audit[sectionKey][i.key] || 0);
  return avg(values);
}
function computeProductivityScore(visit) {
  const compliance = visit.complianceScore || 0;
  const taskScore = clamp((visit.tasksCompleted || []).length / 8 * 100, 0, 100);
  const teamScore = clamp((visit.teamSupport && visit.teamSupport.teamCooperationScore || 0) / 5 * 100, 0, 100);
  const target = DURATION_TARGETS[visit.visitType] || 60;
  const duration = visit.durationMinutes || target;
  let timeScore;
  if (duration <= target) timeScore = 100;
  else timeScore = clamp(100 - (duration - target) / target * 50, 40, 100);
  const score = 0.4 * compliance + 0.25 * taskScore + 0.15 * teamScore + 0.2 * timeScore;
  return Math.round(clamp(score, 0, 100));
}
function buildNewVisit(args) {
  const employee = args.employee, branch = args.branch, visitType = args.visitType, gps = args.gps, entrancePhoto = args.entrancePhoto;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: uid("visit"),
    employeeId: employee.id,
    employeeName: employee.name,
    branchId: branch.id,
    branchName: branch.name,
    visitType,
    date: todayStr(),
    checkInTime: now,
    checkOutTime: null,
    status: "active",
    currentStep: 1,
    gps: gps || null,
    entrancePhoto: entrancePhoto || null,
    storeInfo: { branchManager: "", storeSizeSqm: "", employeesScheduled: "", employeesPresent: "" },
    audit: emptyAudit(),
    complianceScore: 0,
    tasksCompleted: [],
    workDescription: "",
    timeSpentMinutes: "",
    beforePhotos: [],
    afterPhotos: [],
    teamSupport: { employeesAssistedCount: 0, employeeNames: [], teamCooperationScore: 0 },
    issues: [],
    actionPlans: [],
    visitSummary: "",
    additionalNotes: "",
    durationMinutes: null,
    productivityScore: null
  };
}
function resizeImageFile(file, maxWidth, quality) {
  maxWidth = maxWidth || 420;
  quality = quality || 0.55;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Could not load image data."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch (e) {
          reject(e);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function captureGeolocation() {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve({ ok: false, error: "Location services are not available in this browser." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ ok: true, lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => resolve({ ok: false, error: err && err.message ? err.message : "Location permission was denied." }),
      { enableHighAccuracy: true, timeout: 8e3 }
    );
  });
}
function useVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);
  useEffect(() => {
    let unsubscribeSnapshot = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        unsubscribeSnapshot = onSnapshot(
          visitsCollection,
          (snapshot) => {
            setVisits(snapshot.docs.map((d) => d.data()));
            setLoading(false);
            setSyncError(null);
          },
          () => {
            setSyncError("Could not connect to the shared database. Check your internet connection and try again.");
            setLoading(false);
          }
        );
      } else {
        signInAnonymously(auth).catch(() => {
          setSyncError("Could not connect to the shared database.");
          setLoading(false);
        });
      }
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);
  const saveVisit = useCallback(async (visit) => {
    setVisits((prev) => {
      const exists = prev.some((v) => v.id === visit.id);
      return exists ? prev.map((v) => v.id === visit.id ? visit : v) : prev.concat([visit]);
    });
    try {
      await setDoc(doc(visitsCollection, visit.id), visit);
      setSyncError(null);
    } catch (err) {
      setSyncError("Could not sync this change to the shared database. It is saved on this device for now \u2014 check your connection and try again.");
    }
  }, []);
  return { visits, loading, syncError, saveVisit };
}
function Logo(props) {
  const dark = props.dark;
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "flex h-8 w-8 items-center justify-center rounded-sm text-sm font-bold",
      style: { backgroundColor: dark ? GOLD : INK, color: dark ? INK : GOLD }
    },
    "C"
  ), /* @__PURE__ */ React.createElement("div", { className: "leading-none" }, /* @__PURE__ */ React.createElement("div", { className: "text-base font-bold tracking-widest " + (dark ? "text-white" : "text-[#121212]") }, "COUP"), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] uppercase tracking-widest " + (dark ? "text-white/50" : "text-gray-400") }, "VM Excellence")));
}
function GoldRule(props) {
  return /* @__PURE__ */ React.createElement("div", { className: "h-[3px] w-10 rounded-full " + (props.className || ""), style: { backgroundColor: GOLD } });
}
function SectionHeader(props) {
  return /* @__PURE__ */ React.createElement("div", { className: "mb-5 flex flex-wrap items-end justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, props.eyebrow ? /* @__PURE__ */ React.createElement("div", { className: "mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400" }, props.eyebrow) : null, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold text-gray-900" }, props.title), props.subtitle ? /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, props.subtitle) : null), props.action ? /* @__PURE__ */ React.createElement("div", null, props.action) : null);
}
function KPICard(props) {
  const Icon = props.icon;
  return /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden rounded-sm border border-gray-200 bg-white p-4" }, /* @__PURE__ */ React.createElement("div", { className: "absolute left-0 top-0 h-[3px] w-full", style: { backgroundColor: props.accentColor || GOLD } }), /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-semibold uppercase tracking-wider text-gray-400" }, props.label), Icon ? /* @__PURE__ */ React.createElement(Icon, { className: "h-4 w-4 text-gray-300" }) : null), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-3xl font-bold tabular-nums text-gray-900" }, props.value), props.sub ? /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-xs text-gray-500" }, props.sub) : null);
}
function scoreColor(value) {
  if (value >= 85) return "#1F7A4D";
  if (value >= 70) return GOLD_DEEP;
  if (value >= 50) return "#C2730B";
  return "#B83232";
}
function ScoreRing(props) {
  const value = clamp(props.value || 0, 0, 100);
  const size = props.size || 76;
  const stroke = props.stroke || 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - value / 100 * c;
  const color = scoreColor(value);
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center", style: { width: size } }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size }, /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "#EAEAE6", strokeWidth: stroke }), /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: size / 2,
      cy: size / 2,
      r,
      fill: "none",
      stroke: color,
      strokeWidth: stroke,
      strokeDasharray: c,
      strokeDashoffset: offset,
      strokeLinecap: "round",
      transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")"
    }
  ), /* @__PURE__ */ React.createElement("text", { x: "50%", y: "50%", textAnchor: "middle", dominantBaseline: "central", fontSize: size * 0.26, fontWeight: "700", fill: "#121212" }, value)), props.label ? /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-center text-[11px] font-medium uppercase tracking-wide text-gray-400" }, props.label) : null);
}
function RatingPicker(props) {
  const value = props.value || 0;
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3 py-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-700" }, props.label), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5" }, [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: n,
      type: "button",
      onClick: () => props.onChange(n),
      className: "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
      style: n <= value ? { backgroundColor: GOLD, borderColor: GOLD, color: "#121212" } : { backgroundColor: "#FFFFFF", borderColor: "#D8D6D0", color: "#9C9C94" }
    },
    n
  ))));
}
function StarsReadout(props) {
  const value = props.value || 0;
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-0.5" }, [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ React.createElement(Star, { key: n, className: "h-3.5 w-3.5", fill: n <= value ? GOLD : "none", stroke: n <= value ? GOLD : "#D8D6D0" })));
}
function Chip(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: props.onClick,
      className: "rounded-sm border px-3 py-1.5 text-left text-sm font-medium transition-colors",
      style: props.active ? { backgroundColor: "#121212", borderColor: "#121212", color: GOLD } : { backgroundColor: "#FFFFFF", borderColor: "#D8D6D0", color: "#3A3A36" }
    },
    props.children
  );
}
function StatusBadge(props) {
  const status = props.status;
  const map = {
    active: { bg: "#F3E8CC", text: "#7A5C13", label: "In Progress" },
    completed: { bg: "#E4EFE7", text: "#1F6B41", label: "Completed" },
    Open: { bg: "#F1F1EF", text: "#52524C", label: "Open" },
    "In Progress": { bg: "#F3E8CC", text: "#7A5C13", label: "In Progress" },
    Completed: { bg: "#E4EFE7", text: "#1F6B41", label: "Completed" },
    resolved: { bg: "#E4EFE7", text: "#1F6B41", label: "Resolved" },
    open: { bg: "#FBDEDE", text: "#962020", label: "Open" }
  };
  const s = map[status] || { bg: "#F1F1EF", text: "#52524C", label: status };
  return /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold", style: { backgroundColor: s.bg, color: s.text } }, s.label);
}
function PriorityBadge(props) {
  const s = PRIORITY_STYLES[props.priority] || PRIORITY_STYLES.Low;
  return /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-semibold", style: { backgroundColor: s.bg, color: s.text } }, /* @__PURE__ */ React.createElement("span", { className: "h-1.5 w-1.5 rounded-full", style: { backgroundColor: s.dot } }), props.priority);
}
function EmptyState(props) {
  const Icon = props.icon;
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center rounded-sm border border-dashed border-gray-300 px-6 py-12 text-center" }, Icon ? /* @__PURE__ */ React.createElement(Icon, { className: "mb-3 h-7 w-7 text-gray-300" }) : null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-semibold text-gray-700" }, props.title), props.message ? /* @__PURE__ */ React.createElement("div", { className: "mt-1 max-w-sm text-sm text-gray-400" }, props.message) : null);
}
function Field(props) {
  return /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500" }, props.label, " ", props.required ? /* @__PURE__ */ React.createElement("span", { style: { color: GOLD_DEEP } }, "*") : null), props.children);
}
const inputCls = "w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-[#C8A24A] focus:ring-1 focus:ring-[#C8A24A]";
function PhotoThumb(props) {
  return /* @__PURE__ */ React.createElement("div", { className: "group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-gray-200" }, /* @__PURE__ */ React.createElement("img", { src: props.src, alt: props.alt || "photo", className: "h-full w-full object-cover" }), props.onRemove ? /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: props.onRemove,
      className: "absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
    },
    /* @__PURE__ */ React.createElement(X, { className: "h-3 w-3" })
  ) : null);
}
function PhotoUploader(props) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const photos = props.photos || [];
  const multiple = props.multiple !== false;
  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const results = [];
      for (const f of files) {
        try {
          const dataUrl = await resizeImageFile(f, props.maxWidth, props.quality);
          results.push(dataUrl);
        } catch (e) {
        }
      }
      if (multiple) props.onChange(photos.concat(results));
      else props.onChange(results.slice(-1));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, photos.map((src, idx) => /* @__PURE__ */ React.createElement(PhotoThumb, { key: idx, src, onRemove: () => props.onChange(photos.filter((_, i) => i !== idx)) })), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => inputRef.current && inputRef.current.click(),
      disabled: busy,
      className: "flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-gray-300 text-gray-400 transition-colors hover:border-[#C8A24A] hover:text-[#9C7C2E] disabled:opacity-50"
    },
    busy ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(Camera, { className: "h-4 w-4" }),
    /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-medium" }, busy ? "Saving" : "Add photo")
  )), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: inputRef,
      type: "file",
      accept: "image/*",
      multiple,
      className: "hidden",
      onChange: (e) => handleFiles(e.target.files)
    }
  ));
}
function Modal(props) {
  if (!props.open) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4", onClick: props.onClose }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "max-h-[92vh] w-full overflow-y-auto rounded-t-sm bg-white sm:rounded-sm " + (props.wide ? "sm:max-w-3xl" : "sm:max-w-lg"),
      onClick: (e) => e.stopPropagation()
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between border-b border-gray-200 px-5 py-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-gray-900" }, props.title), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: props.onClose, className: "rounded-sm p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" }, /* @__PURE__ */ React.createElement(X, { className: "h-4.5 w-4.5" }))),
    /* @__PURE__ */ React.createElement("div", { className: "px-5 py-4" }, props.children)
  ));
}
function PrimaryButton(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: props.type || "button",
      onClick: props.onClick,
      disabled: props.disabled,
      className: "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-opacity disabled:cursor-not-allowed disabled:opacity-40 " + (props.className || ""),
      style: { backgroundColor: INK, color: GOLD }
    },
    props.children
  );
}
function SecondaryButton(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: props.type || "button",
      onClick: props.onClick,
      disabled: props.disabled,
      className: "inline-flex items-center justify-center gap-2 rounded-sm border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40 " + (props.className || "")
    },
    props.children
  );
}
function LoginScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  function attemptLogin(e, overrideEmail, overridePassword) {
    if (e && e.preventDefault) e.preventDefault();
    const useEmail = (overrideEmail != null ? overrideEmail : email).trim().toLowerCase();
    const usePassword = overridePassword != null ? overridePassword : password;
    const account = ACCOUNTS.find((a) => a.email.toLowerCase() === useEmail);
    if (!account || account.password !== usePassword) {
      setError("Invalid email or password. Check the demo accounts below if you need access.");
      return;
    }
    setError("");
    props.onLogin(account);
  }
  function quickLogin(role) {
    const account = role === "manager" ? ACCOUNTS[0] : ACCOUNTS[1];
    setEmail(account.email);
    setPassword(account.password);
    attemptLogin(null, account.email, account.password);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen w-full items-center justify-center bg-[#121212] px-4 py-10" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "mb-7 flex flex-col items-center text-center" }, /* @__PURE__ */ React.createElement("div", { className: "mb-4 flex h-14 w-14 items-center justify-center rounded-sm text-2xl font-bold", style: { backgroundColor: GOLD, color: "#121212" } }, "C"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold tracking-widest text-white" }, "COUP"), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-xs uppercase tracking-widest", style: { color: GOLD } }, "VM Excellence & Store Audit System")), /* @__PURE__ */ React.createElement("div", { className: "overflow-hidden rounded-sm bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "h-[3px] w-full", style: { backgroundColor: GOLD } }), /* @__PURE__ */ React.createElement("form", { onSubmit: attemptLogin, className: "p-6 sm:p-7" }, /* @__PURE__ */ React.createElement("h1", { className: "mb-1 text-lg font-bold text-gray-900" }, "Sign in"), /* @__PURE__ */ React.createElement("p", { className: "mb-5 text-sm text-gray-500" }, "Use your COUP Visual Merchandising account."), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(Field, { label: "Email", required: true }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      placeholder: "name@coup.com",
      className: inputCls + " pl-9",
      required: true
    }
  ))), /* @__PURE__ */ React.createElement(Field, { label: "Password", required: true }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      placeholder: "\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022",
      className: inputCls + " pl-9",
      required: true
    }
  )))), error ? /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex items-start gap-2 rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "mt-0.5 h-4 w-4 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", null, error)) : null, /* @__PURE__ */ React.createElement(PrimaryButton, { type: "submit", className: "mt-5 w-full" }, "Sign in ", /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4" }))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-gray-100 px-6 pb-6 pt-4 sm:px-7" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowDemo((v) => !v),
      className: "flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600"
    },
    "Demo access",
    /* @__PURE__ */ React.createElement(ChevronDown, { className: "h-3.5 w-3.5 transition-transform " + (showDemo ? "rotate-180" : "") })
  ), showDemo ? /* @__PURE__ */ React.createElement("div", { className: "mt-3 space-y-2" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => quickLogin("manager"), className: "flex w-full items-center justify-between rounded-sm border border-gray-200 px-3 py-2 text-left text-xs hover:border-gray-300" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-gray-700" }, "VM Manager"), /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-gray-400" }, "manager@coup.com")), /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-3.5 w-3.5 text-gray-400" })), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => quickLogin("member"), className: "flex w-full items-center justify-between rounded-sm border border-gray-200 px-3 py-2 text-left text-xs hover:border-gray-300" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-gray-700" }, "VM Team Member"), /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-gray-400" }, "sara@coup.com")), /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-3.5 w-3.5 text-gray-400" })), /* @__PURE__ */ React.createElement("div", { className: "pt-1 text-[11px] text-gray-400" }, "Password for every demo account: demo123")) : null)), /* @__PURE__ */ React.createElement("div", { className: "mt-6 text-center text-[11px] text-white/30" }, "COUP Visual Merchandising Department \\u00b7 Internal Operations Platform")));
}
const MEMBER_NAV = [
  { key: "home", label: "Home", icon: LayoutDashboard },
  { key: "visits", label: "My Visits", icon: History }
];
const MANAGER_NAV = [
  { key: "home", label: "Dashboard", icon: LayoutDashboard },
  { key: "team", label: "Employee Performance", icon: Users },
  { key: "branches", label: "Branch Performance", icon: Building2 },
  { key: "audits", label: "Audit History", icon: ClipboardList },
  { key: "issues", label: "Issues", icon: AlertTriangle },
  { key: "actions", label: "Action Plans", icon: CheckCircle2 },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "reports", label: "Reports", icon: FileText }
];
function NavItems(props) {
  const items = props.role === "manager" ? MANAGER_NAV : MEMBER_NAV;
  return /* @__PURE__ */ React.createElement("nav", { className: "flex flex-col gap-1 px-3" }, items.map((item) => {
    const Icon = item.icon;
    const active = props.view === item.key;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: item.key,
        type: "button",
        onClick: () => props.onSelect(item.key),
        className: "flex items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors",
        style: active ? { backgroundColor: "rgba(200,162,74,0.14)", color: GOLD, fontWeight: 600 } : { color: "#C9C9C2" }
      },
      /* @__PURE__ */ React.createElement(Icon, { className: "h-4 w-4 flex-shrink-0", style: { color: active ? GOLD : "#7A7A72" } }),
      item.label,
      active ? /* @__PURE__ */ React.createElement("span", { className: "ml-auto h-1.5 w-1.5 rounded-full", style: { backgroundColor: GOLD } }) : null
    );
  }));
}
function SidebarContent(props) {
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-full flex-col bg-[#121212] text-white" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-5 py-5" }, /* @__PURE__ */ React.createElement(Logo, { dark: true }), props.onClose ? /* @__PURE__ */ React.createElement("button", { type: "button", onClick: props.onClose, className: "text-white/50 hover:text-white" }, /* @__PURE__ */ React.createElement(X, { className: "h-5 w-5" })) : null), /* @__PURE__ */ React.createElement("div", { className: "px-5 pb-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-semibold uppercase tracking-widest text-white/30" }, props.role === "manager" ? "Manager Console" : "Field Operations")), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto pb-4" }, /* @__PURE__ */ React.createElement(NavItems, { role: props.role, view: props.view, onSelect: props.onSelect })), /* @__PURE__ */ React.createElement("div", { className: "border-t border-white/10 px-5 py-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold", style: { backgroundColor: GOLD, color: "#121212" } }, props.user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "truncate text-sm font-semibold text-white" }, props.user.name), /* @__PURE__ */ React.createElement("div", { className: "truncate text-[11px] text-white/40" }, props.user.title)), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: props.onLogout, title: "Log out", className: "flex-shrink-0 text-white/40 hover:text-white" }, /* @__PURE__ */ React.createElement(LogOut, { className: "h-4 w-4" })))));
}
function TopBar(props) {
  const items = props.role === "manager" ? MANAGER_NAV : MEMBER_NAV;
  const current = items.find((i) => i.key === props.view);
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: props.onMenu, className: "-ml-1 rounded-sm p-1.5 text-gray-600 hover:bg-gray-100 md:hidden" }, /* @__PURE__ */ React.createElement(Menu, { className: "h-5 w-5" })), /* @__PURE__ */ React.createElement("div", { className: "md:hidden" }, /* @__PURE__ */ React.createElement(Logo, null)), /* @__PURE__ */ React.createElement("div", { className: "hidden text-sm font-semibold text-gray-700 md:block" }, current ? current.label : "")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, props.syncError ? /* @__PURE__ */ React.createElement("span", { className: "hidden items-center gap-1 text-[11px] text-red-500 sm:flex", title: props.syncError }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "h-3.5 w-3.5" }), " Sync issue") : /* @__PURE__ */ React.createElement("span", { className: "hidden items-center gap-1 text-[11px] text-gray-400 sm:flex" }, /* @__PURE__ */ React.createElement("span", { className: "h-1.5 w-1.5 rounded-full bg-green-500" }), " Live"), /* @__PURE__ */ React.createElement("div", { className: "hidden h-8 w-8 items-center justify-center rounded-full text-xs font-bold sm:flex", style: { backgroundColor: GOLD_SOFT, color: GOLD_DEEP } }, props.user.name.split(" ").map((p) => p[0]).slice(0, 2).join(""))));
}
function DetailLabel(props) {
  return /* @__PURE__ */ React.createElement("div", { className: "mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400" }, props.children);
}
function VisitDetailView(props) {
  const visit = props.visit;
  if (!visit) return null;
  const hasPhotos = visit.beforePhotos && visit.beforePhotos.length || visit.afterPhotos && visit.afterPhotos.length;
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold text-gray-900" }, visit.branchName), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-xs text-gray-500" }, visit.employeeName, " \xB7 ", visit.visitType), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-xs text-gray-400" }, formatDateHuman(visit.checkInTime), " \xB7 In ", formatTimeHuman(visit.checkInTime), visit.checkOutTime ? " \xB7 Out " + formatTimeHuman(visit.checkOutTime) : "")), /* @__PURE__ */ React.createElement(StatusBadge, { status: visit.status })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-center gap-8 rounded-sm border border-gray-100 bg-[#FAFAF8] py-5" }, /* @__PURE__ */ React.createElement(ScoreRing, { value: visit.complianceScore || 0, label: "VM Compliance" }), visit.status === "completed" ? /* @__PURE__ */ React.createElement(ScoreRing, { value: visit.productivityScore || 0, label: "Productivity" }) : null, visit.entrancePhoto ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-1.5" }, /* @__PURE__ */ React.createElement("img", { src: visit.entrancePhoto, alt: "Entrance", className: "h-[76px] w-[76px] rounded-sm border border-gray-200 object-cover" }), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-medium uppercase tracking-wide text-gray-400" }, "Entrance")) : null), visit.gps ? /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 text-xs text-gray-500" }, /* @__PURE__ */ React.createElement(MapPin, { className: "h-3.5 w-3.5" }), " ", visit.gps.lat.toFixed(5), ", ", visit.gps.lng.toFixed(5)) : null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DetailLabel, null, "Store Information"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3 text-sm sm:grid-cols-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Branch Manager"), /* @__PURE__ */ React.createElement("div", { className: "font-medium text-gray-800" }, visit.storeInfo.branchManager || "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Store Size"), /* @__PURE__ */ React.createElement("div", { className: "font-medium text-gray-800" }, visit.storeInfo.storeSizeSqm ? visit.storeInfo.storeSizeSqm + " sqm" : "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Scheduled"), /* @__PURE__ */ React.createElement("div", { className: "font-medium text-gray-800" }, visit.storeInfo.employeesScheduled || "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Present"), /* @__PURE__ */ React.createElement("div", { className: "font-medium text-gray-800" }, visit.storeInfo.employeesPresent || "\u2014")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DetailLabel, null, "VM Audit"), AUDIT_SECTIONS.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.key, className: "mb-3 rounded-sm border border-gray-100 p-3" }, /* @__PURE__ */ React.createElement("div", { className: "mb-2 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-semibold text-gray-800" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Avg ", sectionAverage(visit.audit, s.key).toFixed(1))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, s.items.map((i) => /* @__PURE__ */ React.createElement("div", { key: i.key, className: "flex items-center justify-between text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-gray-600" }, i.label), /* @__PURE__ */ React.createElement(StarsReadout, { value: visit.audit[s.key] ? visit.audit[s.key][i.key] : 0 }))))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DetailLabel, null, "Tasks Completed"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5" }, (visit.tasksCompleted || []).map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "rounded-sm px-2 py-1 text-xs font-medium", style: { backgroundColor: GOLD_SOFT, color: GOLD_DEEP } }, t)), !(visit.tasksCompleted || []).length ? /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-400" }, "No tasks recorded") : null), visit.workDescription ? /* @__PURE__ */ React.createElement("p", { className: "mt-2 text-sm text-gray-600" }, visit.workDescription) : null, visit.timeSpentMinutes ? /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-xs text-gray-400" }, "Time spent: ", visit.timeSpentMinutes, " min") : null, hasPhotos ? /* @__PURE__ */ React.createElement("div", { className: "mt-3 grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-1.5 text-xs font-medium text-gray-500" }, "Before"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, (visit.beforePhotos || []).map((p, i) => /* @__PURE__ */ React.createElement(PhotoThumb, { key: i, src: p })), !(visit.beforePhotos || []).length ? /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-300" }, "None") : null)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-1.5 text-xs font-medium text-gray-500" }, "After"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, (visit.afterPhotos || []).map((p, i) => /* @__PURE__ */ React.createElement(PhotoThumb, { key: i, src: p })), !(visit.afterPhotos || []).length ? /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-300" }, "None") : null))) : null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DetailLabel, null, "Store Team Support"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-700" }, visit.teamSupport.employeesAssistedCount || 0, " employee(s) assisted"), (visit.teamSupport.employeeNames || []).length ? /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-sm text-gray-500" }, visit.teamSupport.employeeNames.join(", ")) : null, /* @__PURE__ */ React.createElement("div", { className: "mt-2 flex items-center gap-2 text-sm text-gray-600" }, "Cooperation Score ", /* @__PURE__ */ React.createElement(StarsReadout, { value: visit.teamSupport.teamCooperationScore }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DetailLabel, null, "Issues Reported", (visit.issues || []).length ? " (" + visit.issues.length + ")" : ""), (visit.issues || []).length ? (visit.issues || []).map((iss) => /* @__PURE__ */ React.createElement("div", { key: iss.id, className: "mb-2 rounded-sm border border-gray-100 p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-semibold text-gray-800" }, iss.type), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(PriorityBadge, { priority: iss.priority }), /* @__PURE__ */ React.createElement(StatusBadge, { status: iss.status }))), /* @__PURE__ */ React.createElement("p", { className: "mt-1.5 text-sm text-gray-600" }, iss.description), iss.immediateAction ? /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-gray-600" }, "Immediate action: "), iss.immediateAction) : null, iss.recommendedSolution ? /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-gray-600" }, "Recommended: "), iss.recommendedSolution) : null)) : /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-400" }, "No issues reported")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DetailLabel, null, "Action Plan"), (visit.actionPlans || []).length ? (visit.actionPlans || []).map((ap) => /* @__PURE__ */ React.createElement("div", { key: ap.id, className: "mb-2 flex items-start justify-between gap-3 rounded-sm border border-gray-100 p-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-gray-800" }, ap.taskDescription), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-xs text-gray-400" }, ap.responsiblePerson || "\u2014", " \xB7 Due ", formatDateHuman(ap.deadline))), /* @__PURE__ */ React.createElement(StatusBadge, { status: ap.status }))) : /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-400" }, "No action items")), visit.status === "completed" ? /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-100 bg-[#FAFAF8] p-3" }, /* @__PURE__ */ React.createElement(DetailLabel, null, "Check Out Summary"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3 text-sm sm:grid-cols-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Departure"), /* @__PURE__ */ React.createElement("div", { className: "font-medium text-gray-800" }, formatTimeHuman(visit.checkOutTime))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Duration"), /* @__PURE__ */ React.createElement("div", { className: "font-medium text-gray-800" }, durationLabel(visit.durationMinutes))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Productivity"), /* @__PURE__ */ React.createElement("div", { className: "font-medium text-gray-800" }, visit.productivityScore, "%"))), visit.visitSummary ? /* @__PURE__ */ React.createElement("p", { className: "mt-3 text-sm text-gray-600" }, visit.visitSummary) : null, visit.additionalNotes ? /* @__PURE__ */ React.createElement("p", { className: "mt-1.5 text-xs text-gray-500" }, visit.additionalNotes) : null) : null);
}
function elapsedLabel(startIso) {
  const mins = minutesBetween(startIso, (/* @__PURE__ */ new Date()).toISOString());
  return durationLabel(mins);
}
function VisitRow(props) {
  const v = props.visit;
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: props.onClick,
      className: "flex w-full items-center justify-between gap-3 rounded-sm border border-gray-100 bg-white px-4 py-3 text-left transition-colors hover:border-gray-300"
    },
    /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "truncate text-sm font-semibold text-gray-900" }, v.branchName), /* @__PURE__ */ React.createElement(StatusBadge, { status: v.status })), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 truncate text-xs text-gray-400" }, v.visitType, " \xB7 ", formatDateHuman(v.checkInTime))),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 flex-shrink-0" }, v.status === "completed" ? /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold tabular-nums", style: { color: scoreColor(v.complianceScore || 0) } }, v.complianceScore, "%"), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] uppercase tracking-wide text-gray-400" }, "Compliance")) : null, /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4 text-gray-300" }))
  );
}
function EmployeeHome(props) {
  const { user, visits, onStartNew, onResume, onView } = props;
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 3e4);
    return () => clearInterval(t);
  }, []);
  const myVisits = useMemo(
    () => visits.filter((v) => v.employeeId === user.id).sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime)),
    [visits, user.id]
  );
  const activeVisit = myVisits.find((v) => v.status === "active");
  const completed = myVisits.filter((v) => v.status === "completed");
  const avgCompliance = completed.length ? Math.round(avg(completed.map((v) => v.complianceScore))) : 0;
  const avgProductivity = completed.length ? Math.round(avg(completed.map((v) => v.productivityScore))) : 0;
  const openIssues = myVisits.reduce((sum, v) => sum + (v.issues || []).filter((i) => i.status === "open").length, 0);
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user.name.split(" ")[0];
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs font-semibold uppercase tracking-widest text-gray-400" }, (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })), /* @__PURE__ */ React.createElement("h1", { className: "mt-1 text-2xl font-bold text-gray-900" }, greeting, ", ", firstName)), activeVisit ? /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden rounded-sm border border-gray-200 bg-white p-5" }, /* @__PURE__ */ React.createElement("div", { className: "absolute left-0 top-0 h-[3px] w-full", style: { backgroundColor: GOLD } }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest", style: { color: GOLD_DEEP } }, /* @__PURE__ */ React.createElement(Activity, { className: "h-3.5 w-3.5" }), " Visit In Progress"), /* @__PURE__ */ React.createElement("div", { className: "mt-1.5 text-lg font-bold text-gray-900" }, activeVisit.branchName), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-sm text-gray-500" }, activeVisit.visitType, " \xB7 Checked in ", formatTimeHuman(activeVisit.checkInTime), " \xB7 ", elapsedLabel(activeVisit.checkInTime), " elapsed"), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-xs text-gray-400" }, "Step ", activeVisit.currentStep, " of ", WIZARD_STEPS.length, ": ", WIZARD_STEPS[activeVisit.currentStep - 1] ? WIZARD_STEPS[activeVisit.currentStep - 1].label : "")), /* @__PURE__ */ React.createElement(PrimaryButton, { onClick: () => onResume(activeVisit.id) }, "Resume Visit ", /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4" })))) : /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden rounded-sm border border-gray-200 p-5", style: { backgroundColor: INK } }, /* @__PURE__ */ React.createElement("div", { className: "absolute left-0 top-0 h-[3px] w-full", style: { backgroundColor: GOLD } }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest", style: { color: GOLD } }, /* @__PURE__ */ React.createElement(Sparkles, { className: "h-3.5 w-3.5" }), " Ready When You Are"), /* @__PURE__ */ React.createElement("div", { className: "mt-1.5 text-lg font-bold text-white" }, "Start today's branch visit"), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-sm text-white/50" }, "Check in to begin your audit, tasks, and reporting.")), /* @__PURE__ */ React.createElement(PrimaryButton, { onClick: onStartNew, className: "flex-shrink-0" }, "Check In ", /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4" })))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4" }, /* @__PURE__ */ React.createElement(KPICard, { label: "My Visits", value: myVisits.length, icon: History }), /* @__PURE__ */ React.createElement(KPICard, { label: "Completed", value: completed.length, icon: CheckCircle2 }), /* @__PURE__ */ React.createElement(KPICard, { label: "Avg Compliance", value: avgCompliance + "%", icon: ShieldCheck, accentColor: scoreColor(avgCompliance) }), /* @__PURE__ */ React.createElement(KPICard, { label: "Avg Productivity", value: avgProductivity + "%", icon: TrendingUp, accentColor: scoreColor(avgProductivity) })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Recent Visits" }), myVisits.length ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, myVisits.slice(0, 6).map((v) => /* @__PURE__ */ React.createElement(VisitRow, { key: v.id, visit: v, onClick: () => v.status === "active" ? onResume(v.id) : onView(v) }))) : /* @__PURE__ */ React.createElement(EmptyState, { icon: Store, title: "No visits yet", message: "Your branch visits will appear here once you check in." })));
}
function MyVisits(props) {
  const { user, visits, onResume, onView } = props;
  const [filter, setFilter] = useState("all");
  const myVisits = useMemo(
    () => visits.filter((v) => v.employeeId === user.id).sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime)),
    [visits, user.id]
  );
  const filtered = filter === "all" ? myVisits : myVisits.filter((v) => v.status === filter);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement(
    SectionHeader,
    {
      title: "My Visits",
      subtitle: myVisits.length + " total visit" + (myVisits.length === 1 ? "" : "s"),
      action: /* @__PURE__ */ React.createElement("div", { className: "flex gap-1.5" }, [{ key: "all", label: "All" }, { key: "active", label: "In Progress" }, { key: "completed", label: "Completed" }].map((f) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: f.key,
          type: "button",
          onClick: () => setFilter(f.key),
          className: "rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors",
          style: filter === f.key ? { backgroundColor: INK, color: GOLD } : { backgroundColor: "#F1F1EF", color: "#6B6B64" }
        },
        f.label
      )))
    }
  ), filtered.length ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, filtered.map((v) => /* @__PURE__ */ React.createElement(VisitRow, { key: v.id, visit: v, onClick: () => v.status === "active" ? onResume(v.id) : onView(v) }))) : /* @__PURE__ */ React.createElement(EmptyState, { icon: History, title: "No visits found", message: "Try a different filter, or start a new visit from Home." }));
}
function WizardStepper(props) {
  const total = WIZARD_STEPS.length;
  const current = WIZARD_STEPS[props.step - 1];
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-2 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-semibold uppercase tracking-widest text-gray-400" }, "Step ", props.step, " of ", total), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-semibold uppercase tracking-widest", style: { color: GOLD_DEEP } }, current ? current.label : "")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1" }, WIZARD_STEPS.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.n, className: "h-1 flex-1 rounded-full", style: { backgroundColor: s.n <= props.step ? GOLD : "#E8E6E0" } }))));
}
function Step2StoreInfo(props) {
  const v = props.value;
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-100 bg-[#FAFAF8] px-3 py-2.5 text-sm text-gray-600" }, /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-gray-800" }, props.branchName), " \xB7 ", props.visitType), /* @__PURE__ */ React.createElement(Field, { label: "Branch Manager" }, /* @__PURE__ */ React.createElement("input", { className: inputCls, value: v.branchManager, onChange: (e) => props.onChange({ branchManager: e.target.value }), placeholder: "e.g. Karim Fathy" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3" }, /* @__PURE__ */ React.createElement(Field, { label: "Store Size (SQM)" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", className: inputCls, value: v.storeSizeSqm, onChange: (e) => props.onChange({ storeSizeSqm: e.target.value }), placeholder: "0" })), /* @__PURE__ */ React.createElement(Field, { label: "Employees Scheduled" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", className: inputCls, value: v.employeesScheduled, onChange: (e) => props.onChange({ employeesScheduled: e.target.value }), placeholder: "0" })), /* @__PURE__ */ React.createElement(Field, { label: "Employees Present" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", className: inputCls, value: v.employeesPresent, onChange: (e) => props.onChange({ employeesPresent: e.target.value }), placeholder: "0" }))));
}
function Step3Audit(props) {
  const audit = props.value;
  const score = computeComplianceScore(audit);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center rounded-sm border border-gray-100 bg-[#FAFAF8] py-5" }, /* @__PURE__ */ React.createElement(ScoreRing, { value: score, label: "VM Compliance", size: 92 })), AUDIT_SECTIONS.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.key, className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "mb-1 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold text-gray-900" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Avg ", sectionAverage(audit, s.key).toFixed(1))), /* @__PURE__ */ React.createElement("div", { className: "divide-y divide-gray-100" }, s.items.map((i) => /* @__PURE__ */ React.createElement(RatingPicker, { key: i.key, label: i.label, value: audit[s.key][i.key], onChange: (n) => props.onChange(s.key, i.key, n) }))))), !allRatingsFilled(audit) ? /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs text-gray-400" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "h-3.5 w-3.5" }), " Rate every item to continue") : null);
}
function Step4Tasks(props) {
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500" }, "Tasks Completed"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3" }, TASK_OPTIONS.map((t) => /* @__PURE__ */ React.createElement(Chip, { key: t, active: props.tasksCompleted.includes(t), onClick: () => props.onToggleTask(t) }, t)))), /* @__PURE__ */ React.createElement(Field, { label: "Work Description" }, /* @__PURE__ */ React.createElement("textarea", { rows: 3, className: inputCls, value: props.workDescription, onChange: (e) => props.onWorkDescription(e.target.value), placeholder: "Describe the work carried out during this visit..." })), /* @__PURE__ */ React.createElement(Field, { label: "Time Spent (minutes)" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", className: inputCls + " max-w-[160px]", value: props.timeSpentMinutes, onChange: (e) => props.onTimeSpent(e.target.value), placeholder: "0" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2" }, /* @__PURE__ */ React.createElement(Field, { label: "Before Photos" }, /* @__PURE__ */ React.createElement(PhotoUploader, { photos: props.beforePhotos, onChange: props.onBeforePhotos })), /* @__PURE__ */ React.createElement(Field, { label: "After Photos" }, /* @__PURE__ */ React.createElement(PhotoUploader, { photos: props.afterPhotos, onChange: props.onAfterPhotos }))));
}
function Step5Team(props) {
  const v = props.value;
  const [nameInput, setNameInput] = useState("");
  function addName() {
    const n = nameInput.trim();
    if (!n) return;
    props.onChange({ employeeNames: (v.employeeNames || []).concat([n]) });
    setNameInput("");
  }
  function removeName(idx) {
    props.onChange({ employeeNames: (v.employeeNames || []).filter((_, i) => i !== idx) });
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement(Field, { label: "Number of Employees Assisted" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "0",
      className: inputCls + " max-w-[160px]",
      value: v.employeesAssistedCount,
      onChange: (e) => props.onChange({ employeesAssistedCount: e.target.value })
    }
  )), /* @__PURE__ */ React.createElement(Field, { label: "Employee Names" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: inputCls,
      value: nameInput,
      onChange: (e) => setNameInput(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addName();
        }
      },
      placeholder: "Type a name and press Add"
    }
  ), /* @__PURE__ */ React.createElement(SecondaryButton, { onClick: addName, className: "px-3" }, /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }))), (v.employeeNames || []).length ? /* @__PURE__ */ React.createElement("div", { className: "mt-2 flex flex-wrap gap-1.5" }, v.employeeNames.map((n, idx) => /* @__PURE__ */ React.createElement("span", { key: idx, className: "inline-flex items-center gap-1.5 rounded-sm bg-[#F1F1EF] px-2.5 py-1 text-xs font-medium text-gray-700" }, n, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => removeName(idx), className: "text-gray-400 hover:text-gray-700" }, /* @__PURE__ */ React.createElement(X, { className: "h-3 w-3" }))))) : null), /* @__PURE__ */ React.createElement(Field, { label: "Team Cooperation Score" }, /* @__PURE__ */ React.createElement(RatingPicker, { label: "", value: v.teamCooperationScore, onChange: (n) => props.onChange({ teamCooperationScore: n }) })));
}
function Step6Issues(props) {
  const blank = { type: ISSUE_TYPES[0], priority: "Medium", description: "", immediateAction: "", recommendedSolution: "" };
  const [form, setForm] = useState(blank);
  function add() {
    if (!form.description.trim()) return;
    props.onAdd(form);
    setForm(blank);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "mb-3 text-sm font-bold text-gray-900" }, "Report an Issue"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2" }, /* @__PURE__ */ React.createElement(Field, { label: "Issue Type" }, /* @__PURE__ */ React.createElement("select", { className: inputCls, value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }) }, ISSUE_TYPES.map((t) => /* @__PURE__ */ React.createElement("option", { key: t, value: t }, t)))), /* @__PURE__ */ React.createElement(Field, { label: "Priority" }, /* @__PURE__ */ React.createElement("select", { className: inputCls, value: form.priority, onChange: (e) => setForm({ ...form, priority: e.target.value }) }, PRIORITIES.map((p) => /* @__PURE__ */ React.createElement("option", { key: p, value: p }, p))))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 space-y-4" }, /* @__PURE__ */ React.createElement(Field, { label: "Issue Description" }, /* @__PURE__ */ React.createElement("textarea", { rows: 2, className: inputCls, value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), placeholder: "What did you observe?" })), /* @__PURE__ */ React.createElement(Field, { label: "Immediate Action Taken" }, /* @__PURE__ */ React.createElement("textarea", { rows: 2, className: inputCls, value: form.immediateAction, onChange: (e) => setForm({ ...form, immediateAction: e.target.value }), placeholder: "What was done on the spot?" })), /* @__PURE__ */ React.createElement(Field, { label: "Recommended Solution" }, /* @__PURE__ */ React.createElement("textarea", { rows: 2, className: inputCls, value: form.recommendedSolution, onChange: (e) => setForm({ ...form, recommendedSolution: e.target.value }), placeholder: "What should happen next?" }))), /* @__PURE__ */ React.createElement(SecondaryButton, { onClick: add, className: "mt-4" }, /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }), " Add Issue")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500" }, "Issues Logged This Visit (", props.issues.length, ")"), props.issues.length ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, props.issues.map((iss) => /* @__PURE__ */ React.createElement("div", { key: iss.id, className: "flex items-start justify-between gap-3 rounded-sm border border-gray-100 p-3" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-gray-800" }, iss.type), /* @__PURE__ */ React.createElement(PriorityBadge, { priority: iss.priority })), /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, iss.description)), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => props.onRemove(iss.id), className: "flex-shrink-0 text-gray-300 hover:text-red-500" }, /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" }))))) : /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-400" }, "No issues logged. Skip this step if everything looked good.")));
}
function Step7Action(props) {
  const blank = { taskDescription: "", responsiblePerson: "", deadline: "", status: "Open" };
  const [form, setForm] = useState(blank);
  function add() {
    if (!form.taskDescription.trim()) return;
    props.onAdd(form);
    setForm(blank);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "mb-3 text-sm font-bold text-gray-900" }, "Add Action Item"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(Field, { label: "Task Description" }, /* @__PURE__ */ React.createElement("textarea", { rows: 2, className: inputCls, value: form.taskDescription, onChange: (e) => setForm({ ...form, taskDescription: e.target.value }), placeholder: "What needs to happen?" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3" }, /* @__PURE__ */ React.createElement(Field, { label: "Responsible Person" }, /* @__PURE__ */ React.createElement("input", { className: inputCls, value: form.responsiblePerson, onChange: (e) => setForm({ ...form, responsiblePerson: e.target.value }), placeholder: "Name" })), /* @__PURE__ */ React.createElement(Field, { label: "Deadline" }, /* @__PURE__ */ React.createElement("input", { type: "date", className: inputCls, value: form.deadline, onChange: (e) => setForm({ ...form, deadline: e.target.value }) })), /* @__PURE__ */ React.createElement(Field, { label: "Status" }, /* @__PURE__ */ React.createElement("select", { className: inputCls, value: form.status, onChange: (e) => setForm({ ...form, status: e.target.value }) }, ACTION_STATUSES.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s)))))), /* @__PURE__ */ React.createElement(SecondaryButton, { onClick: add, className: "mt-4" }, /* @__PURE__ */ React.createElement(Plus, { className: "h-4 w-4" }), " Add to Action Plan")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500" }, "Action Items (", props.actionPlans.length, ")"), props.actionPlans.length ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, props.actionPlans.map((ap) => /* @__PURE__ */ React.createElement("div", { key: ap.id, className: "flex items-start justify-between gap-3 rounded-sm border border-gray-100 p-3" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-medium text-gray-800" }, ap.taskDescription), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-xs text-gray-400" }, ap.responsiblePerson || "\u2014", " \xB7 Due ", ap.deadline ? formatDateHuman(ap.deadline) : "\u2014", " \xB7 ", ap.status)), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => props.onRemove(ap.id), className: "flex-shrink-0 text-gray-300 hover:text-red-500" }, /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" }))))) : /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-400" }, "No action items yet. Add one if follow-up is needed.")));
}
function Step8Checkout(props) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 15e3);
    return () => clearInterval(t);
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-100 bg-[#FAFAF8] p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Departure Time"), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-lg font-bold text-gray-900" }, formatTimeHuman((/* @__PURE__ */ new Date()).toISOString()))), /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-100 bg-[#FAFAF8] p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Duration So Far"), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-lg font-bold text-gray-900" }, elapsedLabel(props.checkInTime)))), /* @__PURE__ */ React.createElement(Field, { label: "Visit Summary", required: true }, /* @__PURE__ */ React.createElement("textarea", { rows: 3, className: inputCls, value: props.visitSummary, onChange: (e) => props.onVisitSummary(e.target.value), placeholder: "Summarize the outcome of this visit..." })), /* @__PURE__ */ React.createElement(Field, { label: "Additional Notes" }, /* @__PURE__ */ React.createElement("textarea", { rows: 2, className: inputCls, value: props.additionalNotes, onChange: (e) => props.onAdditionalNotes(e.target.value), placeholder: "Anything else worth noting (optional)" })));
}
function CheckInWizard(props) {
  const { employee, existingVisit, onCreateVisit, onUpdateVisit, onExit } = props;
  const [draft, setDraft] = useState(existingVisit || null);
  const [step, setStep] = useState(existingVisit ? existingVisit.currentStep || 1 : 1);
  const [finished, setFinished] = useState(false);
  const [preCheckIn, setPreCheckIn] = useState({ branchId: "", visitType: VISIT_TYPES[0], gps: null, entrancePhoto: null });
  const [gpsState, setGpsState] = useState({ status: "idle", message: "" });
  function patchDraft(patch) {
    setDraft((d) => ({ ...d, ...patch }));
  }
  function commitAndGo(nextStep) {
    setDraft((d) => {
      const merged = { ...d, currentStep: nextStep };
      onUpdateVisit(merged);
      return merged;
    });
    setStep(nextStep);
  }
  function goNext() {
    commitAndGo(Math.min(8, step + 1));
  }
  function goBack() {
    commitAndGo(Math.max(1, step - 1));
  }
  function handleExit() {
    if (draft) onUpdateVisit({ ...draft, currentStep: step });
    onExit();
  }
  async function handleCaptureGps() {
    setGpsState({ status: "loading", message: "" });
    const res = await captureGeolocation();
    if (res.ok) {
      const gps = { lat: res.lat, lng: res.lng };
      if (draft) patchDraft({ gps });
      else setPreCheckIn((p) => ({ ...p, gps }));
      setGpsState({ status: "success", message: "" });
    } else {
      setGpsState({ status: "error", message: res.error });
    }
  }
  function handleCheckIn() {
    const branch = BRANCHES.find((b) => b.id === preCheckIn.branchId);
    if (!branch) return;
    const newVisit = buildNewVisit({
      employee,
      branch,
      visitType: preCheckIn.visitType,
      gps: preCheckIn.gps,
      entrancePhoto: preCheckIn.entrancePhoto
    });
    const withStep = { ...newVisit, currentStep: 2 };
    onCreateVisit(withStep);
    setDraft(withStep);
    setStep(2);
  }
  function handleCheckOut() {
    const checkOutTime = (/* @__PURE__ */ new Date()).toISOString();
    const durationMinutes = minutesBetween(draft.checkInTime, checkOutTime);
    const withDuration = { ...draft, checkOutTime, durationMinutes };
    const productivityScore = computeProductivityScore(withDuration);
    const final = { ...withDuration, productivityScore, status: "completed", currentStep: 8 };
    onUpdateVisit(final);
    setDraft(final);
    setFinished(true);
  }
  function setAuditRating(sectionKey, itemKey, n) {
    setDraft((d) => {
      const nextAudit = { ...d.audit, [sectionKey]: { ...d.audit[sectionKey], [itemKey]: n } };
      return { ...d, audit: nextAudit, complianceScore: computeComplianceScore(nextAudit) };
    });
  }
  function toggleTask(task) {
    setDraft((d) => {
      const list = d.tasksCompleted || [];
      const next = list.includes(task) ? list.filter((t) => t !== task) : list.concat([task]);
      return { ...d, tasksCompleted: next };
    });
  }
  function addIssue(issue) {
    patchDraft({ issues: (draft.issues || []).concat([{ ...issue, id: uid("iss"), status: "open" }]) });
  }
  function removeIssue(id) {
    patchDraft({ issues: (draft.issues || []).filter((i) => i.id !== id) });
  }
  function addAction(item) {
    patchDraft({ actionPlans: (draft.actionPlans || []).concat([{ ...item, id: uid("act") }]) });
  }
  function removeAction(id) {
    patchDraft({ actionPlans: (draft.actionPlans || []).filter((a) => a.id !== id) });
  }
  const headerTitle = draft ? draft.branchName : "New Branch Visit";
  const canGoBack = step > 1 && !finished;
  const canProceedStep3 = draft ? allRatingsFilled(draft.audit) : false;
  const canCheckOut = !!(draft && draft.visitSummary && draft.visitSummary.trim().length > 0);
  if (finished) {
    return /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-lg px-4 py-10 sm:px-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center text-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex h-12 w-12 items-center justify-center rounded-full", style: { backgroundColor: GOLD_SOFT } }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-6 w-6", style: { color: GOLD_DEEP } })), /* @__PURE__ */ React.createElement("h2", { className: "mt-4 text-xl font-bold text-gray-900" }, "Visit Complete"), /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, draft.branchName, " \xB7 ", durationLabel(draft.durationMinutes)), /* @__PURE__ */ React.createElement("div", { className: "mt-6 flex items-center justify-center gap-8" }, /* @__PURE__ */ React.createElement(ScoreRing, { value: draft.complianceScore || 0, label: "VM Compliance", size: 96 }), /* @__PURE__ */ React.createElement(ScoreRing, { value: draft.productivityScore || 0, label: "Productivity", size: 96 })), /* @__PURE__ */ React.createElement(PrimaryButton, { onClick: onExit, className: "mt-8" }, "Done ", /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4" }))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-2xl px-4 pb-10 sm:px-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 py-4" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: handleExit, className: "flex h-8 w-8 items-center justify-center rounded-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700" }, /* @__PURE__ */ React.createElement(ArrowLeft, { className: "h-4.5 w-4.5" })), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "truncate text-base font-bold text-gray-900" }, headerTitle))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(WizardStepper, { step })), step === 1 && !draft ? /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement(Field, { label: "Employee Name" }, /* @__PURE__ */ React.createElement("input", { className: inputCls, value: employee.name, disabled: true })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2" }, /* @__PURE__ */ React.createElement(Field, { label: "Date" }, /* @__PURE__ */ React.createElement("input", { className: inputCls, value: formatDateHuman((/* @__PURE__ */ new Date()).toISOString()), disabled: true })), /* @__PURE__ */ React.createElement(Field, { label: "Time" }, /* @__PURE__ */ React.createElement("input", { className: inputCls, value: formatTimeHuman((/* @__PURE__ */ new Date()).toISOString()), disabled: true }))), /* @__PURE__ */ React.createElement(Field, { label: "Branch Name", required: true }, /* @__PURE__ */ React.createElement("select", { className: inputCls, value: preCheckIn.branchId, onChange: (e) => setPreCheckIn({ ...preCheckIn, branchId: e.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select a branch\u2026"), BRANCHES.map((b) => /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.id }, b.name)))), /* @__PURE__ */ React.createElement(Field, { label: "Visit Type", required: true }, /* @__PURE__ */ React.createElement("select", { className: inputCls, value: preCheckIn.visitType, onChange: (e) => setPreCheckIn({ ...preCheckIn, visitType: e.target.value }) }, VISIT_TYPES.map((t) => /* @__PURE__ */ React.createElement("option", { key: t, value: t }, t)))), /* @__PURE__ */ React.createElement(Field, { label: "GPS Location" }, /* @__PURE__ */ React.createElement(SecondaryButton, { onClick: handleCaptureGps, disabled: gpsState.status === "loading" }, gpsState.status === "loading" ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ React.createElement(MapPin, { className: "h-4 w-4" }), preCheckIn.gps ? "Location Captured" : "Capture Location"), preCheckIn.gps ? /* @__PURE__ */ React.createElement("div", { className: "mt-1.5 text-xs text-gray-400" }, preCheckIn.gps.lat.toFixed(5), ", ", preCheckIn.gps.lng.toFixed(5)) : null, gpsState.status === "error" ? /* @__PURE__ */ React.createElement("div", { className: "mt-1.5 text-xs text-red-500" }, gpsState.message) : null), /* @__PURE__ */ React.createElement(Field, { label: "Photo at Branch Entrance" }, /* @__PURE__ */ React.createElement(PhotoUploader, { photos: preCheckIn.entrancePhoto ? [preCheckIn.entrancePhoto] : [], multiple: false, onChange: (photos) => setPreCheckIn({ ...preCheckIn, entrancePhoto: photos[0] || null }) })), /* @__PURE__ */ React.createElement(PrimaryButton, { onClick: handleCheckIn, disabled: !preCheckIn.branchId, className: "mt-2 w-full" }, "Check In ", /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4" }))) : null, step === 1 && draft ? /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-100 bg-[#FAFAF8] p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold text-gray-800" }, /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-4 w-4", style: { color: GOLD_DEEP } }), " Checked in"), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-sm text-gray-500" }, draft.branchName, " \xB7 ", draft.visitType, " \xB7 ", formatTimeHuman(draft.checkInTime))), /* @__PURE__ */ React.createElement(PrimaryButton, { onClick: goNext, className: "w-full" }, "Continue ", /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4" }))) : null, step === 2 && draft ? /* @__PURE__ */ React.createElement(Step2StoreInfo, { value: draft.storeInfo, branchName: draft.branchName, visitType: draft.visitType, onChange: (patch) => setDraft((d) => ({ ...d, storeInfo: { ...d.storeInfo, ...patch } })) }) : null, step === 3 && draft ? /* @__PURE__ */ React.createElement(Step3Audit, { value: draft.audit, onChange: setAuditRating }) : null, step === 4 && draft ? /* @__PURE__ */ React.createElement(
    Step4Tasks,
    {
      tasksCompleted: draft.tasksCompleted,
      onToggleTask: toggleTask,
      workDescription: draft.workDescription,
      onWorkDescription: (v) => patchDraft({ workDescription: v }),
      timeSpentMinutes: draft.timeSpentMinutes,
      onTimeSpent: (v) => patchDraft({ timeSpentMinutes: v }),
      beforePhotos: draft.beforePhotos,
      onBeforePhotos: (v) => patchDraft({ beforePhotos: v }),
      afterPhotos: draft.afterPhotos,
      onAfterPhotos: (v) => patchDraft({ afterPhotos: v })
    }
  ) : null, step === 5 && draft ? /* @__PURE__ */ React.createElement(Step5Team, { value: draft.teamSupport, onChange: (patch) => setDraft((d) => ({ ...d, teamSupport: { ...d.teamSupport, ...patch } })) }) : null, step === 6 && draft ? /* @__PURE__ */ React.createElement(Step6Issues, { issues: draft.issues, onAdd: addIssue, onRemove: removeIssue }) : null, step === 7 && draft ? /* @__PURE__ */ React.createElement(Step7Action, { actionPlans: draft.actionPlans, onAdd: addAction, onRemove: removeAction }) : null, step === 8 && draft ? /* @__PURE__ */ React.createElement(
    Step8Checkout,
    {
      checkInTime: draft.checkInTime,
      visitSummary: draft.visitSummary,
      onVisitSummary: (v) => patchDraft({ visitSummary: v }),
      additionalNotes: draft.additionalNotes,
      onAdditionalNotes: (v) => patchDraft({ additionalNotes: v })
    }
  ) : null, draft && step > 1 ? /* @__PURE__ */ React.createElement("div", { className: "mt-7 flex items-center justify-between gap-3 border-t border-gray-100 pt-5" }, canGoBack ? /* @__PURE__ */ React.createElement(SecondaryButton, { onClick: goBack }, /* @__PURE__ */ React.createElement(ChevronLeft, { className: "h-4 w-4" }), " Back") : /* @__PURE__ */ React.createElement("span", null), step < 8 ? /* @__PURE__ */ React.createElement(PrimaryButton, { onClick: goNext, disabled: step === 3 && !canProceedStep3 }, "Continue ", /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4" })) : /* @__PURE__ */ React.createElement(PrimaryButton, { onClick: handleCheckOut, disabled: !canCheckOut }, "Check Out ", /* @__PURE__ */ React.createElement(CheckCircle2, { className: "h-4 w-4" }))) : null);
}
function groupBy(arr, keyFn) {
  const map = {};
  arr.forEach((item) => {
    const k = keyFn(item);
    if (!map[k]) map[k] = [];
    map[k].push(item);
  });
  return map;
}
function ActivityRow(props) {
  const v = props.visit;
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: props.onClick,
      className: "flex w-full items-center justify-between gap-3 rounded-sm border border-gray-100 bg-white px-4 py-3 text-left transition-colors hover:border-gray-300"
    },
    /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "truncate text-sm font-semibold text-gray-900" }, v.employeeName), /* @__PURE__ */ React.createElement(StatusBadge, { status: v.status })), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 truncate text-xs text-gray-400" }, v.branchName, " \xB7 ", v.visitType, " \xB7 ", formatTimeHuman(v.checkInTime))),
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-shrink-0 items-center gap-3" }, v.status === "completed" ? /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold tabular-nums", style: { color: scoreColor(v.complianceScore || 0) } }, v.complianceScore, "%"), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] uppercase tracking-wide text-gray-400" }, "Compliance")) : null, /* @__PURE__ */ React.createElement(ChevronRight, { className: "h-4 w-4 text-gray-300" }))
  );
}
const CHART_AXIS_PROPS = { tick: { fontSize: 11, fill: "#9C9C94" }, axisLine: false, tickLine: false };
function ManagerHome(props) {
  const { visits, onView } = props;
  const today = todayStr();
  const todayVisits = useMemo(() => visits.filter((v) => v.date === today), [visits, today]);
  const activeVisits = useMemo(() => visits.filter((v) => v.status === "active"), [visits]);
  const completedAll = useMemo(() => visits.filter((v) => v.status === "completed"), [visits]);
  const completedToday = todayVisits.filter((v) => v.status === "completed");
  const pendingToday = todayVisits.filter((v) => v.status === "active");
  const allIssues = useMemo(() => visits.reduce((acc, v) => acc.concat(v.issues || []), []), [visits]);
  const openIssues = allIssues.filter((i) => i.status === "open").length;
  const closedIssues = allIssues.filter((i) => i.status === "resolved").length;
  const branchScore = completedAll.length ? Math.round(avg(completedAll.map((v) => v.complianceScore))) : 0;
  const activeEmployeeCount = new Set(activeVisits.map((v) => v.employeeId)).size;
  const trendData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const dayVisits = completedAll.filter((v) => v.date === iso);
      days.push({
        date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        score: dayVisits.length ? Math.round(avg(dayVisits.map((v) => v.complianceScore))) : null
      });
    }
    return days;
  }, [completedAll]);
  const recent = useMemo(
    () => visits.slice().sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime)).slice(0, 8),
    [visits]
  );
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-xs font-semibold uppercase tracking-widest text-gray-400" }, (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })), /* @__PURE__ */ React.createElement("h1", { className: "mt-1 text-2xl font-bold text-gray-900" }, "Dashboard")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4" }, /* @__PURE__ */ React.createElement(KPICard, { label: "Today's Visits", value: todayVisits.length, icon: Calendar }), /* @__PURE__ */ React.createElement(KPICard, { label: "Active Employees", value: activeEmployeeCount, icon: UserCheck }), /* @__PURE__ */ React.createElement(KPICard, { label: "Completed Today", value: completedToday.length, icon: CheckCircle2 }), /* @__PURE__ */ React.createElement(KPICard, { label: "Pending Today", value: pendingToday.length, icon: Clock }), /* @__PURE__ */ React.createElement(KPICard, { label: "Open Issues", value: openIssues, icon: AlertTriangle, accentColor: openIssues ? "#C2730B" : GOLD }), /* @__PURE__ */ React.createElement(KPICard, { label: "Closed Issues", value: closedIssues, icon: CheckCircle, accentColor: "#1F7A4D" }), /* @__PURE__ */ React.createElement(KPICard, { label: "Branch Performance", value: branchScore + "%", icon: ShieldCheck, accentColor: scoreColor(branchScore) }), /* @__PURE__ */ React.createElement(KPICard, { label: "Total Branches", value: BRANCHES.length, icon: Building2 })), /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Compliance Trend", subtitle: "7-day average VM compliance across all branches" }), /* @__PURE__ */ React.createElement("div", { style: { height: 220 } }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(LineChart, { data: trendData }, /* @__PURE__ */ React.createElement(CartesianGrid, { stroke: "#F1F1EF", vertical: false }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "date", ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(YAxis, { domain: [0, 100], width: 30, ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(Tooltip, null), /* @__PURE__ */ React.createElement(Line, { type: "monotone", dataKey: "score", stroke: GOLD_DEEP, strokeWidth: 2, dot: { r: 3 }, connectNulls: true }))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Recent Activity" }), recent.length ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, recent.map((v) => /* @__PURE__ */ React.createElement(ActivityRow, { key: v.id, visit: v, onClick: () => onView(v) }))) : /* @__PURE__ */ React.createElement(EmptyState, { icon: Activity, title: "No activity yet", message: "Visits will appear here as your team checks in across branches." })));
}
function TeamPerformance(props) {
  const { visits, onViewEmployee } = props;
  const completed = useMemo(() => visits.filter((v) => v.status === "completed"), [visits]);
  const members = ACCOUNTS.filter((a) => a.role === "member");
  const rows = useMemo(() => members.map((m) => {
    const mine = completed.filter((v) => v.employeeId === m.id);
    const allMine = visits.filter((v) => v.employeeId === m.id);
    const hours = mine.reduce((s, v) => s + (v.durationMinutes || 0), 0) / 60;
    const tasks = mine.reduce((s, v) => s + (v.tasksCompleted || []).length, 0);
    return {
      id: m.id,
      name: m.name,
      totalVisits: allMine.length,
      hours,
      tasks,
      avgProductivity: mine.length ? Math.round(avg(mine.map((v) => v.productivityScore))) : 0,
      avgCompliance: mine.length ? Math.round(avg(mine.map((v) => v.complianceScore))) : 0
    };
  }).sort((a, b) => b.avgCompliance - a.avgCompliance), [completed, visits, members]);
  const chartData = rows.map((r) => ({ name: r.name.split(" ")[0], score: r.avgCompliance }));
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Employee Performance", subtitle: members.length + " VM team members" }), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto rounded-sm border border-gray-200" }, /* @__PURE__ */ React.createElement("table", { className: "w-full min-w-[680px] text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "border-b border-gray-200 bg-[#FAFAF8] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400" }, /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Employee"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Visits"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Working Hours"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Tasks Completed"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Avg Compliance"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Avg Productivity"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-100" }, rows.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.id, className: "cursor-pointer hover:bg-[#FAFAF8]", onClick: () => onViewEmployee(r.id) }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 font-medium text-gray-800" }, r.name), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-gray-600" }, r.totalVisits), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-gray-600" }, r.hours.toFixed(1), "h"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-gray-600" }, r.tasks), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 font-semibold", style: { color: scoreColor(r.avgCompliance) } }, r.avgCompliance, "%"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 font-semibold", style: { color: scoreColor(r.avgProductivity) } }, r.avgProductivity, "%")))))), /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Compliance Ranking" }), /* @__PURE__ */ React.createElement("div", { style: { height: 260 } }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { data: chartData }, /* @__PURE__ */ React.createElement(CartesianGrid, { stroke: "#F1F1EF", vertical: false }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "name", ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(YAxis, { domain: [0, 100], width: 30, ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(Tooltip, null), /* @__PURE__ */ React.createElement(Bar, { dataKey: "score", radius: [3, 3, 0, 0], fill: GOLD }))))));
}
function BranchPerformance(props) {
  const { visits, onViewBranch } = props;
  const completed = useMemo(() => visits.filter((v) => v.status === "completed"), [visits]);
  const rows = useMemo(() => BRANCHES.map((b) => {
    const mine = completed.filter((v) => v.branchId === b.id);
    return {
      id: b.id,
      name: b.name,
      visits: mine.length,
      avgCompliance: mine.length ? Math.round(avg(mine.map((v) => v.complianceScore))) : 0,
      avgCleanliness: mine.length ? avg(mine.map((v) => v.audit.windowDisplay ? v.audit.windowDisplay.cleanliness : 0)) : 0,
      avgStoreStandards: mine.length ? avg(mine.map((v) => sectionAverage(v.audit, "storeStandards"))) : 0,
      avgTeamCoop: mine.length ? avg(mine.map((v) => v.teamSupport ? v.teamSupport.teamCooperationScore : 0)) : 0
    };
  }).sort((a, b) => b.avgCompliance - a.avgCompliance), [completed]);
  const chartData = rows.map((r) => ({ name: r.name.replace("COUP - ", ""), score: r.avgCompliance }));
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Branch Performance", subtitle: BRANCHES.length + " branches tracked" }), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto rounded-sm border border-gray-200" }, /* @__PURE__ */ React.createElement("table", { className: "w-full min-w-[720px] text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "border-b border-gray-200 bg-[#FAFAF8] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400" }, /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Branch"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Visits"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "VM Compliance"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Cleanliness"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Store Standards"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Team Cooperation"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-100" }, rows.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.id, className: "cursor-pointer hover:bg-[#FAFAF8]", onClick: () => onViewBranch(r.id) }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 font-medium text-gray-800" }, r.name), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-gray-600" }, r.visits), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 font-semibold", style: { color: scoreColor(r.avgCompliance) } }, r.avgCompliance, "%"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement(StarsReadout, { value: Math.round(r.avgCleanliness) })), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement(StarsReadout, { value: Math.round(r.avgStoreStandards) })), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement(StarsReadout, { value: Math.round(r.avgTeamCoop) }))))))), /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Branch Ranking" }), /* @__PURE__ */ React.createElement("div", { style: { height: 280 } }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { data: chartData, layout: "vertical", margin: { left: 16 } }, /* @__PURE__ */ React.createElement(CartesianGrid, { stroke: "#F1F1EF", horizontal: false }), /* @__PURE__ */ React.createElement(XAxis, { type: "number", domain: [0, 100], ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(YAxis, { type: "category", dataKey: "name", width: 150, ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(Tooltip, null), /* @__PURE__ */ React.createElement(Bar, { dataKey: "score", radius: [0, 3, 3, 0], fill: GOLD }))))));
}
function AuditHistory(props) {
  const { visits, onView, seed } = props;
  const [employeeFilter, setEmployeeFilter] = useState(seed && seed.employeeId || "");
  const [branchFilter, setBranchFilter] = useState(seed && seed.branchId || "");
  const [statusFilter, setStatusFilter] = useState("all");
  const seedNonce = seed ? seed.nonce : 0;
  useEffect(() => {
    if (seed) {
      setEmployeeFilter(seed.employeeId || "");
      setBranchFilter(seed.branchId || "");
    }
  }, [seedNonce]);
  const filtered = useMemo(() => {
    return visits.filter(
      (v) => (!employeeFilter || v.employeeId === employeeFilter) && (!branchFilter || v.branchId === branchFilter) && (statusFilter === "all" || v.status === statusFilter)
    ).sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
  }, [visits, employeeFilter, branchFilter, statusFilter]);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Audit History", subtitle: filtered.length + " visit" + (filtered.length === 1 ? "" : "s") }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement("select", { className: inputCls + " max-w-[200px]", value: employeeFilter, onChange: (e) => setEmployeeFilter(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "All Employees"), ACCOUNTS.filter((a) => a.role === "member").map((a) => /* @__PURE__ */ React.createElement("option", { key: a.id, value: a.id }, a.name))), /* @__PURE__ */ React.createElement("select", { className: inputCls + " max-w-[220px]", value: branchFilter, onChange: (e) => setBranchFilter(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "All Branches"), BRANCHES.map((b) => /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.id }, b.name))), /* @__PURE__ */ React.createElement("select", { className: inputCls + " max-w-[160px]", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Status"), /* @__PURE__ */ React.createElement("option", { value: "active" }, "In Progress"), /* @__PURE__ */ React.createElement("option", { value: "completed" }, "Completed"))), filtered.length ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, filtered.map((v) => /* @__PURE__ */ React.createElement(ActivityRow, { key: v.id, visit: v, onClick: () => onView(v) }))) : /* @__PURE__ */ React.createElement(EmptyState, { icon: ClipboardList, title: "No visits match", message: "Try adjusting the filters above." }));
}
function IssuesPage(props) {
  const { visits, onUpdateIssueStatus } = props;
  const [statusFilter, setStatusFilter] = useState("open");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const allIssues = useMemo(() => {
    const out = [];
    visits.forEach((v) => (v.issues || []).forEach((iss) => out.push({
      ...iss,
      visitId: v.id,
      branchName: v.branchName,
      employeeName: v.employeeName,
      date: v.date
    })));
    return out.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [visits]);
  const filtered = allIssues.filter((i) => (statusFilter === "all" || i.status === statusFilter) && (priorityFilter === "all" || i.priority === priorityFilter));
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Issue Tracking", subtitle: filtered.length + " issue" + (filtered.length === 1 ? "" : "s") }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, [{ key: "open", label: "Open" }, { key: "resolved", label: "Resolved" }, { key: "all", label: "All" }].map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s.key,
      type: "button",
      onClick: () => setStatusFilter(s.key),
      className: "rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors",
      style: statusFilter === s.key ? { backgroundColor: INK, color: GOLD } : { backgroundColor: "#F1F1EF", color: "#6B6B64" }
    },
    s.label
  )), /* @__PURE__ */ React.createElement("select", { className: inputCls + " max-w-[160px]", value: priorityFilter, onChange: (e) => setPriorityFilter(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "all" }, "All Priorities"), PRIORITIES.map((p) => /* @__PURE__ */ React.createElement("option", { key: p, value: p }, p)))), filtered.length ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, filtered.map((iss) => /* @__PURE__ */ React.createElement("div", { key: iss.visitId + iss.id, className: "rounded-sm border border-gray-100 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-gray-900" }, iss.type), /* @__PURE__ */ React.createElement(PriorityBadge, { priority: iss.priority })), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-xs text-gray-400" }, iss.branchName, " \xB7 ", iss.employeeName, " \xB7 ", formatDateHuman(iss.date))), /* @__PURE__ */ React.createElement(StatusBadge, { status: iss.status })), /* @__PURE__ */ React.createElement("p", { className: "mt-2 text-sm text-gray-600" }, iss.description), iss.immediateAction ? /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-gray-600" }, "Immediate action: "), iss.immediateAction) : null, iss.recommendedSolution ? /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium text-gray-600" }, "Recommended: "), iss.recommendedSolution) : null, /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, iss.status === "open" ? /* @__PURE__ */ React.createElement(SecondaryButton, { onClick: () => onUpdateIssueStatus(iss.visitId, iss.id, "resolved") }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "h-4 w-4" }), " Mark Resolved") : /* @__PURE__ */ React.createElement(SecondaryButton, { onClick: () => onUpdateIssueStatus(iss.visitId, iss.id, "open") }, /* @__PURE__ */ React.createElement(RefreshCw, { className: "h-4 w-4" }), " Reopen"))))) : /* @__PURE__ */ React.createElement(EmptyState, { icon: AlertTriangle, title: "No issues found", message: "Issues reported during branch visits will appear here." }));
}
function ActionPlansPage(props) {
  const { visits, onUpdateActionStatus } = props;
  const [statusFilter, setStatusFilter] = useState("all");
  const allActions = useMemo(() => {
    const out = [];
    visits.forEach((v) => (v.actionPlans || []).forEach((ap) => out.push({
      ...ap,
      visitId: v.id,
      branchName: v.branchName,
      employeeName: v.employeeName
    })));
    return out.sort((a, b) => {
      const ad = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const bd = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return ad - bd;
    });
  }, [visits]);
  const filtered = statusFilter === "all" ? allActions : allActions.filter((a) => a.status === statusFilter);
  const todayIso = todayStr();
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Action Plans", subtitle: filtered.length + " item" + (filtered.length === 1 ? "" : "s") }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, ["all"].concat(ACTION_STATUSES).map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s,
      type: "button",
      onClick: () => setStatusFilter(s),
      className: "rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors",
      style: statusFilter === s ? { backgroundColor: INK, color: GOLD } : { backgroundColor: "#F1F1EF", color: "#6B6B64" }
    },
    s === "all" ? "All" : s
  ))), filtered.length ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, filtered.map((ap) => {
    const overdue = ap.deadline && ap.deadline < todayIso && ap.status !== "Completed";
    return /* @__PURE__ */ React.createElement("div", { key: ap.visitId + ap.id, className: "flex flex-wrap items-start justify-between gap-3 rounded-sm border border-gray-100 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-semibold text-gray-800" }, ap.taskDescription), /* @__PURE__ */ React.createElement("div", { className: "mt-0.5 text-xs text-gray-400" }, ap.branchName, " \xB7 ", ap.responsiblePerson || "Unassigned", " \xB7 Due ", ap.deadline ? formatDateHuman(ap.deadline) : "\u2014", overdue ? /* @__PURE__ */ React.createElement("span", { className: "ml-1.5 font-semibold text-red-500" }, "Overdue") : null)), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "flex-shrink-0 rounded-sm border border-gray-300 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700",
        value: ap.status,
        onChange: (e) => onUpdateActionStatus(ap.visitId, ap.id, e.target.value)
      },
      ACTION_STATUSES.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s))
    ));
  })) : /* @__PURE__ */ React.createElement(EmptyState, { icon: CheckCircle2, title: "No action items", message: "Follow-up tasks from branch visits will appear here." }));
}
function AnalyticsPage(props) {
  const { visits } = props;
  const completed = useMemo(() => visits.filter((v) => v.status === "completed"), [visits]);
  const branchRanking = useMemo(() => BRANCHES.map((b) => {
    const mine = completed.filter((v) => v.branchId === b.id);
    return { name: b.name.replace("COUP - ", ""), score: mine.length ? Math.round(avg(mine.map((v) => v.complianceScore))) : 0 };
  }).sort((a, b) => b.score - a.score), [completed]);
  const employeeRanking = useMemo(() => ACCOUNTS.filter((a) => a.role === "member").map((m) => {
    const mine = completed.filter((v) => v.employeeId === m.id);
    return { name: m.name.split(" ")[0], score: mine.length ? Math.round(avg(mine.map((v) => v.productivityScore))) : 0 };
  }).sort((a, b) => b.score - a.score), [completed]);
  const monthlyData = useMemo(() => {
    const groups = groupBy(completed, (v) => v.date.slice(0, 7));
    const keys = Object.keys(groups).sort();
    return keys.map((k) => {
      const vs = groups[k];
      const d = /* @__PURE__ */ new Date(k + "-01");
      return {
        month: d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
        compliance: Math.round(avg(vs.map((v) => v.complianceScore))),
        productivity: Math.round(avg(vs.map((v) => v.productivityScore)))
      };
    });
  }, [completed]);
  const issueTrend = useMemo(() => {
    const all = [];
    visits.forEach((v) => (v.issues || []).forEach((iss) => all.push({ ...iss, date: v.date })));
    const groups = groupBy(all, (i) => i.date.slice(0, 7));
    const keys = Object.keys(groups).sort();
    return keys.map((k) => {
      const items = groups[k];
      const d = /* @__PURE__ */ new Date(k + "-01");
      return {
        month: d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
        open: items.filter((i) => i.status === "open").length,
        resolved: items.filter((i) => i.status === "resolved").length
      };
    });
  }, [visits]);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Analytics", subtitle: "Trends across branches, employees, and time" }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Branch Rankings", subtitle: "Avg VM compliance" }), /* @__PURE__ */ React.createElement("div", { style: { height: 240 } }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { data: branchRanking }, /* @__PURE__ */ React.createElement(CartesianGrid, { stroke: "#F1F1EF", vertical: false }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "name", ...CHART_AXIS_PROPS, interval: 0, angle: -25, textAnchor: "end", height: 50 }), /* @__PURE__ */ React.createElement(YAxis, { domain: [0, 100], width: 30, ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(Tooltip, null), /* @__PURE__ */ React.createElement(Bar, { dataKey: "score", radius: [3, 3, 0, 0], fill: GOLD }))))), /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Employee Rankings", subtitle: "Avg productivity score" }), /* @__PURE__ */ React.createElement("div", { style: { height: 240 } }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { data: employeeRanking }, /* @__PURE__ */ React.createElement(CartesianGrid, { stroke: "#F1F1EF", vertical: false }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "name", ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(YAxis, { domain: [0, 100], width: 30, ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(Tooltip, null), /* @__PURE__ */ React.createElement(Bar, { dataKey: "score", radius: [3, 3, 0, 0], fill: GOLD_DEEP })))))), /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Monthly Performance", subtitle: "Compliance vs productivity over time" }), /* @__PURE__ */ React.createElement("div", { style: { height: 240 } }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(LineChart, { data: monthlyData }, /* @__PURE__ */ React.createElement(CartesianGrid, { stroke: "#F1F1EF", vertical: false }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "month", ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(YAxis, { domain: [0, 100], width: 30, ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(Tooltip, null), /* @__PURE__ */ React.createElement(Legend, { wrapperStyle: { fontSize: 11 } }), /* @__PURE__ */ React.createElement(Line, { type: "monotone", dataKey: "compliance", name: "Compliance", stroke: GOLD_DEEP, strokeWidth: 2, dot: { r: 3 } }), /* @__PURE__ */ React.createElement(Line, { type: "monotone", dataKey: "productivity", name: "Productivity", stroke: "#121212", strokeWidth: 2, dot: { r: 3 } }))))), /* @__PURE__ */ React.createElement("div", { className: "rounded-sm border border-gray-200 p-4" }, /* @__PURE__ */ React.createElement(SectionHeader, { title: "Issue Trends", subtitle: "Open vs resolved issues by month" }), /* @__PURE__ */ React.createElement("div", { style: { height: 240 } }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { data: issueTrend }, /* @__PURE__ */ React.createElement(CartesianGrid, { stroke: "#F1F1EF", vertical: false }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "month", ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(YAxis, { width: 30, ...CHART_AXIS_PROPS }), /* @__PURE__ */ React.createElement(Tooltip, null), /* @__PURE__ */ React.createElement(Legend, { wrapperStyle: { fontSize: 11 } }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "resolved", name: "Resolved", stackId: "a", fill: "#1F7A4D" }), /* @__PURE__ */ React.createElement(Bar, { dataKey: "open", name: "Open", stackId: "a", fill: "#DC2626", radius: [3, 3, 0, 0] }))))));
}
function periodRange(period, refDate) {
  const d = new Date(refDate);
  if (period === "daily") {
    return { start: refDate, end: refDate, label: formatDateHuman(refDate) };
  }
  if (period === "weekly") {
    const day = d.getDay();
    const start2 = new Date(d);
    start2.setDate(d.getDate() - day);
    const end2 = new Date(start2);
    end2.setDate(start2.getDate() + 6);
    return { start: start2.toISOString().slice(0, 10), end: end2.toISOString().slice(0, 10), label: formatDateHuman(start2.toISOString()) + " \u2013 " + formatDateHuman(end2.toISOString()) };
  }
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10), label: start.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) };
}
function ReportsPage(props) {
  const { visits } = props;
  const [period, setPeriod] = useState("daily");
  const [refDate, setRefDate] = useState(todayStr());
  const range = periodRange(period, refDate);
  const inRange = useMemo(() => visits.filter((v) => v.date >= range.start && v.date <= range.end), [visits, range.start, range.end]);
  const completed = inRange.filter((v) => v.status === "completed");
  const allIssues = inRange.reduce((acc, v) => acc.concat(v.issues || []), []);
  const summary = {
    totalVisits: inRange.length,
    completedVisits: completed.length,
    avgCompliance: completed.length ? Math.round(avg(completed.map((v) => v.complianceScore))) : 0,
    avgProductivity: completed.length ? Math.round(avg(completed.map((v) => v.productivityScore))) : 0,
    issuesReported: allIssues.length,
    issuesResolved: allIssues.filter((i) => i.status === "resolved").length
  };
  function handleExportExcel() {
    const wb = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.aoa_to_sheet([
      ["COUP VM Excellence Report"],
      ["Period", range.label],
      [],
      ["Metric", "Value"],
      ["Total Visits", summary.totalVisits],
      ["Completed Visits", summary.completedVisits],
      ["Avg VM Compliance %", summary.avgCompliance],
      ["Avg Productivity %", summary.avgProductivity],
      ["Issues Reported", summary.issuesReported],
      ["Issues Resolved", summary.issuesResolved]
    ]);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
    const visitRows = inRange.map((v) => ({
      Date: v.date,
      Employee: v.employeeName,
      Branch: v.branchName,
      "Visit Type": v.visitType,
      Status: v.status,
      "Check In": formatTimeHuman(v.checkInTime),
      "Check Out": v.checkOutTime ? formatTimeHuman(v.checkOutTime) : "",
      "Duration (min)": v.durationMinutes || "",
      "VM Compliance %": v.complianceScore,
      "Productivity %": v.productivityScore != null ? v.productivityScore : "",
      "Tasks Completed": (v.tasksCompleted || []).length,
      Issues: (v.issues || []).length,
      "Action Items": (v.actionPlans || []).length
    }));
    const visitSheet = XLSX.utils.json_to_sheet(visitRows);
    XLSX.utils.book_append_sheet(wb, visitSheet, "Visits");
    const issueRows = [];
    inRange.forEach((v) => (v.issues || []).forEach((iss) => issueRows.push({
      Date: v.date,
      Branch: v.branchName,
      Employee: v.employeeName,
      Type: iss.type,
      Priority: iss.priority,
      Status: iss.status,
      Description: iss.description
    })));
    if (issueRows.length) {
      const issueSheet = XLSX.utils.json_to_sheet(issueRows);
      XLSX.utils.book_append_sheet(wb, issueSheet, "Issues");
    }
    XLSX.writeFile(wb, "COUP-VM-Report-" + period + "-" + range.start + ".xlsx");
  }
  function handleExportPdf() {
    window.print();
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement(
    SectionHeader,
    {
      title: "Reports",
      subtitle: range.label,
      action: /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(SecondaryButton, { onClick: handleExportPdf }, /* @__PURE__ */ React.createElement(Printer, { className: "h-4 w-4" }), " PDF"), /* @__PURE__ */ React.createElement(PrimaryButton, { onClick: handleExportExcel }, /* @__PURE__ */ React.createElement(Download, { className: "h-4 w-4" }), " Excel"))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, ["daily", "weekly", "monthly"].map((p) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p,
      type: "button",
      onClick: () => setPeriod(p),
      className: "rounded-sm px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
      style: period === p ? { backgroundColor: INK, color: GOLD } : { backgroundColor: "#F1F1EF", color: "#6B6B64" }
    },
    p
  )), /* @__PURE__ */ React.createElement("input", { type: "date", className: inputCls + " max-w-[170px]", value: refDate, onChange: (e) => setRefDate(e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3" }, /* @__PURE__ */ React.createElement(KPICard, { label: "Total Visits", value: summary.totalVisits, icon: History }), /* @__PURE__ */ React.createElement(KPICard, { label: "Completed", value: summary.completedVisits, icon: CheckCircle2 }), /* @__PURE__ */ React.createElement(KPICard, { label: "Avg Compliance", value: summary.avgCompliance + "%", icon: ShieldCheck, accentColor: scoreColor(summary.avgCompliance) }), /* @__PURE__ */ React.createElement(KPICard, { label: "Avg Productivity", value: summary.avgProductivity + "%", icon: TrendingUp, accentColor: scoreColor(summary.avgProductivity) }), /* @__PURE__ */ React.createElement(KPICard, { label: "Issues Reported", value: summary.issuesReported, icon: AlertTriangle }), /* @__PURE__ */ React.createElement(KPICard, { label: "Issues Resolved", value: summary.issuesResolved, icon: CheckCircle, accentColor: "#1F7A4D" })), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto rounded-sm border border-gray-200" }, /* @__PURE__ */ React.createElement("table", { className: "w-full min-w-[760px] text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "border-b border-gray-200 bg-[#FAFAF8] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400" }, /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Date"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Employee"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Branch"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Type"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Compliance"), /* @__PURE__ */ React.createElement("th", { className: "px-4 py-3" }, "Productivity"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-gray-100" }, inRange.slice().sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime)).map((v) => /* @__PURE__ */ React.createElement("tr", { key: v.id }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-gray-600" }, formatDateHuman(v.checkInTime)), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 font-medium text-gray-800" }, v.employeeName), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-gray-600" }, v.branchName), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-gray-600" }, v.visitType), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement(StatusBadge, { status: v.status })), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 font-semibold", style: { color: scoreColor(v.complianceScore || 0) } }, v.status === "completed" ? v.complianceScore + "%" : "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 font-semibold", style: { color: v.productivityScore != null ? scoreColor(v.productivityScore) : "#9C9C94" } }, v.productivityScore != null ? v.productivityScore + "%" : "\u2014"))), !inRange.length ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 7, className: "px-4 py-8 text-center text-sm text-gray-400" }, "No visits recorded in this period.")) : null))));
}
const PRINT_CSS = "@media print { .no-print { display: none !important; } .app-shell, .app-main { height: auto !important; overflow: visible !important; } }";
const ARBITRARY_VALUE_CSS = [
  '[class*="bg-[#121212]"] { background-color: #121212; }',
  '[class*="bg-[#F1F1EF]"] { background-color: #F1F1EF; }',
  '[class*="bg-[#FAFAF8]"] { background-color: #FAFAF8; }',
  '[class*="bg-[#FBFBFA]"] { background-color: #FBFBFA; }',
  '[class*="focus:border-[#C8A24A]"]:focus { border-color: #C8A24A; }',
  '[class*="focus:ring-[#C8A24A]"]:focus { --tw-ring-color: #C8A24A; }',
  '[class*="h-[3px]"] { height: 3px; }',
  '[class*="h-[76px]"] { height: 76px; }',
  '[class*="hover:bg-[#FAFAF8]"]:hover { background-color: #FAFAF8; }',
  '[class*="hover:border-[#C8A24A]"]:hover { border-color: #C8A24A; }',
  '[class*="hover:text-[#9C7C2E]"]:hover { color: #9C7C2E; }',
  '[class*="max-h-[92vh]"] { max-height: 92vh; }',
  '[class*="max-w-[160px]"] { max-width: 160px; }',
  '[class*="max-w-[170px]"] { max-width: 170px; }',
  '[class*="max-w-[200px]"] { max-width: 200px; }',
  '[class*="max-w-[220px]"] { max-width: 220px; }',
  '[class*="min-w-[680px]"] { min-width: 680px; }',
  '[class*="min-w-[720px]"] { min-width: 720px; }',
  '[class*="min-w-[760px]"] { min-width: 760px; }',
  '[class*="text-[#121212]"] { color: #121212; }',
  '[class*="text-[10px]"] { font-size: 10px; line-height: 1rem; }',
  '[class*="text-[11px]"] { font-size: 11px; line-height: 1rem; }',
  '[class*="w-[76px]"] { width: 76px; }'
].join(" ");
const GLOBAL_CSS = ARBITRARY_VALUE_CSS + " " + PRINT_CSS;
function App() {
  const { visits, loading, syncError, saveVisit } = useVisits();
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [navOpen, setNavOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeVisitId, setActiveVisitId] = useState(null);
  const [detailVisit, setDetailVisit] = useState(null);
  const [auditSeed, setAuditSeed] = useState({ employeeId: "", branchId: "", nonce: 0 });
  function handleLogin(account) {
    setUser(account);
    setView("home");
  }
  function handleLogout() {
    setUser(null);
    setView("home");
    setWizardOpen(false);
    setActiveVisitId(null);
    setDetailVisit(null);
    setNavOpen(false);
  }
  function handleCreateVisit(newVisit) {
    saveVisit(newVisit);
  }
  function handleUpdateVisit(updatedVisit) {
    saveVisit(updatedVisit);
  }
  function handleUpdateIssueStatus(visitId, issueId, status) {
    const v = visits.find((x) => x.id === visitId);
    if (!v) return;
    saveVisit({ ...v, issues: (v.issues || []).map((i) => i.id === issueId ? { ...i, status } : i) });
  }
  function handleUpdateActionStatus(visitId, actionId, status) {
    const v = visits.find((x) => x.id === visitId);
    if (!v) return;
    saveVisit({ ...v, actionPlans: (v.actionPlans || []).map((a) => a.id === actionId ? { ...a, status } : a) });
  }
  function openWizardNew() {
    setActiveVisitId(null);
    setWizardOpen(true);
  }
  function openWizardResume(id) {
    setActiveVisitId(id);
    setWizardOpen(true);
  }
  function closeWizard() {
    setWizardOpen(false);
    setActiveVisitId(null);
  }
  function goViewEmployee(employeeId) {
    setAuditSeed((s) => ({ employeeId, branchId: "", nonce: s.nonce + 1 }));
    setView("audits");
  }
  function goViewBranch(branchId) {
    setAuditSeed((s) => ({ employeeId: "", branchId, nonce: s.nonce + 1 }));
    setView("audits");
  }
  if (!user) {
    return /* @__PURE__ */ React.createElement(LoginScreen, { onLogin: handleLogin });
  }
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen items-center justify-center bg-white" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-6 w-6 animate-spin text-gray-300" }));
  }
  if (wizardOpen) {
    const existingVisit = activeVisitId ? visits.find((v) => v.id === activeVisitId) || null : null;
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-white" }, /* @__PURE__ */ React.createElement(
      CheckInWizard,
      {
        employee: user,
        existingVisit,
        onCreateVisit: handleCreateVisit,
        onUpdateVisit: handleUpdateVisit,
        onExit: closeWizard
      }
    ));
  }
  const role = user.role;
  function renderView() {
    if (role === "member") {
      if (view === "home") {
        return /* @__PURE__ */ React.createElement(EmployeeHome, { user, visits, onStartNew: openWizardNew, onResume: openWizardResume, onView: setDetailVisit });
      }
      if (view === "visits") {
        return /* @__PURE__ */ React.createElement(MyVisits, { user, visits, onResume: openWizardResume, onView: setDetailVisit });
      }
      return null;
    }
    if (view === "home") return /* @__PURE__ */ React.createElement(ManagerHome, { visits, onView: setDetailVisit });
    if (view === "team") return /* @__PURE__ */ React.createElement(TeamPerformance, { visits, onViewEmployee: goViewEmployee });
    if (view === "branches") return /* @__PURE__ */ React.createElement(BranchPerformance, { visits, onViewBranch: goViewBranch });
    if (view === "audits") return /* @__PURE__ */ React.createElement(AuditHistory, { visits, onView: setDetailVisit, seed: auditSeed });
    if (view === "issues") return /* @__PURE__ */ React.createElement(IssuesPage, { visits, onUpdateIssueStatus: handleUpdateIssueStatus });
    if (view === "actions") return /* @__PURE__ */ React.createElement(ActionPlansPage, { visits, onUpdateActionStatus: handleUpdateActionStatus });
    if (view === "analytics") return /* @__PURE__ */ React.createElement(AnalyticsPage, { visits });
    if (view === "reports") return /* @__PURE__ */ React.createElement(ReportsPage, { visits });
    return null;
  }
  function handleSelectNav(key) {
    setView(key);
    setNavOpen(false);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "app-shell flex h-screen overflow-hidden bg-[#FBFBFA]" }, /* @__PURE__ */ React.createElement("style", null, GLOBAL_CSS), /* @__PURE__ */ React.createElement("div", { className: "no-print hidden md:block md:w-64 md:flex-shrink-0" }, /* @__PURE__ */ React.createElement(SidebarContent, { role, view, onSelect: handleSelectNav, user, onLogout: handleLogout })), navOpen ? /* @__PURE__ */ React.createElement("div", { className: "no-print fixed inset-0 z-40 flex md:hidden" }, /* @__PURE__ */ React.createElement("div", { className: "w-72 flex-shrink-0" }, /* @__PURE__ */ React.createElement(SidebarContent, { role, view, onSelect: handleSelectNav, user, onLogout: handleLogout, onClose: () => setNavOpen(false) })), /* @__PURE__ */ React.createElement("div", { className: "flex-1 bg-black/40", onClick: () => setNavOpen(false) })) : null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-1 flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "no-print" }, /* @__PURE__ */ React.createElement(TopBar, { role, view, user, onMenu: () => setNavOpen(true), syncError })), /* @__PURE__ */ React.createElement("main", { className: "app-main flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8" }, renderView())), /* @__PURE__ */ React.createElement(Modal, { open: !!detailVisit, onClose: () => setDetailVisit(null), title: "Visit Details", wide: true }, /* @__PURE__ */ React.createElement(VisitDetailView, { visit: detailVisit })));
}
export {
  App as default
};
