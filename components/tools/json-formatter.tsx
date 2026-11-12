"use client";

import { useState } from "react";
import { Code } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JsonFormatterProps {
  initialJson?: string;
  onFormat?: (formattedJson: string) => void;
}

/**
 * JSON Formatter component with validation
 * Provides a textarea for JSON input and displays formatted output
 */
export function JsonFormatter({ initialJson }: JsonFormatterProps) {
  const [jsonInput, setJsonInput] = useState(initialJson || "");
  const [formattedJson, setFormattedJson] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatJson = () => {
    setIsLoading(true);
    setError(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
      setError("Invalid JSON. Please check the syntax and try again.");
      setFormattedJson(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!formattedJson) return;

    navigator.clipboard.writeText(formattedJson);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-3">
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">JSON Formatter</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {isValid === true ? "Valid" : isValid === false ? "Invalid" : "Pending"}
          </Badge>
        </CardFooter>
      </CardHeader>

      <CardContent>
        {/* Input Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            JSON Input
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON here..."
            rows={6}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm "
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mb-4">
          <Button onClick={formatJson} disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <span className="align-middle" />
                Formatting...
              </>
            ) : (
              "Format JSON"
            )}
          </Button>
          <Button onClick={copyToClipboard} disabled={!formattedJson} variant="outline" className="flex-1">
            <Code className="h-4 w-4 mr-1" /> Copy
          </Button>
        </div>

        {/* Validation Status */}
        {isValid !== null && (
          <div className="mb-4 p-3 rounded-md" style={{ background: isValid ? "var(--primary/10)" : "var(--destructive/10)" }}>
            <p className="text-sm">
              {isValid ? "✓" : "✗"} {isValid ? "Valid JSON" : "Invalid JSON format"}
            </p>
          </div>
        )}

        {/* Formatted Output */}
        {formattedJson && (
          <div className="mt-4 p-4 rounded-md border" style={{
            borderColor: isValid ? "var(--primary)" : "var(--border)",
            background: isValid ? "var(--primary/5)" : "var(--background)",
          }}>
            <pre className="self-select overflow-x-auto">
              <code className="text-sm whitespace-pre-wrap text-muted-foreground">
                {formattedJson}
              </code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}