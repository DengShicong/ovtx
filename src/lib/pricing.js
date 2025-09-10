// 保留1位小数 + 货币符号
export const fmt1 = (n, sym) =>
  `${sym}${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`

export const YEARS = [1, 3, 5, 7]
export const PACK_SIZES = [1000, 500, 100, 50, 20, 10]

// ---- Terra：WWPL 美元价格表（你提供的表） ----
export const USD_TERRA = {
  // BAS
  'APL-BAS-1':72,'APL-BAS-3':144,'APL-BAS-5':216,'APL-BAS-7':360,
  'APH-BAS-1':96,'APH-BAS-3':192,'APH-BAS-5':288,'APH-BAS-7':480,
  '63-BAS-1':80,'63-BAS-3':160,'63-BAS-5':240,'63-BAS-7':400,
  '64-BAS-1':96,'64-BAS-3':192,'64-BAS-5':288,'64-BAS-7':480,
  '65-BAS-1':96,'65-BAS-3':192,'65-BAS-5':288,'65-BAS-7':480,
  '68-BAS-1':300,'68-BAS-3':600,'68-BAS-5':900,'68-BAS-7':1500,
  '69-BAS-1':576,'69-BAS-3':1152,'69-BAS-5':1728,'69-BAS-7':2880,
  '99-BAS-1':2880,'99-BAS-3':5760,'99-BAS-5':8640,'99-BAS-7':14400,
  // BIZ
  'APL-BIZ-1':98,'APL-BIZ-3':196,'APL-BIZ-5':293,'APL-BIZ-7':489,
  'APH-BIZ-1':149,'APH-BIZ-3':298,'APH-BIZ-5':446,'APH-BIZ-7':744,
  '63-BIZ-1':115,'63-BIZ-3':230,'63-BIZ-5':344,'63-BIZ-7':574,
  '64-BIZ-1':159,'64-BIZ-3':318,'64-BIZ-5':477,'64-BIZ-7':795,
  '65-BIZ-1':170,'65-BIZ-3':337,'65-BIZ-5':510,'65-BIZ-7':850,
  '68-BIZ-1':591,'68-BIZ-3':1182,'68-BIZ-5':1772,'68-BIZ-7':2954,
  '69-BIZ-1':1165,'69-BIZ-3':2329,'69-BIZ-5':3494,'69-BIZ-7':5823,
  '99-BIZ-1':9819,'99-BIZ-3':19638,'99-BIZ-5':29458,'99-BIZ-7':49096,
  // PRM
  'APL-PRM-1':110,'APL-PRM-3':220,'APL-PRM-5':329,'APL-PRM-7':549,
  'APH-PRM-1':169,'APH-PRM-3':338,'APH-PRM-5':508,'APH-PRM-7':846,
  '63-PRM-1':196,'63-PRM-3':392,'63-PRM-5':589,'63-PRM-7':981,
  '64-PRM-1':259,'64-PRM-3':518,'64-PRM-5':778,'64-PRM-7':1296,
  '65-PRM-1':446,'65-PRM-3':893,'65-PRM-5':1339,'65-PRM-7':2232,
  '68-PRM-1':763,'68-PRM-3':1526,'68-PRM-5':2290,'68-PRM-7':3816,
  '69-PRM-1':1816,'69-PRM-3':3632,'69-PRM-5':5449,'69-PRM-7':9081,
  '99-PRM-1':13320,'99-PRM-3':26640,'99-PRM-5':39960,'99-PRM-7':66600
}

// CPL = WWPL × 14（按需转换）
export const CNY_TERRA = new Proxy({}, {
  get(_, k) { return (USD_TERRA[k] || 0) * 14 }
})

// ---- OV2500：WWPL 美元价格 ----
export const USD_OV = {
  START: 1.0,
  HA: 10400.0,
  WCF10: 619.0,
  Node: {10:3432,20:5720,50:11440,100:17160,500:57200,1000:91520},
  AP:   {10:520,20:1040,50:2600,100:4680,500:20800,1000:31200}
}
export const CNY_OV = new Proxy({}, {
  get(_, k) {
    if (k === 'Node' || k === 'AP')
      return new Proxy({}, { get(_2, size){ return (USD_OV[k][size] || 0) * 14 } })
    return (USD_OV[k] || 0) * 14
  }
})

// 符号/表
export const symbol = (lang) => lang === 'wwpl' ? '$ ' : '¥'
export const terraTable = (lang) => lang === 'wwpl' ? USD_TERRA : CNY_TERRA
export const ovTable    = (lang) => lang === 'wwpl' ? USD_OV    : CNY_OV

// Terra 汇总
export const sumTerra = (list, lang) => {
  const t = terraTable(lang)
  const s = {1:0,3:0,5:0,7:0}
  list.forEach(it=>{
    ;[1,3,5,7].forEach(y => { s[y] += (t[`${it.series}-${it.tier}-${y}`] || 0) * (Number(it.qty)||0) })
  })
  return s
}

// OV 自动包分解（贪心）
export const greedyPacks = (need) => {
  const packs = {}
  let n = need|0
  PACK_SIZES.forEach(s=>{
    const c = Math.floor(n/s)
    if(c>0){ packs[s]=(packs[s]||0)+c; n-=c*s }
  })
  if(n>0) packs[10]=(packs[10]||0)+1
  return packs
}

// OV 自动计价
export const priceOVAuto = (ov, lang) => {
  const tbl = ovTable(lang)
  let total = 0
  const lines = []

  let needNode = ov.Nnode|0
  let needAP   = ov.Nap|0
  if (ov.start) { needNode=Math.max(0,needNode-10); needAP=Math.max(0,needAP-10) }

  if (ov.start){ total += tbl.START; lines.push('START-NEW') }
  if (ov.ha)   { total += tbl.HA;    lines.push('HA') }

  if (ov.node){
    const pk = greedyPacks(needNode)
    let t=0,desc=[]
    Object.keys(pk).forEach(s=>{
      const c=pk[s]; if(c>0){ t+=tbl.Node[s]*c; desc.push(`${s}×${c}`) }
    })
    if(t>0){ total+=t; lines.push(`节点包：${desc.join('，')}（免各10：${ov.start?'是':'否'}）`) }
  }
  if (ov.ap){
    const pk = greedyPacks(needAP)
    let t=0,desc=[]
    Object.keys(pk).forEach(s=>{
      const c=pk[s]; if(c>0){ t+=tbl.AP[s]*c; desc.push(`${s}×${c}`) }
    })
    if(t>0){ total+=t; lines.push(`AP 包：${desc.join('，')}（免各10：${ov.start?'是':'否'}）`) }
  }
  if (ov.wcf){
    const est = Math.ceil((ov.Nap||0)/10)
    if(est>0){ total+=tbl.WCF10*est; lines.push(`WCF：${est}（10/包，估算）`) }
  }
  return { total, lines }
}

// OV 手动计价
export const priceOVManual = (ovM, lang) => {
  const tbl = ovTable(lang)
  let total = 0
  const lines = []

  if (ovM.start){ total+=tbl.START; lines.push('START-NEW') }
  if (ovM.ha)   { total+=tbl.HA;    lines.push('HA') }

  let t=0,desc=[]
  PACK_SIZES.forEach(s=>{
    const c=ovM.nodePacks[s]||0; if(c>0){ t+=tbl.Node[s]*c; desc.push(`${s}×${c}`) }
  })
  if(t>0){ total+=t; lines.push(`节点包：${desc.join('，')}`) }

  t=0; desc=[]
  PACK_SIZES.forEach(s=>{
    const c=ovM.apPacks[s]||0; if(c>0){ t+=tbl.AP[s]*c; desc.push(`${s}×${c}`) }
  })
  if(t>0){ total+=t; lines.push(`AP 包：${desc.join('，')}`) }

  if (ovM.wcf){
    const est = Math.ceil((ovM.needAP||0)/10)
    if(est>0){ total+=tbl.WCF10*est; lines.push(`WCF：${est}（10/包，估算）`) }
  }
  return { total, lines }
}
