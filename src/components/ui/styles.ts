import type { CSSProperties } from 'react'

export const FONT_FAMILY = 'sans-serif'

export const buttonBase: CSSProperties = {
  minHeight: '48px',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontFamily: FONT_FAMILY,
  fontSize: 'clamp(16px, 3vw, 22px)',
  padding: '12px 24px',
}

export const overlayBase: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: FONT_FAMILY,
}

export const cardBase: CSSProperties = {
  borderRadius: '16px',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}
