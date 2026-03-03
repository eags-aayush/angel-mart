import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from 'firebase/auth'
import { auth, provider } from '../firebase'

export default function LoginSection() {
  const [isRegMode, setIsRegMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = async () => {
    try {
      if (isRegMode) {
        const r = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(r.user)
        alert('Verify email!')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <section className="section-full">
      <div className="modal-container" style={{ color: '#000' }}>
        <img src="assets/logo.png" style={{ height: 75, marginBottom: 25 }} alt="logo" />
        <h1 style={{ marginBottom: 35, letterSpacing: 3, fontWeight: 900 }}>
          {isRegMode ? 'INITIALIZE' : 'ANGEL MART'}
        </h1>
        <input
          type="email"
          className="log-field"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <input
          type="password"
          className="log-field"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <button className="login-btn" style={{ width: '100%', padding: 18 }} onClick={handleAuth}>
          {isRegMode ? 'CREATE ACCOUNT' : 'LOGIN SYSTEM'}
        </button>
        <button className="google-btn" onClick={loginWithGoogle}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/40px-Google_%22G%22_logo.svg.png?_=20230822192911"
            width={20}
            alt="Google"
          />
          Sign in with Google
        </button>
        <p
          style={{ marginTop: 25, fontSize: 14, cursor: 'pointer' }}
          onClick={() => setIsRegMode(m => !m)}
        >
          {isRegMode ? 'Already have an account? ' : 'New to store? '}
          <b style={{ textDecoration: 'underline' }}>
            {isRegMode ? 'Back to Login' : 'Create Account'}
          </b>
        </p>
      </div>
    </section>
  )
}
