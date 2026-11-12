"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"

export function ShareButton() {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const url = window.location.href
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch (err) {
      console.error("Share failed:", err)
    } finally {
      setTimeout(() => setIsSharing(false), 1000)
    }
  }

  return (
    <Button className="ml-auto" variant="outline" onClick={handleShare} disabled={isSharing}>
      <Share className="mr-1" />
      {isSharing ? "Sharing..." : "Share"}
    </Button>
  )
}