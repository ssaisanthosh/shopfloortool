"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button"
import {
  CircleX,
  Check,
  Clipboard,
  Copy,
  Download,
  FileText,
  GlobeBanIcon,
  Trash,
  Upload,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
interface JsonFormatterProps {
  initialJson?: string
  onFormat?: (formattedJson: string) => void
}

/**
 * JSON Formatter component with validation
 * Provides a textarea for JSON input and displays formatted output
 */
export function JsonFormatter({ initialJson }: JsonFormatterProps) {
  const [jsonInput, setJsonInput] = useState(initialJson || "")
  const [formattedJson, setFormattedJson] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatJson = () => {
    setIsLoading(true)
    setError(null)

    try {
      const parsed = JSON.parse(jsonInput)
      const formatted = JSON.stringify(parsed, null, 2)
      setFormattedJson(formatted)
      setIsValid(true)
    } catch (e) {
      setIsValid(false)
      setError("Invalid JSON. Please check the syntax and try again.")
      setFormattedJson(null)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!formattedJson) return

    navigator.clipboard.writeText(formattedJson)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setJsonInput(event.target?.result as string)
      setError(null)
      setIsValid(null)
      setFormattedJson(null)
    }
    reader.readAsText(file)
  }

  const handleSample = () => {
    setJsonInput(`
      {
        "name": "Shop Floor Tool",
        "version": "1.0.0",
        "modules": [
          "inventory",
          "production",
          "quality"
        ]
      }
    `)
    setError(null)
    setIsValid(null)
    setFormattedJson(null)
  }

  const handleClear = () => {
    setJsonInput("")
    setFormattedJson(null)
    setError(null)
    setIsValid(null)
  }

  const handleEncode = () => {
    setIsLoading(true)
    setError(null)
    try {
      const encoded = btoa(unescape(encodeURIComponent(jsonInput)))
      setFormattedJson(encoded)
      setIsValid(true)
    } catch {
      setIsValid(false)
      setError("Failed to encode. Input is not valid.")
      setFormattedJson(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecode = () => {
    setIsLoading(true)
    setError(null)
    try {
      const decoded = decodeURIComponent(escape(atob(jsonInput)))
      setFormattedJson(decoded)
      setIsValid(true)
    } catch {
      setIsValid(false)
      setError("Failed to decode. Input is not valid base64.")
      setFormattedJson(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!formattedJson) return
    const blob = new Blob([formattedJson], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "result.txt"
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

  const inputSize = getByteSize(jsonInput)
  const resultSize = getByteSize(formattedJson || "")

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex gap-4">
          <div className="min-w-0 flex-1">
            <div className="mt-5 mb-2">
              <div className="mb-2 flex items-center gap-2">
                <label className="block min-w-0 flex-1 text-sm font-medium">
                  Text
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
                className="h-80"
                placeholder="Type your message here."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
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
              <Textarea readOnly className="h-80" value={formattedJson || ""} />
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
            onClick={handleEncode}
            disabled={isLoading}
          >
            {isLoading ? "Encoding..." : "Encode"}
          </Button>
          <Button
            className="ml-3 pt-3 pr-8 pb-3 pl-8 text-xs"
            onClick={handleDecode}
            disabled={isLoading}
          >
            {isLoading ? "Decoding..." : "Decode"}
          </Button>
          <div className="mt-1">
            <Field orientation="horizontal">
              <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
              <FieldLabel htmlFor="terms-checkbox-basic">
                URL Safe Base64 Encoding
              </FieldLabel>
            </Field>
          </div>
          {jsonInput ? (
            <div className="mt-1 ml-auto">
              <span
                className={`ml-auto inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${error ? "border-red-500/30 bg-red-500/10 text-red-600" : "border-green-500/30 bg-green-500/10 text-green-600"}`}
              >
                {error ? (
                  <CircleX size={14} className="mr-1" />
                ) : (
                  <Check size={14} className="mr-1" />
                )}
              </span>
            </div>
          ) : null}
        </div>

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
