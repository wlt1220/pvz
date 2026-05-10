import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [0, 10, 10], fov: 50 }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

export default App
