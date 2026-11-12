"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  CircleX,
  Check,
  Copy,
  Download,
  FileText,
  Trash,
  Upload,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

interface HashAlgorithm {
  name: string
  algorithm: string
}

export interface HashToolProps {
  initialHash?: string
}

/**
 * Hash Generator tool with Web Crypto API
 * Supports SHA-1, SHA-256, SHA-384, SHA-512
 * Calculation uses the browser's Web Crypto API for proper cryptographic hashing
 */
export function HashGenerator({ initialHash }: HashToolProps) {
  const [inputValue, setInputValue] = useState(initialHash || "")
  const [generatedHash, setGeneratedHash] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("SHA-256")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hashAlgorithms: HashAlgorithm[] = [
    { name: "SHA-1", algorithm: "SHA-1" },
    { name: "SHA-256", algorithm: "SHA-256" },
    { name: "SHA-384", algorithm: "SHA-384" },
    { name: "SHA-512", algorithm: "SHA-512" },
  ]

  // Convert hashAlgorithms to Select items format
  const selectItems = hashAlgorithms.map((algo) => ({
    value: algo.algorithm,
    label: `${algo.name}`,
  }))

  const generateHash = async (text: string, algorithm: string) => {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(text)

      const hashBuffer = await crypto.subtle.digest(algorithm, data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

      return hashHex
    } catch (err) {
      console.error("Hash generation error:", err)
      return null
    }
  }
  const copyToClipboard = () => {
    if (!generatedHash) return

    navigator.clipboard.writeText(generatedHash)
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setInputValue(event.target?.result as string)
      setError(null)
      setIsValid(null)
      setGeneratedHash(null)
    }
    reader.readAsText(file)
  }

  const handleSample = () => {
    const sampleText = `Sample data for ${selectedAlgorithm}: ${Math.random().toString(36).substring(2, 15)}`
    generateHash(sampleText, selectedAlgorithm).then((hash) => {
      if (hash) {
        setInputValue(sampleText)
        setGeneratedHash(hash)
        setIsValid(true)
        setError(null)
      }
    })
  }

  const handleClear = () => {
    setInputValue("")
    setGeneratedHash(null)
    setError(null)
    setIsValid(null)
  }

  const handleGenerate = async () => {
    if (!inputValue.trim()) {
      setError("")
      setIsValid(false)
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const algorithm = hashAlgorithms.find(
        (a) => a.algorithm === selectedAlgorithm
      )
      if (!algorithm) {
        setError("Invalid algorithm selected")
        setIsValid(false)
        return
      }

      const hash = await generateHash(inputValue, algorithm.algorithm)
      if (hash) {
        setGeneratedHash(hash)
        setIsValid(true)
      }
    } catch (err) {
      setIsValid(false)
      setError("Failed to generate hash. Please try again.")
      setGeneratedHash(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!generatedHash) return
    const blob = new Blob([generatedHash], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `hash-${selectedAlgorithm.toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getByteSize = (text: string): string => {
    if (!text) return "0B"
    const len = text.length
    if (len < 1024) return `${len}B`
    return `${(len / 1024).toFixed(2)}KB`
  }

  const inputSize = getByteSize(inputValue)
  const resultSize = getByteSize(generatedHash || "")
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex gap-4">
          <div className="min-w-0 flex-1">
            <div className="mt-5 mb-2">
               <div className="mb-2 flex items-center gap-2">
                <label className="block min-w-0 flex-1 text-sm font-medium">
                  Hash Algorithm
                </label>
                <Select
                  value={selectedAlgorithm}
                  onValueChange={(value) =>
                    setSelectedAlgorithm(value as string)
                  }
                >
                  <SelectTrigger className="w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {selectItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <label className="block min-w-0 flex-1 text-sm font-medium">
                  Text to Hash
                </label>

                <Button
                  variant="outline"
                  onClick={handleUpload}
                  disabled={isLoading}
                >
                  <Upload /> Upload
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  <Trash /> Clear
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSample}
                  disabled={isLoading}
                >
                  <FileText /> Sample
                </Button>
              </div>
             
              <Textarea
                className="h-71 text-[12px] md:text-[12px]"
                placeholder="Enter text to hash..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <span className="text-xs text-muted-foreground">
                  Size: {inputSize}
                </span>
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-2">
                <label className="block min-w-0 flex-1 text-sm font-medium">
                  Result
                </label>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isLoading}
                >
                  <Download /> Download
                </Button>

                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  disabled={isLoading}
                >
                  <Copy /> Copy
                </Button>
              </div>
              <Textarea readOnly className="h-80" value={generatedHash || ""} />
              <div className="mt-2 flex gap-2">
                <span className="text-xs text-muted-foreground">
                  Size: {resultSize}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <Button
            className="pt-3 pr-8 pb-3 pl-8 text-xs"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
          <div className="mt-1 ml-auto">
            <span
              className={`ml-auto inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${isValid === false ? "border-red-500/30 bg-red-500/10 text-red-600" : isValid === true ? "border-green-500/30 bg-green-500/10 text-green-600" : "border-gray-200 bg-gray-100 text-gray-600"}`}
            >
              {error ? (
                <CircleX size={14} className="mr-1" />
              ) : generatedHash ? (
                <Check size={14} className="mr-1" />
              ) : (
                <Info size={14} className="mr-1" />
              )}
              {error || generatedHash
                ? error || `${selectedAlgorithm} completed`
                : ""}
            </span>
          </div>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.txt,*/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </CardContent>
    </Card>
  )
}
