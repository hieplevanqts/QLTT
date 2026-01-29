/**
 * Design Tokens
 * Reference CSS variables from theme.css
 */

export const tokens = {
  // Spacing (8px base system)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // Radius
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    card: 'var(--radius-card)',
    full: '9999px',
  },

  // Shadows
  shadow: {
    sm: 'var(--elevation-sm)',
    md: '0px 4px 6px -1px rgba(16,24,40,0.1), 0px 2px 4px -1px rgba(16,24,40,0.06)',
    lg: '0px 10px 15px -3px rgba(16,24,40,0.1), 0px 4px 6px -2px rgba(16,24,40,0.05)',
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    drawer: 1030,
    modal: 1040,
    popover: 1050,
    toast: 1060,
  },

  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '1024px',
    laptop: '1280px',
    desktop: '1440px',
  },

  // Typography sizes (from CSS variables)
  fontSize: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
  },

  // Font weights
  fontWeight: {
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  },
} as const;
