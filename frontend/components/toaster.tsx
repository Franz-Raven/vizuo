"use client"

import { Toaster } from "sonner"

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'linear-gradient(135deg, #2A2A2A 0%, #3A3A3A 100%)',
          color: '#E7E7E7',
          border: '1px solid #404040',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          fontWeight: '500',
        },
      }}
    />
  )
}