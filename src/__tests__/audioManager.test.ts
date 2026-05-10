import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Web Audio API before importing AudioManager
function createMockGainNode() {
  return {
    gain: { value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }
}

function createMockOscillatorNode() {
  return {
    type: 'sine',
    frequency: { value: 440, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
  }
}

function createMockAudioContext() {
  return {
    state: 'running' as string,
    currentTime: 0,
    sampleRate: 44100,
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    createGain: vi.fn(() => createMockGainNode()),
    createOscillator: vi.fn(() => createMockOscillatorNode()),
    createBiquadFilter: vi.fn(() => ({
      type: 'bandpass',
      frequency: { value: 350, setValueAtTime: vi.fn() },
      Q: { value: 1, setValueAtTime: vi.fn() },
      connect: vi.fn(),
    })),
    createBuffer: vi.fn((_channels: number, length: number, sampleRate: number) => ({
      getChannelData: () => new Float32Array(length),
      length,
      sampleRate,
    })),
    createBufferSource: vi.fn(() => ({
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).AudioContext = vi.fn(() => createMockAudioContext())

describe('AudioManager', () => {
  let AudioManagerModule: typeof import('../audio/AudioManager')
  let AudioManager: typeof import('../audio/AudioManager').AudioManager

  beforeEach(async () => {
    // Clear localStorage
    localStorage.clear()
    // Reset module to get fresh singleton
    vi.resetModules()
    // Re-setup global mock
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).AudioContext = vi.fn(() => createMockAudioContext())
    AudioManagerModule = await import('../audio/AudioManager')
    AudioManager = AudioManagerModule.AudioManager
  })

  it('starts unmuted by default', () => {
    const manager = new AudioManager()
    expect(manager.isMuted()).toBe(false)
  })

  it('toggleMute flips mute state', () => {
    const manager = new AudioManager()
    expect(manager.isMuted()).toBe(false)
    manager.toggleMute()
    expect(manager.isMuted()).toBe(true)
    manager.toggleMute()
    expect(manager.isMuted()).toBe(false)
  })

  it('setVolume updates volume clamped between 0 and 1', () => {
    const manager = new AudioManager()
    manager.setVolume(0.5)
    expect(manager.getVolume()).toBe(0.5)
    manager.setVolume(1.5)
    expect(manager.getVolume()).toBe(1)
    manager.setVolume(-0.5)
    expect(manager.getVolume()).toBe(0)
  })

  it('persists mute state to localStorage', () => {
    const manager = new AudioManager()
    manager.toggleMute()
    expect(localStorage.getItem('pvz-audio-muted')).toBe('true')
    manager.toggleMute()
    expect(localStorage.getItem('pvz-audio-muted')).toBe('false')
  })

  it('loads mute state from localStorage', () => {
    localStorage.setItem('pvz-audio-muted', 'true')
    const manager = new AudioManager()
    expect(manager.isMuted()).toBe(true)
  })

  it('play() does not throw when muted', () => {
    const manager = new AudioManager()
    manager.toggleMute()
    expect(() => manager.play('plantPlace')).not.toThrow()
  })

  it('play() does not throw when unmuted', () => {
    const manager = new AudioManager()
    manager.resumeContext()
    expect(() => manager.play('peaShoot')).not.toThrow()
  })
})
