import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import Header from '../layout/Header'
import CategoryNav from '../layout/CategoryNav'
import Footer from '../layout/Footer'
import ProductCard from '../ui/ProductCard'
import CategoryCard from '../ui/CategoryCard'
import AgeGateModal from '../ui/AgeGateModal'

export default function StorePage() {
  const {
    currentCat, search, renderedItems,
    categories, sentinelRef,
    filterByCat, handleSearch, resetToHome,
  } = useProducts()

  const [ageVerified, setAgeVerified] = useState(false)
  const [pendingCat, setPendingCat]   = useState(null)

  const handleCatClick = (cat) => {
    const isAlcohol = cat.toLowerCase() === 'alcohol'
    if (isAlcohol && !ageVerified) {
      setPendingCat(cat)
    } else {
      filterByCat(cat)
    }
  }

  return (
    <div className="store-section">
      <Header search={search} onSearch={handleSearch} onReset={resetToHome} />
      <CategoryNav categories={categories} currentCat={currentCat} onSelect={handleCatClick} />

      <div className={`amazon-grid-layout ${currentCat === 'ALL' ? 'amazon-grid-layout--all' : 'amazon-grid-layout--cat'}`}>
        {renderedItems.map((item, idx) => {
          const isFull = currentCat === 'ALL' && (idx + 1) % 5 === 0
          if (item._type === 'category') {
            return (
              <CategoryCard
                key={item.cat}
                cat={item.cat}
                isFull={isFull}
                onClick={() => handleCatClick(item.cat)}
              />
            )
          }
          return <ProductCard key={item.Product_Name + idx} product={item} isFull={isFull} />
        })}
      </div>

      <div id="sentinel" ref={sentinelRef} />
      <Footer />

      {pendingCat && (
        <AgeGateModal
          onConfirm={() => { setAgeVerified(true); filterByCat(pendingCat); setPendingCat(null) }}
          onDeny={() => setPendingCat(null)}
        />
      )}
    </div>
  )
}
