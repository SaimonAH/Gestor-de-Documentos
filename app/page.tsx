'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Auth from '@/components/Auth'
import FileUpload from '@/components/FileUpload'
import FileList from '@/components/FileList'
import Statistics from '@/components/Statistics'
import { Button } from "@/components/ui/button"

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleUploadSuccess = useCallback(() => {
    setKey(prevKey => prevKey + 1)
  }, [])

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <Auth />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.header 
          className="flex flex-col md:flex-row justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-blue-800 mb-4 md:mb-0">Gestor de Documentos PYME</h1>
          <Button onClick={() => supabase.auth.signOut()} className="bg-red-300 hover:bg-red-400 text-red-800">
            Cerrar Sesión
          </Button>
        </motion.header>
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <Statistics key={`statistics-${key}`} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FileList key={`file-list-${key}`} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

