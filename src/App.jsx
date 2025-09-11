import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Filler, Tooltip, Legend);

/* -------------------------- 工具 / 常量 -------------------------- */
const YEARS = [1, 3, 5, 7];
const PACK_SIZES = [1000, 500, 100, 50, 20, 10];
const sym = (lang) => (lang === "wwpl" ? "$ " : "¥ ");
const fmt1 = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/* -------------------------- 国际化文本 -------------------------- */
const i18n = {
  cpl: {
    title: "OV TERRA vs OV2500 价格对比（1/3/5/7 年）",
    total: "合计",
    avg: "年均",
    selectTemplate: "选择模板（可选）",
    harbin: "哈工大模板", 
    shangqiu: "商丘医专模板",
    guangda: "广达项目模板",
    load: "载入",
    clearAll: "全清空",
    terraCombo: "Terra 组合",
    autoMatch: "自动匹配到 OV2500",
    unifiedTier: "统一套餐",
    applyAll: "应用到所有 Terra 项",
    series: "系列",
    tier: "套餐", 
    qty: "数量",
    addToList: "添加到列表",
    clearTerra: "清空 Terra",
    noTerraItems: "暂无 Terra 项",
    ov2500: "OV2500",
    autoCombo: "自动组合",
    manualCombo: "手动组合",
    nodeLabel: "节点 Nnode",
    apLabel: "AP NAP",
    clearOv: "清空 OV",
    nodePacksDesc: "节点包（1000/500/100/50/20/10）",
    apPacksDesc: "AP 包（1000/500/100/50/20/10）",
    wcfDesc: "WCF（按 10/包，估算）",
    nodePacks: "节点包",
    apPacks: "AP 包",
    nodeNeed: "节点需求（参考）",
    apNeed: "AP 需求（参考）",
    priceAndYear: "价格与年期",
    year: "年"
  },
  wwpl: {
    title: "OV TERRA vs OV2500 Price Comparison (1/3/5/7 Years)",
    total: "Total",
    avg: "Average", 
    selectTemplate: "Select Template (Optional)",
    harbin: "Harbin Template",
    shangqiu: "Shangqiu Template", 
    guangda: "Guangda Template",
    load: "Load",
    clearAll: "Clear All",
    terraCombo: "Terra Combination",
    autoMatch: "Auto Match to OV2500", 
    unifiedTier: "Unified Tier",
    applyAll: "Apply to All Terra Items",
    series: "Series",
    tier: "Tier",
    qty: "Quantity",
    addToList: "Add to List",
    clearTerra: "Clear Terra",
    noTerraItems: "No Terra Items",
    ov2500: "OV2500",
    autoCombo: "Auto Combination",
    manualCombo: "Manual Combination", 
    nodeLabel: "Node Count",
    apLabel: "AP NAP",
    clearOv: "Clear OV",
    nodePacksDesc: "Node Packs (1000/500/100/50/20/10)",
    apPacksDesc: "AP Packs (1000/500/100/50/20/10)",
    wcfDesc: "WCF (10/pack, estimated)",
    nodePacks: "Node Packs", 
    apPacks: "AP Packs",
    nodeNeed: "Node Need (Reference)",
    apNeed: "AP Need (Reference)",
    priceAndYear: "Price & Years",
    year: "Year"
  }
};

const t = (lang, key) => i18n[lang][key] || key;

/* -------------------------- Terra 价格表（WWPL） -------------------------- */
const USD_TERRA = {
  // BAS
  "APL-BAS-1": 72, "APL-BAS-3": 144, "APL-BAS-5": 216, "APL-BAS-7": 360,
  "APH-BAS-1": 96, "APH-BAS-3": 192, "APH-BAS-5": 288, "APH-BAS-7": 480,
  "63-BAS-1": 80, "63-BAS-3": 160, "63-BAS-5": 240, "63-BAS-7": 400,
  "64-BAS-1": 96, "64-BAS-3": 192, "64-BAS-5": 288, "64-BAS-7": 480,
  "65-BAS-1": 96, "65-BAS-3": 192, "65-BAS-5": 288, "65-BAS-7": 480,
  "68-BAS-1": 300, "68-BAS-3": 600, "68-BAS-5": 900, "68-BAS-7": 1500,
  "69-BAS-1": 576, "69-BAS-3": 1152, "69-BAS-5": 1728, "69-BAS-7": 2880,
  "99-BAS-1": 2880, "99-BAS-3": 5760, "99-BAS-5": 8640, "99-BAS-7": 14400,
  // BIZ
  "APL-BIZ-1": 98, "APL-BIZ-3": 196, "APL-BIZ-5": 293, "APL-BIZ-7": 489,
  "APH-BIZ-1": 149, "APH-BIZ-3": 298, "APH-BIZ-5": 446, "APH-BIZ-7": 744,
  "63-BIZ-1": 115, "63-BIZ-3": 230, "63-BIZ-5": 344, "63-BIZ-7": 574,
  "64-BIZ-1": 159, "64-BIZ-3": 318, "64-BIZ-5": 477, "64-BIZ-7": 795,
  "65-BIZ-1": 170, "65-BIZ-3": 337, "65-BIZ-5": 510, "65-BIZ-7": 850,
  "68-BIZ-1": 591, "68-BIZ-3": 1182, "68-BIZ-5": 1772, "68-BIZ-7": 2954,
  "69-BIZ-1": 1165, "69-BIZ-3": 2329, "69-BIZ-5": 3494, "69-BIZ-7": 5823,
  "99-BIZ-1": 9819, "99-BIZ-3": 19638, "99-BIZ-5": 29458, "99-BIZ-7": 49096,
  // PRM
  "APL-PRM-1": 110, "APL-PRM-3": 220, "APL-PRM-5": 329, "APL-PRM-7": 549,
  "APH-PRM-1": 169, "APH-PRM-3": 338, "APH-PRM-5": 508, "APH-PRM-7": 846,
  "63-PRM-1": 196, "63-PRM-3": 392, "63-PRM-5": 589, "63-PRM-7": 981,
  "64-PRM-1": 259, "64-PRM-3": 518, "64-PRM-5": 778, "64-PRM-7": 1296,
  "65-PRM-1": 446, "65-PRM-3": 893, "65-PRM-5": 1339, "65-PRM-7": 2232,
  "68-PRM-1": 763, "68-PRM-3": 1526, "68-PRM-5": 2290, "68-PRM-7": 3816,
  "69-PRM-1": 1816, "69-PRM-3": 3632, "69-PRM-5": 5449, "69-PRM-7": 9081,
  "99-PRM-1": 13320, "99-PRM-3": 26640, "99-PRM-5": 39960, "99-PRM-7": 66600,
};
// CPL = WWPL × 14
const CNY_TERRA = new Proxy(
  {},
  {
    get(_, k) {
      const v = USD_TERRA[k] || 0;
      return v * 14;
    },
  }
);

/* -------------------------- OV2500 价格表（WWPL） -------------------------- */
const USD_OV = {
  START: 1.0,
  HA: 10400.0,
  WCF10: 619.0,
  Node: { 10: 3432, 20: 5720, 50: 11440, 100: 17160, 500: 57200, 1000: 91520 },
  AP: { 10: 520, 20: 1040, 50: 2600, 100: 4680, 500: 20800, 1000: 31200 },
};

/* -------------------------- OV2500 中文价格表 -------------------------- */
const CNY_OV = {
  START: 0,
  HA: 179400,
  WCF10: 10674,
  Node: { 10: 59202, 20: 98670, 50: 197340, 100: 296010, 500: 986700, 1000: 1578720 },
  AP: { 10: 8970, 20: 17940, 50: 44850, 100: 80730, 500: 358800, 1000: 538200 },
};

/* -------------------------- 小组件 -------------------------- */
const Seg = ({ value, onChange, items, darkMode = false }) => (
  <div className={`inline-flex rounded-full border p-1 transition-colors ${
    darkMode ? 'bg-neutral-900/95 border-neutral-800/50' : 'bg-slate-100 border-slate-200'
  }`}>
    {items.map((it) => (
      <button
        key={it.value}
        className={`px-3 py-1 rounded-full transition-colors ${
          value === it.value 
            ? darkMode 
              ? "bg-violet-600/90 text-violet-50 font-semibold shadow-lg shadow-violet-500/20" 
              : "bg-violet-100 text-violet-700 font-semibold"
            : darkMode
              ? "text-gray-400 hover:bg-neutral-800/80"
              : "text-slate-700"
        }`}
        onClick={() => onChange(it.value)}
      >
        {it.label}
      </button>
    ))}
  </div>
);

const Card = ({ children, className = "", glow = false, darkMode = false }) => (
  <motion.div
    layout
    className={`border rounded-2xl shadow-sm transition-colors duration-300 relative ${
      glow && darkMode 
        ? 'border-neutral-700/50 shadow-lg shadow-neutral-900/30' 
        : ''
    } ${className}`}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.18, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const Field = ({ label, children, darkMode = false }) => (
  <label className={`text-sm flex flex-col gap-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
    <span>{label}</span>
    {children}
  </label>
);

const Input = ({ darkMode = false, ...props }) => (
  <input
    {...props}
    className={`h-10 w-full rounded-xl border px-3 outline-none transition-colors ${
      darkMode 
        ? 'bg-neutral-800/95 border-neutral-700/80 text-white focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20' 
        : 'bg-white border-slate-200 text-slate-900 focus:border-violet-300 focus:ring-2 focus:ring-violet-100'
    } ${props.className || ""}`}
  />
);

const Select = ({ children, darkMode = false, ...rest }) => (
  <select
    {...rest}
    className={`h-10 w-full rounded-xl border px-3 pr-8 outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23${darkMode ? '9CA3AF' : '666'}%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22/%3E%3C/svg%3E')] bg-no-repeat bg-right-2 bg-[length:1.5rem] transition-colors ${
      darkMode 
        ? 'bg-neutral-800/80 border-neutral-700/60 text-white hover:bg-neutral-700/90 hover:border-violet-500/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30' 
        : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-violet-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-100'
    }`}
  >
    {children}
  </select>
);

const Btn = ({ children, variant = "primary", darkMode = false, ...rest }) => {
  const cls = variant === "ghost"
    ? darkMode 
      ? "bg-neutral-800/60 hover:bg-neutral-700/70 border border-neutral-700/50 text-gray-200"
      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
    : darkMode
      ? "bg-violet-600/80 hover:bg-violet-500/90 text-violet-50"
      : "bg-violet-600 hover:bg-violet-700 text-white";
  return (
    <button
      {...rest}
      className={`h-10 px-4 rounded-xl font-semibold transition-colors ${cls} disabled:opacity-50`}
    >
      {children}
    </button>
  );
};

/* -------------------------- 主组件 -------------------------- */
export default function App() {
/* 全局状态 */
  const [lang, setLang] = useState("cpl"); // cpl / wwpl
  const [sumMode, setSumMode] = useState("total"); // total / avg
  const [autoMap, setAutoMap] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  // 监听窗口大小变化
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [terra, setTerra] = useState([
    // 初始空
  ]);

  const [ovMode, setOvMode] = useState("auto"); // auto / manual
  const [ov, setOv] = useState({ Nnode: 0, Nap: 0, start: false, ha: false, node: true, ap: true, wcf: false });
  const [ovM, setOvM] = useState({
    needNode: 0,
    needAP: 0,
    start: false,
    ha: false,
    wcf: false,
    nodePacks: { 1000: 0, 500: 0, 100: 0, 50: 0, 20: 0, 10: 0 },
    apPacks: { 1000: 0, 500: 0, 100: 0, 50: 0, 20: 0, 10: 0 },
  });

  // 动态主题样式
  const themeStyles = {
    card: darkMode 
      ? 'bg-neutral-900/95 border-neutral-800/80 backdrop-blur-sm shadow-2xl shadow-black/50' 
      : 'bg-white/95 border-slate-200 backdrop-blur-sm',
    cardAlt: darkMode 
      ? 'bg-neutral-800/90 border-neutral-700/70 backdrop-blur-sm shadow-xl shadow-black/40' 
      : 'bg-white/90 border-slate-200/60 backdrop-blur-sm',
    text: darkMode ? 'text-white' : 'text-slate-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-slate-600',
    textLight: darkMode ? 'text-gray-500' : 'text-slate-500',
    input: darkMode 
      ? 'bg-neutral-800/95 border-neutral-700/80 text-white hover:bg-neutral-700/95 hover:border-violet-500/50 focus:border-violet-400 focus:ring-violet-500/30 backdrop-blur-sm shadow-lg shadow-black/30' 
      : 'bg-white/95 border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-violet-300 focus:border-violet-300 focus:ring-violet-100 backdrop-blur-sm',
    button: darkMode
      ? 'bg-neutral-800/90 hover:bg-neutral-700/95 border-neutral-700/80 text-gray-200 hover:border-violet-500/50 backdrop-blur-sm shadow-lg shadow-black/30'
      : 'bg-white/95 hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-violet-300 backdrop-blur-sm',
    chartBg: darkMode
      ? 'bg-neutral-900/98 backdrop-blur-sm shadow-2xl shadow-black/60'
      : 'bg-gradient-to-br from-slate-50/90 to-white/95 backdrop-blur-sm',
  };

  /* 模板 */
  const loadTpl = (tpl) => {
    if (tpl === "harbin") {
      setTerra([
        { series: "APL", tier: "BAS", qty: 750 },
        { series: "APH", tier: "BAS", qty: 59 },
        { series: "63", tier: "BAS", qty: 427 },
        { series: "69", tier: "BAS", qty: 62 },
      ]);
      setOv(prev => ({ ...prev, start: true }));
    } else if (tpl === "shangqiu") {
      setTerra([
        { series: "APL", tier: "BAS", qty: 2430 },
        { series: "APL", tier: "BAS", qty: 770 },
        { series: "63", tier: "BAS", qty: 150 },
        { series: "69", tier: "BAS", qty: 75 },
      ]);
      setOv(prev => ({ ...prev, start: true }));
    } else if (tpl === "guangda") {
      setTerra([
        { series: "APL", tier: "BAS", qty: 60 },
        { series: "APH", tier: "BAS", qty: 6 },
        { series: "63", tier: "BAS", qty: 20 },
        { series: "69", tier: "BAS", qty: 30 },
      ]);
      setOv(prev => ({ ...prev, start: true }));
    }
  };

  /* Terra 输入 */
  const [draft, setDraft] = useState({ series: "APL", tier: "BAS", qty: 50, bulk: "BAS" });
  const addTerra = () => setTerra((t) => [...t, { series: draft.series, tier: draft.tier, qty: Math.max(0, +draft.qty || 0) }]);
  const clearTerra = () => setTerra([]);

  const applyBulkTier = () => setTerra((list) => list.map((it) => ({ ...it, tier: draft.bulk })));
  const setTerraItem = (i, patch) => setTerra((list) => list.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const delTerraItem = (i) => setTerra((list) => list.filter((_, idx) => idx !== i));

  /* Terra → 自动匹配 OV（APL/APH → AP；其余 → 节点） */
  useEffect(() => {
    if (!autoMap) return;
    let node = 0,
      nap = 0;
    terra.forEach((t) => {
      if (t.series === "APL" || t.series === "APH") nap += +t.qty || 0;
      else node += +t.qty || 0;
    });
    setOv((o) => ({ ...o, Nnode: node, Nap: nap }));
  }, [terra, autoMap]);

  /* 价格表选择 */
  const terraTable = lang === "wwpl" ? USD_TERRA : CNY_TERRA;
  const ovTable = lang === "wwpl" ? USD_OV : CNY_OV;

  /* Terra 金额 */
  const terraYearSums = useMemo(() => {
    const sums = { 1: 0, 3: 0, 5: 0, 7: 0 };
    terra.forEach((it) => {
      YEARS.forEach((y) => {
        const k = `${it.series}-${it.tier}-${y}`;
        sums[y] += (terraTable[k] || 0) * (+it.qty || 0);
      });
    });
    return sums;
  }, [terra, terraTable]);

  /* OV 自动拆包（最优组合） */
  const autoPacks = useMemo(() => {
    if (ovMode !== "auto") return { node: {}, ap: {} };
    let needNode = +ov.Nnode || 0;
    let needAP = +ov.Nap || 0;
    if (ov.start) {
      needNode = Math.max(0, needNode - 10);
      needAP = Math.max(0, needAP - 10);
    }

    // 最优组合算法（改进的贪心算法 + 大包优化）
    const findOptimalCombination = (need, priceTable) => {
      if (need <= 0) return {};
      
      // 贪心算法基础结果
      const greedyBucket = {};
      let remaining = need;
      
      // 从大到小尝试，确保满足需求
      for (const size of PACK_SIZES) {
        if (remaining >= size) {
          const count = Math.floor(remaining / size);
          if (count > 0) {
            greedyBucket[size] = (greedyBucket[size] || 0) + count;
            remaining -= count * size;
          }
        }
      }
      
      // 如果还有剩余，用最小的包补齐
      if (remaining > 0) {
        const smallestSize = PACK_SIZES[PACK_SIZES.length - 1];
        greedyBucket[smallestSize] = (greedyBucket[smallestSize] || 0) + 1;
        remaining -= smallestSize;
      }
      
      // 计算贪心算法的总成本
      const calculateCost = (bucket) => {
        return Object.entries(bucket).reduce((sum, [size, count]) => 
          sum + (priceTable[size] * count), 0);
      };
      
      const greedyCost = calculateCost(greedyBucket);
      
      // 检查是否有更优的单个大包选择
      const alternatives = [];
      
      // 检查每个包大小，看是否用1个该包就能满足需求且成本更低
      for (const size of PACK_SIZES) {
        if (size >= need && priceTable[size] < greedyCost) {
          alternatives.push({
            bucket: { [size]: 1 },
            cost: priceTable[size],
            total: size
          });
        }
      }
      
      // 检查两个包的组合（如100+500）
      for (let i = 0; i < PACK_SIZES.length; i++) {
        for (let j = i; j < PACK_SIZES.length; j++) {
          const size1 = PACK_SIZES[i];
          const size2 = PACK_SIZES[j];
          const total = size1 + size2;
          
          if (total >= need) {
            const combo = {};
            if (size1 === size2) {
              combo[size1] = 2;
            } else {
              combo[size1] = 1;
              combo[size2] = 1;
            }
            
            const comboCost = calculateCost(combo);
            if (comboCost < greedyCost) {
              alternatives.push({
                bucket: combo,
                cost: comboCost,
                total: total
              });
            }
          }
        }
      }
      
      // 如果有更优的选择，选择成本最低的
      if (alternatives.length > 0) {
        alternatives.sort((a, b) => a.cost - b.cost);
        return alternatives[0].bucket;
      }
      
      return greedyBucket;
    };

    const store = { node: {}, ap: {} };
    
    if (ov.node && needNode > 0) {
      store.node = findOptimalCombination(needNode, ovTable.Node);
    }
    
    if (ov.ap && needAP > 0) {
      store.ap = findOptimalCombination(needAP, ovTable.AP);
    }
    
    return store;
  }, [ovMode, ov, ovTable]);

  /* OV 金额 */
  const ovYearSums = useMemo(() => {
    let total = 0;
    if (ovMode === "auto") {
      if (ov.start) total += ovTable.START;
      if (ov.ha) total += ovTable.HA;
      if (ov.node) {
        for (const s of Object.keys(autoPacks.node)) total += ovTable.Node[s] * (autoPacks.node[s] || 0);
      }
      if (ov.ap) {
        for (const s of Object.keys(autoPacks.ap)) total += ovTable.AP[s] * (autoPacks.ap[s] || 0);
      }
      if (ov.wcf) {
        const est = Math.ceil((+ov.Nap || 0) / 10);
        total += est * ovTable.WCF10;
      }
    } else {
      if (ovM.start) total += ovTable.START;
      if (ovM.ha) total += ovTable.HA;
      for (const s of PACK_SIZES) total += (ovM.nodePacks[s] || 0) * ovTable.Node[s];
      for (const s of PACK_SIZES) total += (ovM.apPacks[s] || 0) * ovTable.AP[s];
      if (ovM.wcf) {
        const est = Math.ceil((+ovM.needAP || 0) / 10);
        total += est * ovTable.WCF10;
      }
    }
    return { 1: total, 3: total, 5: total, 7: total };
  }, [ovMode, ov, ovM, autoPacks, ovTable]);

  /* 统计卡片 */
  const mkVal = (v, years) => (sumMode === "avg" ? v / years : v);

  /* Chart 数据 */
  const chartData = useMemo(() => {
    const labels = ["1y", "3y", "5y", "7y"];
    const t = [mkVal(terraYearSums[1], 1), mkVal(terraYearSums[3], 3), mkVal(terraYearSums[5], 5), mkVal(terraYearSums[7], 7)];
    const o = [mkVal(ovYearSums[1], 1), mkVal(ovYearSums[3], 3), mkVal(ovYearSums[5], 5), mkVal(ovYearSums[7], 7)];
    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: "Terra",
          data: t,
          backgroundColor: darkMode ? "rgba(147,51,234,0.8)" : "rgba(124,58,237,0.8)",
          borderColor: darkMode ? "#9333EA" : "#7C3AED",
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: windowSize.width < 640 ? 25 : 40,  // 移动端25px，桌面端40px
          categoryPercentage: 0.8,
          barPercentage: 0.9,
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: "OV2500",
          data: o,
          backgroundColor: darkMode ? "rgba(16,185,129,0.8)" : "rgba(5,150,105,0.8)",
          borderColor: darkMode ? "#10B981" : "#059669",
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: windowSize.width < 640 ? 25 : 40,  // 移动端25px，桌面端40px
          categoryPercentage: 0.8,
          barPercentage: 0.9,
          yAxisID: 'y',
        },
      ],
    };
  }, [terraYearSums, ovYearSums, sumMode, darkMode, windowSize]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart',
        onProgress: function(animation) {
          const chart = animation.chart;
          const ctx = chart.ctx;
          ctx.globalAlpha = animation.currentStep / animation.numSteps;
        }
      },
      plugins: {
        legend: { 
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            padding: 15,
            font: {
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            filter: function(item, chart) {
              // 只显示线图图例项，避免重复
              return item.datasetIndex < 2;
            }
          }
        },
        tooltip: {
          backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(17, 24, 39, 0.95)',
          titleColor: darkMode ? '#F1F5F9' : '#F9FAFB',
          bodyColor: darkMode ? '#F1F5F9' : '#F9FAFB',
          borderColor: darkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(156, 163, 175, 0.2)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 16,
          titleFont: {
            size: 14,
            weight: '600'
          },
          bodyFont: {
            size: 13
          },
          displayColors: true,
          boxPadding: 6,
          usePointStyle: true,
          filter: (tooltipItem) => {
            // 只显示柱状图的tooltip
            return true;
          },
          callbacks: {
            title: (tooltipItems) => {
              return tooltipItems[0].label + " 价格对比";
            },
            label: (context) => {
              const label = context.dataset.label;
              const value = context.parsed.y;
              return `${label}: ${sym(lang)}${fmt1(value)}`;
            },
            afterBody: (tooltipItems) => {
              const year = parseInt(tooltipItems[0].label.replace('y', ''));
              const terraVal = mkVal(terraYearSums[year], year);
              const ovVal = mkVal(ovYearSums[year], year);
              const diff = Math.abs(terraVal - ovVal);
              const cheaper = terraVal < ovVal ? 'Terra' : 'OV2500';
              return [`\n节省: ${sym(lang)}${fmt1(diff)}`, `更便宜: ${cheaper}`];
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: darkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.1)',
            lineWidth: 1,
          },
          ticks: {
            font: {
              size: windowSize.width < 640 ? 10 : 12,  // 移动端字体更小
              weight: '500'
            },
            color: darkMode ? '#94A3B8' : '#64748B',
            padding: windowSize.width < 640 ? 4 : 8,  // 移动端内边距更小
          },
          border: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: darkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.1)',
            lineWidth: 1,
          },
          border: {
            display: false
          },
          ticks: {
            callback: (v) => `${sym(lang)}${fmt1(v)}`,
            font: {
              size: windowSize.width < 640 ? 9 : 11,  // 移动端字体更小
              weight: '400'
            },
            color: darkMode ? '#94A3B8' : '#64748B',
            padding: windowSize.width < 640 ? 6 : 12,  // 移动端内边距更小
            maxTicksLimit: windowSize.width < 640 ? 6 : 8,  // 移动端减少刻度数量
          },
          position: 'left'
        },
      },
      onHover: (event, activeElements, chart) => {
        const canvas = chart.canvas;
        canvas.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
        
        if (activeElements.length > 0) {
          canvas.style.transform = 'scale(1.005)';
          canvas.style.transition = 'transform 0.2s ease-out';
        } else {
          canvas.style.transform = 'scale(1)';
        }
      },
    }),
    [lang, terraYearSums, ovYearSums, sumMode, darkMode, windowSize]
  );

  /* -------------------------- UI -------------------------- */
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 顶部条 */}
      <div className={`sticky top-0 z-20 backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-black/95 border-neutral-800/80 shadow-lg shadow-black/40' 
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-lg font-bold">{t(lang, 'title')}</div>
          <div className="flex-1 w-full flex justify-between sm:justify-end items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-gray-300 shadow-lg shadow-black/30 border border-neutral-800/50' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title={darkMode ? '切换到浅色模式' : '切换到深色模式'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Seg
              value={lang}
              onChange={setLang}
              darkMode={darkMode}
              items={[
                { value: "cpl", label: "CPL" },
                { value: "wwpl", label: "WWPL" },
              ]}
            />
            <Seg
              value={sumMode}
              onChange={setSumMode}
              darkMode={darkMode}
              items={[
                { value: "total", label: t(lang, 'total') },
                { value: "avg", label: t(lang, 'avg') },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4">
        {/* 上半部分：Terra 和 图表 */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-4">
          {/* 左：Terra & 模板 */}
          <div className="flex flex-col gap-4 h-full">
            <Card className={`p-3 ${themeStyles.card}`} glow={darkMode} darkMode={darkMode}>
              <div className="flex flex-wrap gap-2 items-end">
                <Select onChange={(e) => loadTpl(e.target.value)} defaultValue="" darkMode={darkMode}>
                  <option value="">{t(lang, 'selectTemplate')}</option>
                  <option value="harbin">{t(lang, 'harbin')}</option>
                  <option value="shangqiu">{t(lang, 'shangqiu')}</option>
                  <option value="guangda">{t(lang, 'guangda')}</option>
                </Select>
                <Btn onClick={() => loadTpl(document.querySelector("select").value)} darkMode={darkMode}>{t(lang, 'load')}</Btn>
                <Btn variant="ghost" onClick={() => { setTerra([]); setOv({ Nnode: 0, Nap: 0, start: false, ha: false, node: true, ap: true, wcf: false }); }} darkMode={darkMode}>
                  {t(lang, 'clearAll')}
                </Btn>
              </div>
            </Card>

            <Card className={`p-4 flex-1 flex flex-col ${themeStyles.card}`} glow={darkMode} darkMode={darkMode}>
              <div className="flex items-center justify-between">
                <div className={`text-base font-semibold ${themeStyles.text}`}>{t(lang, 'terraCombo')}</div>
                <label className={`flex items-center gap-2 p-1 rounded transition-colors ${
                  darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={autoMap} 
                    onChange={(e) => setAutoMap(e.target.checked)}
                    className={`w-4 h-4 rounded transition-colors ${
                      darkMode 
                        ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                        : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                    }`}
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{t(lang, 'autoMatch')}</span>
                </label>
              </div>

              {/* 统一套餐 + 添加行 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                <Field label={t(lang, 'unifiedTier')} darkMode={darkMode}>
                  <Select value={draft.bulk} onChange={(e) => setDraft((d) => ({ ...d, bulk: e.target.value }))} darkMode={darkMode}>
                    <option>BAS</option>
                    <option>BIZ</option>
                    <option>PRM</option>
                  </Select>
                </Field>
                <div className="col-span-1 sm:col-span-2 flex items-end">
                  <Btn className="w-full" onClick={applyBulkTier} disabled={!terra.length} darkMode={darkMode}>
                    {t(lang, 'applyAll')}
                  </Btn>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                <Field label={t(lang, 'series')} darkMode={darkMode}>
                  <Select value={draft.series} onChange={(e) => setDraft((d) => ({ ...d, series: e.target.value }))} darkMode={darkMode}>
                    {["APL", "APH", "63", "64", "65", "68", "69", "99"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                </Field>
                <Field label={t(lang, 'tier')} darkMode={darkMode}>
                  <Select value={draft.tier} onChange={(e) => setDraft((d) => ({ ...d, tier: e.target.value }))} darkMode={darkMode}>
                    <option>BAS</option>
                    <option>BIZ</option>
                    <option>PRM</option>
                  </Select>
                </Field>
                <Field label={t(lang, 'qty')} darkMode={darkMode}>
                  <Input type="number" min="0" step="1" value={draft.qty} onChange={(e) => setDraft((d) => ({ ...d, qty: e.target.value }))} darkMode={darkMode} />
                </Field>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Btn onClick={addTerra} darkMode={darkMode}>{t(lang, 'addToList')}</Btn>
                <Btn variant="ghost" onClick={clearTerra} disabled={!terra.length} darkMode={darkMode}>
                  {t(lang, 'clearTerra')}
                </Btn>
              </div>

              {/* Terra 列表 */}
              <AnimatePresence initial={false}>
                <div className="mt-4 space-y-2 flex-1 overflow-auto">
                  {terra.length === 0 && <div className={`text-sm ${themeStyles.textLight}`}>{t(lang, 'noTerraItems')}</div>}

                  {terra.map((it, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      className={`grid grid-cols-[60px,80px,80px,50px,32px] sm:grid-cols-[64px,80px,80px,60px,36px] gap-1 sm:gap-2 items-center p-2 rounded-xl border transition-colors ${
                        darkMode ? 'border-neutral-700/50 bg-neutral-800/40' : 'border-slate-200'
                      }`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <div className={`font-semibold text-sm ${themeStyles.text}`}>{it.series}</div>

                      <div className="relative">
                        <select 
                          value={it.tier} 
                          onChange={(e) => setTerraItem(idx, { tier: e.target.value })}
                          className={`h-8 w-full rounded-lg border px-2 pr-6 text-sm outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23${darkMode ? '9CA3AF' : '666'}%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22/%3E%3C/svg%3E')] bg-no-repeat bg-right-1 bg-[length:1rem] transition-colors ${
                            darkMode 
                              ? 'bg-neutral-800/80 border-neutral-700/60 text-white hover:bg-neutral-700/90 hover:border-violet-500/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30' 
                              : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-violet-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-100'
                          }`}
                        >
                          <option>BAS</option>
                          <option>BIZ</option>
                          <option>PRM</option>
                        </select>
                      </div>

                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={it.qty}
                        onChange={(e) => setTerraItem(idx, { qty: Math.max(0, +e.target.value || 0) })}
                        className="h-8 text-sm px-2"
                        darkMode={darkMode}
                      />

                      <div className={`text-xs text-center ${themeStyles.textLight}`}>{it.tier}</div>

                      <button
                        className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg border text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors ${
                          darkMode ? 'border-neutral-700 hover:bg-rose-900/20' : 'border-slate-200 hover:bg-rose-50'
                        }`}
                        onClick={() => delTerraItem(idx)}
                        title="删除"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </Card>
          </div>

          {/* 右：图表与统计 */}
          <div className="flex flex-col gap-4">
            {/* 价格与年期图表 */}
            <Card className={`p-6 border ${themeStyles.chartBg} ${darkMode ? 'border-slate-700/60' : 'border-slate-200/60'}`} glow={darkMode} darkMode={darkMode}>
              <div className="flex items-center justify-between">
                <div className={`text-lg font-semibold ${themeStyles.text}`}>{t(lang, 'priceAndYear')}</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                    <span className={themeStyles.textMuted}>Terra</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                    <span className={themeStyles.textMuted}>OV2500</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 h-[300px] sm:h-[400px] lg:h-[450px] relative">
                <Chart type="bar" data={chartData} options={chartOptions} />
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {YEARS.map((y) => (
                  <motion.div
                    key={y}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`rounded-xl border p-3 backdrop-blur-sm transition-colors ${themeStyles.cardAlt}`}
                  >
                    <div className={`text-xs text-center mb-2 font-medium ${themeStyles.textLight}`}>{y} {t(lang, 'year')}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className={`flex items-center gap-1 ${themeStyles.textMuted}`}>
                          <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                          Terra
                        </span>
                        <span className="font-semibold text-violet-700 tabular-nums">{sym(lang)}{fmt1(mkVal(terraYearSums[y], y))}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className={`flex items-center gap-1 ${themeStyles.textMuted}`}>
                          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                          OV
                        </span>
                        <span className="font-semibold text-emerald-700 tabular-nums">{sym(lang)}{fmt1(mkVal(ovYearSums[y], y))}</span>
                      </div>
                      <div className={`border-t pt-1 mt-1 transition-colors ${
                        darkMode ? 'border-slate-600/60' : 'border-slate-200/60'
                      }`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className={themeStyles.textLight}>差价</span>
                          <span className={`font-medium tabular-nums ${
                            terraYearSums[y] < ovYearSums[y] ? 'text-violet-600' : 'text-emerald-600'
                          }`}>
                            {sym(lang)}{fmt1(Math.abs(mkVal(terraYearSums[y], y) - mkVal(ovYearSums[y], y)))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 下半部分：OV2500 */}
        <Card className={`p-4 ${themeStyles.card}`} glow={darkMode} darkMode={darkMode}>
          <div className="flex items-center justify-between mb-4">
            <div className={`text-base font-semibold ${themeStyles.text}`}>{t(lang, 'ov2500')}</div>
            <Seg
              value={ovMode}
              onChange={(v) => {
                if (v === "manual")
                  setOvM((m) => ({ ...m, needAP: ov.Nap, needNode: ov.Nnode }));
                setOvMode(v);
              }}
              darkMode={darkMode}
              items={[
                { value: "auto", label: t(lang, 'autoCombo') },
                { value: "manual", label: t(lang, 'manualCombo') },
              ]}
            />
          </div>

          {/* 自动 */}
          {ovMode === "auto" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
                <Field label={t(lang, 'nodeLabel')} darkMode={darkMode}>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={ov.Nnode}
                    onChange={(e) => setOv({ ...ov, Nnode: Math.max(0, +e.target.value || 0) })}
                    darkMode={darkMode}
                  />
                </Field>
                <Field label={t(lang, 'apLabel')} darkMode={darkMode}>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={ov.Nap}
                    onChange={(e) => setOv({ ...ov, Nap: Math.max(0, +e.target.value || 0) })}
                    darkMode={darkMode}
                  />
                </Field>
                <div className="col-span-1">
                  <label className={`flex items-center gap-2 p-1 rounded transition-colors ${
                    darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                  }`}>
                    <input 
                      type="checkbox" 
                      checked={ov.start} 
                      onChange={(e) => setOv({ ...ov, start: e.target.checked })}
                      className={`w-4 h-4 rounded transition-colors ${
                        darkMode 
                          ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                          : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                      }`}
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>START-NEW</span>
                  </label>
                </div>
                <div className="col-span-1">
                  <label className={`flex items-center gap-2 p-1 rounded transition-colors ${
                    darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                  }`}>
                    <input 
                      type="checkbox" 
                      checked={ov.ha} 
                      onChange={(e) => setOv({ ...ov, ha: e.target.checked })}
                      className={`w-4 h-4 rounded transition-colors ${
                        darkMode 
                          ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                          : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                      }`}
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>HA</span>
                  </label>
                </div>
                <div className="col-span-1">
                  <label className={`flex items-center gap-2 p-1 rounded transition-colors ${
                    darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                  }`}>
                    <input 
                      type="checkbox" 
                      checked={ov.wcf} 
                      onChange={(e) => setOv({ ...ov, wcf: e.target.checked })}
                      className={`w-4 h-4 rounded transition-colors ${
                        darkMode 
                          ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                          : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                      }`}
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>WCF</span>
                  </label>
                </div>
                <div className="col-span-1 sm:col-span-3 lg:col-span-3">
                  <Btn
                    className="w-full"
                    variant="ghost"
                    darkMode={darkMode}
                    onClick={() => setOv({ Nnode: 0, Nap: 0, start: false, ha: false, node: true, ap: true, wcf: false })}
                  >
                    {t(lang, 'clearOv')}
                  </Btn>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2 rounded transition-colors ${
                  darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={ov.node} 
                    onChange={(e) => setOv({ ...ov, node: e.target.checked })}
                    className={`w-4 h-4 rounded transition-colors ${
                      darkMode 
                        ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                        : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                    }`}
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{t(lang, 'nodePacksDesc')}</span>
                </label>
                <label className={`flex items-center gap-2 p-2 rounded transition-colors ${
                  darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={ov.ap} 
                    onChange={(e) => setOv({ ...ov, ap: e.target.checked })}
                    className={`w-4 h-4 rounded transition-colors ${
                      darkMode 
                        ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                        : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                    }`}
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{t(lang, 'apPacksDesc')}</span>
                </label>
              </div>

              {/* 自动拆包预览 */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm ${themeStyles.textMuted}`}>
                <div className={`rounded-xl border p-3 transition-colors ${themeStyles.cardAlt}`}>
                  <div className={`font-medium mb-1 ${themeStyles.text}`}>{t(lang, 'nodePacks')}</div>
                  <div className={themeStyles.textMuted}>
                    {Object.keys(autoPacks.node).length
                      ? Object.entries(autoPacks.node)
                          .map(([s, c]) => `${s}×${c}`)
                          .join("，")
                      : "—"}
                  </div>
                </div>
                <div className={`rounded-xl border p-3 transition-colors ${themeStyles.cardAlt}`}>
                  <div className={`font-medium mb-1 ${themeStyles.text}`}>{t(lang, 'apPacks')}</div>
                  <div className={themeStyles.textMuted}>
                    {Object.keys(autoPacks.ap).length
                      ? Object.entries(autoPacks.ap)
                          .map(([s, c]) => `${s}×${c}`)
                          .join("，")
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 手动 */}
          {ovMode === "manual" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <Field label={t(lang, 'nodeNeed')} darkMode={darkMode}>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={ovM.needNode}
                    onChange={(e) => setOvM({ ...ovM, needNode: Math.max(0, +e.target.value || 0) })}
                    darkMode={darkMode}
                  />
                </Field>
                <Field label={t(lang, 'apNeed')} darkMode={darkMode}>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={ovM.needAP}
                    onChange={(e) =>
                      setOvM({
                        ...ovM,
                        needAP: Math.max(0, +e.target.value || 0),
                      })
                    }
                    darkMode={darkMode}
                  />
                </Field>
                <label className={`flex items-center gap-2 p-1 rounded transition-colors ${
                  darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={ovM.start} 
                    onChange={(e) => setOvM({ ...ovM, start: e.target.checked })}
                    className={`w-4 h-4 rounded transition-colors ${
                      darkMode 
                        ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                        : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                    }`}
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>START-NEW</span>
                </label>
                <label className={`flex items-center gap-2 p-1 rounded transition-colors ${
                  darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={ovM.ha} 
                    onChange={(e) => setOvM({ ...ovM, ha: e.target.checked })}
                    className={`w-4 h-4 rounded transition-colors ${
                      darkMode 
                        ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                        : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                    }`}
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>HA</span>
                </label>
                <label className={`flex items-center gap-2 p-1 rounded transition-colors ${
                  darkMode ? 'hover:bg-neutral-700/40' : 'hover:bg-slate-100'
                }`}>
                  <input 
                    type="checkbox" 
                    checked={ovM.wcf} 
                    onChange={(e) => setOvM({ ...ovM, wcf: e.target.checked })}
                    className={`w-4 h-4 rounded transition-colors ${
                      darkMode 
                        ? 'border-neutral-600 text-violet-500 focus:ring-violet-500/50' 
                        : 'border-slate-300 text-violet-600 focus:ring-violet-200'
                    }`}
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>WCF</span>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 gap-4">
                <div className={`rounded-xl border p-4 transition-colors ${themeStyles.cardAlt}`}>
                  <div className={`font-medium mb-3 ${themeStyles.text}`}>{t(lang, 'nodePacks')}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PACK_SIZES.map(size => (
                      <Field key={size} label={`${size}包`} darkMode={darkMode}>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={ovM.nodePacks[size] || 0}
                          onChange={(e) => setOvM(prev => ({
                            ...prev,
                            nodePacks: {
                              ...prev.nodePacks,
                              [size]: Math.max(0, +e.target.value || 0)
                            }
                          }))}
                          darkMode={darkMode}
                        />
                      </Field>
                    ))}
                  </div>
                </div>

                <div className={`rounded-xl border p-4 transition-colors ${themeStyles.cardAlt}`}>
                  <div className={`font-medium mb-3 ${themeStyles.text}`}>{t(lang, 'apPacks')}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PACK_SIZES.map(size => (
                      <Field key={size} label={`${size}包`} darkMode={darkMode}>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={ovM.apPacks[size] || 0}
                          onChange={(e) => setOvM(prev => ({
                            ...prev,
                            apPacks: {
                              ...prev.apPacks,
                              [size]: Math.max(0, +e.target.value || 0)
                            }
                          }))}
                          darkMode={darkMode}
                        />
                      </Field>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`flex justify-between text-sm transition-colors p-3 rounded-xl border ${themeStyles.cardAlt}`}>
                <div>
                  <span className={`font-medium ${themeStyles.text}`}>节点总数:</span> <span className={themeStyles.textMuted}>{
                    PACK_SIZES.reduce((sum, size) => sum + (ovM.nodePacks[size] || 0) * size, 0)
                  }</span>
                </div>
                <div>
                  <span className={`font-medium ${themeStyles.text}`}>AP总数:</span> <span className={themeStyles.textMuted}>{
                    PACK_SIZES.reduce((sum, size) => sum + (ovM.apPacks[size] || 0) * size, 0)
                  }</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      </div>
  );
}
