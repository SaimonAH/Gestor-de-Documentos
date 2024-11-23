'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion'

export default function Statistics() {
  const [totalFiles, setTotalFiles] = useState(0)
  const [totalSize, setTotalSize] = useState(0)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    const { data, error } = await supabase.storage.from('documents').list()
    if (data) {
      setTotalFiles(data.length)
      setTotalSize(data.reduce((acc, file) => acc + file.metadata.size, 0))
    }
    if (error) console.error('Error fetching statistics:', error)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-purple-50 bg-opacity-70 backdrop-blur-sm text-purple-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Total de Archivos</CardTitle>
            <CardDescription className="text-purple-600">Número de archivos en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalFiles}</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-pink-50 bg-opacity-70 backdrop-blur-sm text-pink-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Espacio Utilizado</CardTitle>
            <CardDescription className="text-pink-600">Tamaño total de los archivos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{(totalSize / (1024 * 1024)).toFixed(2)} MB</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

