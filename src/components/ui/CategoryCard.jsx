export default function CategoryCard({ cat, isFull, onClick }) {
  return (
    <div className={`card category-card${isFull ? ' card-full' : ''}`} onClick={onClick}>
      <div className="img-box">
        <img
          src={`assets/${cat}.png`}
          onError={e => { e.target.src = 'assets/logo.png' }}
          alt={cat}
        />
      </div>
      <b className="category-label">{cat}</b>
    </div>
  )
}
