import { motion, AnimatePresence } from 'framer-motion'

export default function TerraList({ items, onChange, onRemove }) {
  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {items.map((it,idx)=>(
          <motion.div
            key={idx}
            initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}
            transition={{ duration:.18 }}
            className="grid grid-cols-[64px_1fr_96px_40px] md:grid-cols-[64px_1fr_120px_40px] gap-2 items-center border border-zinc-200 rounded-lg p-2"
          >
            <div className="font-semibold">{it.series}</div>
            <select className="field" value={it.tier} onChange={e=>onChange(idx,'tier',e.target.value)}>
              <option>BAS</option><option>BIZ</option><option>PRM</option>
            </select>
            <input className="field" type="number" min="0" step="1"
              value={it.qty} onChange={e=>onChange(idx,'qty',Math.max(0,parseInt(e.target.value||'0',10)))} />
            <button className="btn btn-ghost h-9" onClick={()=>onRemove(idx)}>×</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
