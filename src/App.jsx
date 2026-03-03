import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import { auth, db } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import LoginSection from './components/LoginSection'
import SetupSection from './components/SetupSection'
import LocationSection from './components/LocationSection'
import StoreSection from './components/StoreSection'
import ProfileSection from './components/ProfileSection'
import CartSidebar from './components/CartSidebar'
import CheckoutPage from './components/CheckoutPage'

function App() {
  const navigate = useNavigate()
  const [section, setSection] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [cart, setCart] = useState({})
  const [fullData, setFullData] = useState([])
  const [theme, setTheme] = useState('light')
  const [cartOpen, setCartOpen] = useState(false)
  const [deliveryInfo, setDeliveryInfo] = useState({ mode: '', address: '' })

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          const ud = snap.data()
          setCart(ud.cart || {})
          setUserData(ud)
          setSection('location')
        } else {
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || 'User',
            email: user.email,
            photo: user.photoURL || 'assets/logo.png',
            cart: {},
          })
          setSection('setup')
        }
      } else {
        setCurrentUser(null)
        setSection('login')
      }
    })
    return () => unsub()
  }, [])

  const updateCart = (name, delta) => {
    setCart(prev => {
      const updated = { ...prev }
      updated[name] = (updated[name] || 0) + delta
      if (updated[name] <= 0) delete updated[name]
      if (currentUser) {
        updateDoc(doc(db, 'users', currentUser.uid), { cart: updated }).catch(() => {})
      }
      return updated
    })
  }

  const clearCart = () => {
    setCart({})
    if (currentUser) {
      updateDoc(doc(db, 'users', currentUser.uid), { cart: {} }).catch(() => {})
    }
  }

  const handleLogout = () => signOut(auth)

  const saveProfile = async (updates) => {
    if (!currentUser) return
    await updateDoc(doc(db, 'users', currentUser.uid), updates)
    setUserData(prev => ({ ...prev, ...updates }))
  }

  const handleCheckout = () => {
    setCartOpen(false)
    navigate('/checkout')
  }

  const mainContent = (
    <div>
      {section === 'login' && <LoginSection />}
      {section === 'setup' && (
        <SetupSection currentUser={currentUser} onDone={() => setSection('location')} />
      )}
      {section === 'location' && (
        <LocationSection onDone={(info) => { setDeliveryInfo(info); setSection('store') }} />
      )}
      {section === 'store' && (
        <StoreSection
          currentUser={currentUser}
          userData={userData}
          cart={cart}
          updateCart={updateCart}
          fullData={fullData}
          setFullData={setFullData}
          theme={theme}
          toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          onProfile={() => setSection('profile')}
          onCartOpen={() => setCartOpen(true)}
        />
      )}
      {section === 'profile' && (
        <ProfileSection
          currentUser={currentUser}
          userData={userData}
          onBack={() => setSection('store')}
          onLogout={handleLogout}
          onSave={saveProfile}
        />
      )}
      {cartOpen && (
        <>
          <div className="overlay" onClick={() => setCartOpen(false)} />
          <CartSidebar
            cart={cart}
            fullData={fullData}
            updateCart={updateCart}
            onClose={() => setCartOpen(false)}
            onCheckout={handleCheckout}
          />
        </>
      )}
    </div>
  )

  return (
    <Routes>
      <Route
        path="/checkout"
        element={
          currentUser ? (
            <CheckoutPage
              currentUser={currentUser}
              userData={userData}
              cart={cart}
              fullData={fullData}
              onOrderSuccess={clearCart}
              deliveryInfo={deliveryInfo}
            />
          ) : (
            <LoginSection />
          )
        }
      />
      <Route path="*" element={mainContent} />
    </Routes>
  )
}

export default App
