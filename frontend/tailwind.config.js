/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'appa': '#4F46E5', // Indigo
        'appb': '#059669', // Emerald
        'appc': '#D97706', // Amber
        'mcp': '#DC2626',  // Red
        'background': '#0F172A', // Slate 900
        'foreground': '#F3F4F6', // Gray 100
        'dark': '#1E293B',  // Slate 800
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      typography: ({ theme }) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray[300]'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.blue[400]'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-bullets': theme('colors.gray[600]'),
            '--tw-prose-quotes': theme('colors.gray[100]'),
            '--tw-prose-code': theme('colors.white'),
            '--tw-prose-hr': theme('colors.gray[700]'),
            '--tw-prose-th-borders': theme('colors.gray[600]'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    {
      pattern: /^(text|bg|border|stroke|fill)-(appa|appb|appc|mcp)/,
      variants: ['hover', 'focus', 'group-hover'],
    },
    {
      pattern: /^bg-(red|green|yellow)-500$/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /^bg-(appa|appb|appc|mcp)\/10$/,
    },
    'animate-pulse-slow',
    'prose-invert',
  ],
}
