'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon, CheckCircledIcon, UploadIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

export default function FileUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setError(null)
      setSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${Date.now()}_${file.name}`, file)

      if (error) throw error

      setSuccess(true)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onUploadSuccess()
    } catch (error: any) {
      setError('Error al subir el archivo: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-blue-50 bg-opacity-70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Subir Archivo</CardTitle>
        <CardDescription>Seleccione un archivo para subir al sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <Label htmlFor="file" className="mt-2 block text-sm font-medium text-gray-700">
              {file ? file.name : 'Haga clic para seleccionar un archivo'}
            </Label>
            <input
              id="file"
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <CheckCircledIcon className="h-4 w-4" />
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>Archivo subido correctamente.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full"
        >
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="w-full bg-blue-300 hover:bg-blue-400 text-blue-800 transition-colors duration-300"
          >
            {uploading ? 'Subiendo...' : 'Subir'}
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  )
}

