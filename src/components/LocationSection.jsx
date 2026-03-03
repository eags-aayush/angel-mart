import { useState } from 'react'

export default function LocationSection({ onDone }) {
    const [selectedMode, setSelectedMode] = useState('')
    const [address, setAddress] = useState('')

    const selectLoc = (mode) => {
        setSelectedMode(mode)
    }

    const processLoc = () => {
        if (selectedMode === 'delivery') {
            const addr = address.toLowerCase()
            if (!addr.includes('tx') && !addr.includes('texas')) {
                alert('Denied: Texas only.')
                return
            }
        }
        onDone({ mode: selectedMode, address: selectedMode === 'delivery' ? address : '' })
    }

    return (
        <section className="section-full">
            <div className="modal-container" style={{ color: '#000' }}>
                <h2 style={{ marginBottom: 30 }}>Ready to Sync?</h2>

                <div
                    className={`loc-option${selectedMode === 'instore' ? ' active' : ''}`}
                    onClick={() => selectLoc('instore')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: 17 }}>📍 IN store Pickup</h4>
                        <input type="radio" name="loc" readOnly checked={selectedMode === 'instore'} />
                    </div>
                    <p style={{ fontSize: 12, marginTop: 8, opacity: 0.6 }}>
                        <a
                            href="https://maps.app.goo.gl/svPyY3Trr8PZ4AVS8"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'blue', textDecoration: 'none' }}
                        >
                            View way to store in Google Maps
                        </a>
                    </p>
                </div>

                <div
                    className={`loc-option${selectedMode === 'delivery' ? ' active' : ''}`}
                    onClick={() => selectLoc('delivery')}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: 17 }}>🚚 Texas Delivery</h4>
                        <input type="radio" name="loc" readOnly checked={selectedMode === 'delivery'} />
                    </div>
                    <p style={{ color: 'blue', fontSize: 12, marginTop: 8, opacity: 0.6 }}>
                        In 25 miles radius from Store
                    </p>
                    {selectedMode === 'delivery' && (
                        <div style={{ marginTop: 12 }}>
                            <input
                                type="text"
                                className="log-field"
                                style={{ fontSize: 13, padding: 12 }}
                                placeholder="Confirm Texas Address"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <button
                    className="login-btn loc-continue-btn"
                    style={{ width: '100%', marginTop: 20 }}
                    disabled={!selectedMode}
                    onClick={processLoc}
                >
                    CONTINUE TO STORE
                </button>
            </div>
        </section>
    )
}
