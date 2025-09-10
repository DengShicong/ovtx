import { PACK_SIZES } from '../lib/pricing'

export default function OVManualPacks({ title, packs, onChange }) {
  return (
    <div>
      <div className="font-medium text-sm mb-2">{title}</div>
      <div className="grid grid-cols-6 gap-2">
        {PACK_SIZES.map(s=>(
          <div key={s}>
            <div className="label mb-1">{s}</div>
            <input type="number" min="0" step="1"
              className="field"
              value={packs[s]||0}
              onChange={e=>onChange(s, Math.max(0,parseInt(e.target.value||'0',10)))} />
          </div>
        ))}
      </div>
    </div>
  )
}
