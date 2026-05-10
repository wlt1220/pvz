import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import HUD from './components/ui/HUD'
import PlantBar from './components/ui/PlantBar'
import StartScreen from './components/ui/StartScreen'
import LevelSelect from './components/ui/LevelSelect'
import GameOverScreen from './components/ui/GameOverScreen'
import PauseMenu from './components/ui/PauseMenu'
import CountdownOverlay from './components/ui/CountdownOverlay'
import { useGameLoop } from './store/useGameLoop'
import { useGameStore } from './store/gameStore'
import { GamePhase } from './game/types'

function GameCanvas() {
  return (
    <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
      <Scene />
    </Canvas>
  )
}

function App() {
  useGameLoop()
  const gamePhase = useGameStore((s) => s.gamePhase)
  const showCountdown = useGameStore((s) => s.showCountdown)

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

      {gamePhase === GamePhase.paused && <PauseMenu />}

      {gamePhase === GamePhase.playing && showCountdown && <CountdownOverlay />}

      {(gamePhase === GamePhase.won || gamePhase === GamePhase.lost) && (
        <GameOverScreen />
      )}
    </div>
  )
}

export default App
