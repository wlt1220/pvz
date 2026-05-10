import { lazy, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import HUD from './components/ui/HUD'
import PlantBar from './components/ui/PlantBar'
import StartScreen from './components/ui/StartScreen'
import CountdownOverlay from './components/ui/CountdownOverlay'
import AchievementPopup from './components/ui/AchievementPopup'
import WaveAnnouncement from './components/ui/WaveAnnouncement'
import FPSCounter from './components/ui/FPSCounter'
import LoadingScreen from './components/ui/LoadingScreen'
import Tutorial from './components/ui/Tutorial'
import { useGameLoop } from './store/useGameLoop'
import { useGameStore } from './store/gameStore'
import { useAudioTriggers } from './audio/useAudioTriggers'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { GamePhase } from './game/types'

const LevelSelect = lazy(() => import('./components/ui/LevelSelect'))
const PauseMenu = lazy(() => import('./components/ui/PauseMenu'))
const GameOverScreen = lazy(() => import('./components/ui/GameOverScreen'))
const AchievementGallery = lazy(() => import('./components/ui/AchievementGallery'))

function GameCanvas() {
  return (
    <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
      <Scene />
    </Canvas>
  )
}

function App() {
  useGameLoop()
  useAudioTriggers()
  useKeyboardShortcuts()
  const gamePhase = useGameStore((s) => s.gamePhase)
  const showCountdown = useGameStore((s) => s.showCountdown)
  const showAchievements = useGameStore((s) => s.showAchievements)
  const showTutorial = useGameStore((s) => s.showTutorial)

  const showCanvas =
    gamePhase === GamePhase.playing ||
    gamePhase === GamePhase.paused ||
    gamePhase === GamePhase.won ||
    gamePhase === GamePhase.lost

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {showCanvas && <GameCanvas />}

      {gamePhase === GamePhase.menu && !showAchievements && <StartScreen />}
      {gamePhase === GamePhase.menu && showAchievements && (
        <Suspense fallback={<LoadingScreen />}>
          <AchievementGallery />
        </Suspense>
      )}
      {gamePhase === GamePhase.levelSelect && (
        <Suspense fallback={<LoadingScreen />}>
          <LevelSelect />
        </Suspense>
      )}

      {(gamePhase === GamePhase.playing || gamePhase === GamePhase.paused) && (
        <>
          <HUD />
          <PlantBar />
        </>
      )}

      {gamePhase === GamePhase.paused && (
        <Suspense fallback={<LoadingScreen />}>
          <PauseMenu />
        </Suspense>
      )}

      {gamePhase === GamePhase.playing && showCountdown && <CountdownOverlay />}

      {(gamePhase === GamePhase.won || gamePhase === GamePhase.lost) && (
        <Suspense fallback={<LoadingScreen />}>
          <GameOverScreen />
        </Suspense>
      )}

      {gamePhase === GamePhase.playing && <WaveAnnouncement />}

      <AchievementPopup />
      {gamePhase === GamePhase.playing && showTutorial && <Tutorial />}
      <FPSCounter />
    </div>
  )
}

export default App
