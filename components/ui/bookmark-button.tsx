"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Bookmark, BookmarkCheck } from "lucide-react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

interface BookmarkButtonProps {
  toolId: string
  className?: string
}

export function BookmarkButton({ toolId, className }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarked-tools")
    if (savedBookmarks) {
      const bookmarks = JSON.parse(savedBookmarks)
      setIsBookmarked(bookmarks.includes(toolId))
    }
  }, [toolId])

  const toggleBookmark = () => {
    const newIsBookmarked = !isBookmarked
    setIsBookmarked(newIsBookmarked)

    let bookmarks = []
    const savedBookmarks = localStorage.getItem("bookmarked-tools")
    if (savedBookmarks) {
      bookmarks = JSON.parse(savedBookmarks)
    }

    if (newIsBookmarked) {
      bookmarks.push(toolId)
    } else {
      bookmarks = bookmarks.filter((id: string) => id !== toolId)
    }

    localStorage.setItem("bookmarked-tools", JSON.stringify(bookmarks))
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          onClick={toggleBookmark}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-sm transition-colors hover:bg-muted",
            className
          )}
          aria-label={
            isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
          }
          data-bookmarked={isBookmarked}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-6 w-6 text-primary" strokeWidth={2} />
          ) : (
            <Bookmark
              className="h-6 w-6 text-muted-foreground"
              strokeWidth={1.5}
            />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}</p>
      </TooltipContent>
    </Tooltip>
  )
}

declare global {
  interface Window {
    localStorage: Storage
  }
}
