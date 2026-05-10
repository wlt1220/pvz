export type SoundName =
  | 'plantPlace'
  | 'peaShoot'
  | 'zombieGroan'
  | 'sunCollect'
  | 'explosion'
  | 'zombieDeath'
  | 'waveStart'
  | 'victoryFanfare'
  | 'gameOverSting'

type SoundFn = (ctx: AudioContext, master: GainNode) => void

function plantPlace(ctx: AudioContext, master: GainNode): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(300, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
  osc.connect(gain)
  gain.connect(master)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.1)
}

function peaShoot(ctx: AudioContext, master: GainNode): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08)
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
  osc.connect(gain)
  gain.connect(master)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.08)
}

function zombieGroan(ctx: AudioContext, master: GainNode): void {
  const osc = ctx.createOscillator()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(80, ctx.currentTime)

  lfo.type = 'sine'
  lfo.frequency.setValueAtTime(3, ctx.currentTime)
  lfoGain.gain.setValueAtTime(15, ctx.currentTime)

  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)

  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

  osc.connect(gain)
  gain.connect(master)

  osc.start(ctx.currentTime)
  lfo.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.4)
  lfo.stop(ctx.currentTime + 0.4)
}

function sunCollect(ctx: AudioContext, master: GainNode): void {
  const freqs = [523.25, 659.25, 783.99] // C5, E5, G5
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    const startTime = ctx.currentTime + i * 0.04
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)
    osc.connect(gain)
    gain.connect(master)
    osc.start(startTime)
    osc.stop(startTime + 0.2)
  })
}

function explosion(ctx: AudioContext, master: GainNode): void {
  const bufferSize = ctx.sampleRate * 0.3
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(200, ctx.currentTime)
  filter.Q.setValueAtTime(1, ctx.currentTime)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(master)

  noise.start(ctx.currentTime)
  noise.stop(ctx.currentTime + 0.3)
}

function zombieDeath(ctx: AudioContext, master: GainNode): void {
  const bufferSize = ctx.sampleRate * 0.15
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(500, ctx.currentTime)
  filter.Q.setValueAtTime(2, ctx.currentTime)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(master)

  noise.start(ctx.currentTime)
  noise.stop(ctx.currentTime + 0.15)
}

function waveStart(ctx: AudioContext, master: GainNode): void {
  const notes = [440, 330]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    const startTime = ctx.currentTime + i * 0.2
    gain.gain.setValueAtTime(0.15, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18)
    osc.connect(gain)
    gain.connect(master)
    osc.start(startTime)
    osc.stop(startTime + 0.2)
  })
}

function victoryFanfare(ctx: AudioContext, master: GainNode): void {
  const notes = [261.63, 329.63, 392.0, 523.25] // C4, E4, G4, C5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    const startTime = ctx.currentTime + i * 0.15
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.14)
    osc.connect(gain)
    gain.connect(master)
    osc.start(startTime)
    osc.stop(startTime + 0.15)
  })
}

function gameOverSting(ctx: AudioContext, master: GainNode): void {
  const notes = [261.63, 207.65, 174.61] // C4, Ab3, F3
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    const startTime = ctx.currentTime + i * 0.25
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8)
    osc.connect(gain)
    gain.connect(master)
    osc.start(startTime)
    osc.stop(startTime + 0.8)
  })
}

const soundMap: Record<SoundName, SoundFn> = {
  plantPlace,
  peaShoot,
  zombieGroan,
  sunCollect,
  explosion,
  zombieDeath,
  waveStart,
  victoryFanfare,
  gameOverSting,
}

export function playSound(name: SoundName, ctx: AudioContext, master: GainNode): void {
  const fn = soundMap[name]
  if (fn) {
    fn(ctx, master)
  }
}
