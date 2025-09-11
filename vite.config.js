import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 分离Three.js相关依赖
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          // 分离Chart.js相关依赖
          'charts': ['chart.js', 'react-chartjs-2'],
          // 分离动画库
          'animation': ['framer-motion']
        }
      }
    },
    // 提高chunk大小警告阈值
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  }
})
