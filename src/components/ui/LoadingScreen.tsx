function LoadingScreen() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #66bb6a, #2e7d32)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        zIndex: 9999,
      }}
    >
      <h1
        style={{
          color: '#fff',
          fontSize: 'clamp(28px, 6vw, 48px)',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
          marginBottom: '24px',
        }}
      >
        Plants vs Zombies 3D
      </h1>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#fff',
              animation: `pvz-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pvz-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-16px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen
