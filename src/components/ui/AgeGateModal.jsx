export default function AgeGateModal({ onConfirm, onDeny }) {
  return (
    <div className="age-gate-overlay">
      <div className="age-gate-modal">
        <div className="age-gate-icon">🍺</div>
        <h2 className="age-gate-title">Age Verification</h2>
        <p className="age-gate-desc">
          This section contains alcohol products.<br />
          You must be 21 or older to continue.
        </p>
        <button className="age-gate-btn age-gate-yes" onClick={onConfirm}>
          ✅ I'm 21+ Years Old
        </button>
        <button className="age-gate-btn age-gate-no" onClick={onDeny}>
          ❌ No, I'm Not
        </button>
      </div>
    </div>
  )
}
