"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tool } from "@/components/tools/tools-data"
import {
  Shield,
  CheckSquare,
  Code,
  Edit,
  Eye,
  Flame,
  Image,
  Link2,
  Ruler,
  Play,
  type LucideIcon,
} from "lucide-react"

interface ToolCardProps {
  tool: Tool
}

// Map icon names from tools-data to lucide-react components
const iconMap: Record<string, LucideIcon> = {
  Eye,
  Shield,
  CheckSquare,
  Code,
  Edit,
  Flame,
  Image,
  Link2,
  Ruler,
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || Eye

  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <Card
        className={cn(
          "relative w-full cursor-pointer transition-all hover:border-primary/50"
        )}
      >
        {tool.new && (
          <Badge
            variant="new"
            className="absolute top-2 right-2 z-10 flex items-center gap-1"
          >
            <Flame className="h-5 w-5" />
          </Badge>
        )}

        <CardHeader className="pt-6 pb-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <IconComponent className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{tool.name}</CardTitle>
            </div>
          </div>
          <div className="mb-2">
            <Badge variant="category">{tool.category}</Badge>
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {tool.description}
          </p>
        </CardHeader>
        <CardFooter>
          <Badge variant="count">{tool.usedCount} uses</Badge>{" "}
          <Play className="absolute right-4 bottom-4 z-10 flex h-5 w-5 items-center gap-1" />
        </CardFooter>
      </Card>
    </Link>
  )
}
