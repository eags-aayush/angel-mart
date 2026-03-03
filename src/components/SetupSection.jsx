import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function SetupSection({ currentUser, onDone }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [preview, setPreview] = useState('assets/logo.png')
  const [base64Photo, setBase64Photo] = useState('')

  const previewImg = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      setPreview(e.target.result)
      setBase64Photo(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const completeSetup = async () => {
    if (!currentUser) return
    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        name: name || currentUser.displayName || 'User',
        email: currentUser.email,
        address,
        photo: base64Photo || currentUser.photoURL || 'assets/logo.png',
        cart: {},
      },
      { merge: true }
    )
    onDone()
  }

  return (
    <section className="section-full">
      <div className="modal-container" style={{ color: '#000' }}>
        <h2>Identity Setup</h2>
        <div style={{ margin: '25px 0' }}>
          <img src={preview} className="p-img-large" alt="preview" />
        </div>
        <label
          className="login-btn"
          style={{
            background: 'var(--card-bg)',
            color: 'var(--text)',
            marginBottom: 15,
            display: 'block',
            padding: 14,
            border: '1.5px solid var(--border)',
            fontSize: 12,
          }}
        >
          📸 SELECT FROM GALLERY
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => previewImg(e.target.files[0])}
          />
        </label>
        <input
          type="text"
          className="log-field"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <textarea
          className="log-field"
          style={{ height: 100, marginBottom: 20 }}
          placeholder="Full Texas Delivery Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <button className="login-btn" style={{ width: '100%', padding: 18 }} onClick={completeSetup}>
          FINALIZE IDENTITY
        </button>
      </div>
    </section>
  )
}
