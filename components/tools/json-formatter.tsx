"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button"
import {
  CircleX,
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
                  onClick={formatJson}
                  disabled={isLoading}
                >
                  <Upload /> Upload
                </Button>

                <Button
                  variant="outline"
                  onClick={formatJson}
                  disabled={isLoading}
                >
                  <FileText /> Sample
                </Button>
              </div>
              <Textarea
                className="h-80"
                placeholder="Type your message here."
              />
              <div className="mt-2 flex gap-2">
                <span className="text-xs text-muted-foreground">Size: 12B</span>
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
                  onClick={formatJson}
                  disabled={isLoading}
                >
                  <Download /> Download
                </Button>
                <Button
                  variant="outline"
                  onClick={formatJson}
                  disabled={isLoading}
                >
                  <Copy /> Copy
                </Button>
              </div>
              <Textarea readOnly className="h-80" />
              <div className="mt-2 flex gap-2">
                <span className="text-xs text-muted-foreground">Size: 12B</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2 pt-4">
          <div className="">
            {" "}
            <Button
              className="pt-3 pr-8 pb-3 pl-8 text-xs"
              onClick={formatJson}
              disabled={isLoading}
            >
              {isLoading ? "Encoding..." : "Encode"}
            </Button>
            <Button
              className="ml-3 pt-3 pr-8 pb-3 pl-8 text-xs"
              onClick={formatJson}
              disabled={isLoading}
            >
              {isLoading ? "Decoding..." : "Decode"}
            </Button>
          </div>
          <div className="mt-1">
            <Field orientation="horizontal">
              <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
              <FieldLabel htmlFor="terms-checkbox-basic">
                URL Safe Base64 Encoding
              </FieldLabel>
            </Field>
          </div>

          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600">
            <CircleX size={14} className="mr-1" /> browser-based
          </span>
          
        </div>
      </CardContent>
    </Card>
  )
}
