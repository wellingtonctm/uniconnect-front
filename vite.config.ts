import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const apiUrl = process.env.VITE_API_URL;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __API_URL__: JSON.stringify(apiUrl)
  }
})
