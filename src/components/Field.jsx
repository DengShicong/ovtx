export function Field({ label, children, className='' }) {
  return (
    <div className={className}>
      <div className="label mb-1">{label}</div>
      {children}
    </div>
  )
}
