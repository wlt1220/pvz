import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

const STEPS = [
  {
    text: 'Collect sun to buy plants!',
    arrowStyle: { top: '60px', left: '120px' } as React.CSSProperties,
    arrowDirection: 'up' as const,
  },
  {
    text: 'Click a plant card, then click the lawn to place it!',
    arrowStyle: { bottom: '100px', left: '50%', transform: 'translateX(-50%)' } as React.CSSProperties,
    arrowDirection: 'down' as const,
  },
  {
    text: 'Stop the zombies before they reach your house!',
    arrowStyle: { top: '50%', right: '40px', transform: 'translateY(-50%)' } as React.CSSProperties,
    arrowDirection: 'right' as const,
  },
]

function Tutorial() {
  const [step, setStep] = useState(0)
  const dismissTutorial = useGameStore((s) => s.dismissTutorial)

  const handleNext = () => {
    if (step >= STEPS.length - 1) {
      dismissTutorial()
    } else {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    dismissTutorial()
  }

  const current = STEPS[step]
  if (!current) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Arrow indicator */}
      <div
        style={{
          position: 'absolute',
          ...current.arrowStyle,
          fontSize: '48px',
          color: '#ffeb3b',
          textShadow: '0 0 12px rgba(255,235,59,0.8)',
          animation: 'pvz-tutorial-pulse 1s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      >
        {current.arrowDirection === 'up' && '\u2B06'}
        {current.arrowDirection === 'down' && '\u2B07'}
        {current.arrowDirection === 'right' && '\u27A1'}
      </div>

      {/* Instruction box */}
      <div
        style={{
          background: 'linear-gradient(135deg, #43a047, #2e7d32)',
          borderRadius: '20px',
          padding: '28px 36px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          border: '3px solid #76ff03',
        }}
      >
        <p
          style={{
            color: '#fff',
            fontSize: 'clamp(18px, 4vw, 24px)',
            fontWeight: 'bold',
            margin: '0 0 20px 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {current.text}
        </p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '12px',
          }}
        >
          <button
            onClick={handleSkip}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '2px solid rgba(255,255,255,0.5)',
              background: 'rgba(0,0,0,0.3)',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #ffeb3b, #fbc02d)',
              color: '#1a1a2e',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {step >= STEPS.length - 1 ? 'Got it!' : 'Next'}
          </button>
        </div>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i === step ? '#ffeb3b' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pvz-tutorial-pulse {
          0%, 100% { transform: ${current.arrowStyle.transform || ''} scale(1); }
          50% { transform: ${current.arrowStyle.transform || ''} scale(1.2); }
        }
      `}</style>
    </div>
  )
}

export default Tutorial
