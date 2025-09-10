export default function Card({ title, children, right }) {
  return (
    <div className="card p-4">
      {(title || right) && (
        <div className="flex items-center gap-3 mb-2">
          {title && <h3 className="font-bold">{title}</h3>}
          <div className="ml-auto">{right}</div>
        </div>
      )}
      {children}
    </div>
  )
}
