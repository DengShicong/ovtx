export default function Segmented({ options, value, onChange, size='md' }) {
  return (
    <div className="seg">
      {options.map(o=>(
        <button
          key={o.value}
          className={`${value===o.value?'active':''} ${size==='sm'?'text-xs':''}`}
          onClick={()=>onChange(o.value)}
        >{o.label}</button>
      ))}
    </div>
  )
}
