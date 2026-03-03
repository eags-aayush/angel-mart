export default function CartSidebar({ cart, fullData, updateCart, onClose, onCheckout }) {
  const items = Object.keys(cart).map(name => {
    const product = fullData.find(p => p.Product_Name === name)
    return product ? { name, qty: cart[name], price: parseFloat(product.Price.replace('$', '')) } : null
  }).filter(Boolean)

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <div className="cart-sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <h2>Neural Cart</h2>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: 30, color: 'var(--text)', cursor: 'pointer' }}
        >
          ×
        </button>
      </div>

      {items.length === 0 && (
        <p style={{ opacity: 0.5, textAlign: 'center', marginTop: 40 }}>Your cart is empty</p>
      )}

      {items.map(item => (
        <div key={item.name} className="sidebar-item">
          <div className="sidebar-item-info">
            <div><b>{item.name}</b></div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>${item.price.toFixed(2)}</div>
          </div>
          <div className="sidebar-counter">
            <button className="sidebar-btn" onClick={() => updateCart(item.name, -1)}>-</button>
            <span style={{ fontSize: 15, fontWeight: 900 }}>{item.qty}</span>
            <button className="sidebar-btn" onClick={() => updateCart(item.name, 1)}>+</button>
          </div>
        </div>
      ))}

      <button
        className="login-btn"
        style={{ width: '100%', marginTop: 30, padding: 18 }}
        onClick={onCheckout}
        disabled={items.length === 0}
      >
        CHECKOUT · ${total.toFixed(2)}
      </button>
    </div>
  )
}
