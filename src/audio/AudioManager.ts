import { playSound, SoundName } from './sounds'

const MUTE_STORAGE_KEY = 'pvz-audio-muted'

class AudioManager {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private _muted: boolean = false
  private _volume: number = 1
  private resumed = false

  constructor() {
    this._muted = this.loadMuteState()
  }

  private loadMuteState(): boolean {
    try {
      return localStorage.getItem(MUTE_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  }

  private saveMuteState(): void {
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, String(this._muted))
    } catch {
      // Ignore localStorage errors
    }
  }

  private ensureContext(): { ctx: AudioContext; master: GainNode } | null {
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext()
        this.masterGain = this.ctx.createGain()
        this.masterGain.connect(this.ctx.destination)
        this.masterGain.gain.value = this._muted ? 0 : this._volume
      } catch {
        return null
      }
    }
    return { ctx: this.ctx, master: this.masterGain! }
  }

  /** Call on first user interaction to satisfy browser autoplay policy */
  resumeContext(): void {
    if (this.resumed) return
    this.resumed = true
    const result = this.ensureContext()
    if (result && result.ctx.state === 'suspended') {
      result.ctx.resume()
    }
  }

  play(name: SoundName): void {
    if (this._muted) return
    const result = this.ensureContext()
    if (!result) return
    const { ctx, master } = result
    if (ctx.state === 'suspended') return
    playSound(name, ctx, master)
  }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v))
    if (this.masterGain && !this._muted) {
      this.masterGain.gain.value = this._volume
    }
  }

  getVolume(): number {
    return this._volume
  }

  toggleMute(): void {
    this._muted = !this._muted
    this.saveMuteState()
    if (this.masterGain) {
      this.masterGain.gain.value = this._muted ? 0 : this._volume
    }
  }

  isMuted(): boolean {
    return this._muted
  }

  getContext(): AudioContext | null {
    return this.ctx
  }

  getMasterGain(): GainNode | null {
    return this.masterGain
  }
}

export const audioManager = new AudioManager()
export { AudioManager }
