import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import HUD from './components/ui/HUD'
import PlantBar from './components/ui/PlantBar'
import SunCollector from './components/ui/SunCollector'
import StartScreen from './components/ui/StartScreen'
import LevelSelect from './components/ui/LevelSelect'
import GameOverScreen from './components/ui/GameOverScreen'
import { useGameLoop } from './store/useGameLoop'
import { useGameStore } from './store/gameStore'
import { GamePhase } from './game/types'

function PauseOverlay() {
  const resumeGame = useGameStore((s) => s.resumeGame)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: '42px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          Paused
        </h2>
        <button
          onClick={resumeGame}
          style={{
            padding: '16px 48px',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#fff',
            background: '#4caf50',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minHeight: '60px',
          }}
        >
          Resume
        </button>
      </div>
    </div>
  )
}

function GameCanvas() {
  return (
    <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
      <Scene />
      <SunCollector />
    </Canvas>
  )
}

function App() {
  useGameLoop()
  const gamePhase = useGameStore((s) => s.gamePhase)

  const showCanvas =
    gamePhase === GamePhase.playing ||
    gamePhase === GamePhase.paused ||
    gamePhase === GamePhase.won ||
    gamePhase === GamePhase.lost

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {showCanvas && <GameCanvas />}

      {gamePhase === GamePhase.menu && <StartScreen />}
      {gamePhase === GamePhase.levelSelect && <LevelSelect />}

      {(gamePhase === GamePhase.playing || gamePhase === GamePhase.paused) && (
        <>
          <HUD />
          <PlantBar />
        </>
      )}

      {gamePhase === GamePhase.paused && <PauseOverlay />}

      {(gamePhase === GamePhase.won || gamePhase === GamePhase.lost) && (
        <GameOverScreen />
      )}
    </div>
  )
}

export default App
