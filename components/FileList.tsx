'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DownloadIcon, TrashIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

export default function FileList() {
  const [files, setFiles] = useState<any[]>([])

  const fetchFiles = useCallback(async () => {
    const { data, error } = await supabase.storage.from('documents').list()
    if (data) setFiles(data)
    if (error) console.error('Error fetching files:', error)
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleDownload = async (path: string) => {
    const { data, error } = await supabase.storage.from('documents').download(path)
    if (error) {
      console.error('Error downloading file:', error)
    } else if (data) {
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = path.split('/').pop() || 'download'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleDelete = async (path: string) => {
    const { error } = await supabase.storage.from('documents').remove([path])
    if (error) {
      console.error('Error deleting file:', error)
    } else {
      await fetchFiles()
    }
  }

  return (
    <Card className="w-full bg-green-50 bg-opacity-70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-800">Archivos Subidos</CardTitle>
        <CardDescription className="text-green-600">Lista de todos los archivos en el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Nombre</TableHead>
                <TableHead className="font-bold">Tamaño</TableHead>
                <TableHead className="font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file, index) => (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TableCell className="max-w-[200px] truncate">{file.name}</TableCell>
                  <TableCell>{Math.round(file.metadata.size / 1024)} KB</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" onClick={() => handleDownload(file.name)} className="bg-green-300 hover:bg-green-400 text-green-800">
                          <DownloadIcon className="mr-2 h-4 w-4" /> Descargar
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(file.name)} className="bg-red-300 hover:bg-red-400 text-red-800">
                          <TrashIcon className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

