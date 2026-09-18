/**
 * Tailwind theme extension for MIMENTEHOY
 * Place this file in your project and import/merge into your tailwind.config.js
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#001733',
          600: '#009bb0',
        },
        grad: {
          1: '#009bb0',
          2: '#17aba3',
          3: '#f6a114',
          4: '#fd9b10',
          5: '#ed4a6f',
        },
        neutral: {
          100: '#ffffff',
          200: '#f7fafb',
          700: '#334155',
        }
      },
      backgroundImage: {
        'mimentehoy-gradient': 'linear-gradient(90deg, #009bb0 0%, #17aba3 25%, #f6a114 50%, #fd9b10 75%, #ed4a6f 100%)'
      }
    }
  }
}
