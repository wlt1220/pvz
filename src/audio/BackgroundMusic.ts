/**
 * Simple procedural background music using a pentatonic scale.
 * Light, upbeat feel suitable for a kid-friendly tower defense game.
 */

// Pentatonic scale notes (C major pentatonic, octave 4-5)
const NOTES: number[] = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]
const NOTE_DURATION = 0.2 // seconds per note
const PATTERN_LENGTH = 8
const LOOP_INTERVAL = PATTERN_LENGTH * NOTE_DURATION * 1000

class BackgroundMusic {
  private ctx: AudioContext | null = null
  private playing = false
  private intervalId: ReturnType<typeof setInterval> | null = null
  private gainNode: GainNode | null = null

  start(ctx: AudioContext, master: GainNode): void {
    if (this.playing) return
    this.ctx = ctx
    this.playing = true

    this.gainNode = ctx.createGain()
    this.gainNode.gain.value = 0.08
    this.gainNode.connect(master)

    this.playPattern()
    this.intervalId = setInterval(() => {
      if (this.playing) this.playPattern()
    }, LOOP_INTERVAL)
  }

  stop(): void {
    this.playing = false
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (this.gainNode) {
      this.gainNode.disconnect()
    }
    this.gainNode = null
  }

  isPlaying(): boolean {
    return this.playing
  }

  private playPattern(): void {
    if (!this.ctx || !this.gainNode) return
    const ctx = this.ctx
    const now = ctx.currentTime

    // Generate a simple bouncy pattern from the pentatonic scale
    const pattern: number[] = [0, 2, 4, 5, 4, 2, 3, 1]
    for (let i = 0; i < PATTERN_LENGTH; i++) {
      const noteIndex = pattern[i % pattern.length]!
      const freq = NOTES[noteIndex]!
      const startTime = now + i * NOTE_DURATION

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(1, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + NOTE_DURATION - 0.02)

      osc.connect(gain)
      gain.connect(this.gainNode)

      osc.start(startTime)
      osc.stop(startTime + NOTE_DURATION)
    }
  }
}

export const backgroundMusic = new BackgroundMusic()
