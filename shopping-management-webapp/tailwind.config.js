/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Design tokens for consistent colors
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          hover: '#1d4ed8',    // blue-700
          light: '#3b82f6',    // blue-500
          dark: '#1e40af',     // blue-800
        },
        success: {
          DEFAULT: '#16a34a', // green-600
          hover: '#15803d',    // green-700
          light: '#22c55e',    // green-500
        },
        warning: {
          DEFAULT: '#eab308', // yellow-500
          hover: '#ca8a04',    // yellow-600
          light: '#fbbf24',    // yellow-400
        },
        danger: {
          DEFAULT: '#dc2626', // red-600
          hover: '#b91c1c',    // red-700
          light: '#ef4444',    // red-500
        },
      },
      // Consistent minimum heights for touch targets
      minHeight: {
        'touch': '44px',      // Standard touch target
        'touch-lg': '56px',   // Large touch target
      },
      // Consistent box shadows for cards and elevations
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-active': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      // Consistent spacing for layouts
      spacing: {
        'page': '2rem',       // Standard page padding
        'section': '1.5rem',  // Section spacing
      },
    },
  },
  plugins: [],
}