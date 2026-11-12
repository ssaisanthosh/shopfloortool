import Link from "next/link"
import { getToolBySlug, tools } from "@/components/tools/tools-data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Settings,
  Activity,
  Palette,
  Layout,
  Shield,
  GlobeBanIcon,
  Lock,
  ArrowLeft,
  Share,
} from "lucide-react"
import { BookmarkButton } from "@/components/ui/bookmark-button"
import { ShareButton } from "@/components/tools/share-button"
import dynamic from "next/dynamic"
import { type ComponentType, Suspense } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Development: Settings,
  Design: Palette,
  Productivity: Activity,
  Utilities: Layout,
  Security: Shield,
}

// Map slugs to their respective dynamic components
const toolComponents: Record<string, ComponentType> = {
  "json-formatter": dynamic(() =>
    import("@/components/tools/json-formatter").then((mod) => mod.JsonFormatter)
  ),
  "base64-tool": dynamic(() =>
    import("@/components/tools/base64-tool").then((mod) => mod.Base64Tool)
  ),
  "hash-generator-tool": dynamic(() =>
    import("@/components/tools/hash-generator-tool").then((mod) => mod.HashGenerator)
  ),
}

export function generateStaticParams() {
  return Object.keys(toolComponents).map((slug) => ({ slug }))
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Access slug directly from params (Next.js 16 App Router)
  const { slug } = await params

  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  const Icon = categoryIcons[tool.category] || Settings
  const ToolComponent = toolComponents[slug]

  if (!ToolComponent) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Tool Detail */}
          <div className="lg:col-span-9">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="relative w-full">
                <div className="mb-6 flex items-center gap-4">
                  {/* Back link */}
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to all tools
                  </Link>
                  {/* Back link */}
                  <ShareButton  />
                  <BookmarkButton toolId={tool.id} className="" />
                </div>

                <div className="flex items-start">
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold tracking-tight">
                        {tool.name}
                      </h1>
                      <div className="ml-auto flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="inline-flex w-35 items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
                              <GlobeBanIcon size={14} className="mr-1" />{" "}
                              browser-based
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {" "}
                              The tool is browser-based and does not save/send
                              any data to server or cloud storage.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <p className="mt-1 w-full text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Suspense
                fallback={
                  <Card>
                    <CardHeader>
                      <CardTitle>Loading Tool...</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 animate-pulse rounded-md bg-muted" />
                    </CardContent>
                  </Card>
                }
              >
                <ToolComponent />
              </Suspense>
            </div>
          </div>

          {/* Sidebar: Related */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Related Tools
              </h2>
              <div className="space-y-3">
                {tools
                  .filter(
                    (t: (typeof tools)[number]) =>
                      t.category === tool.category && t.id !== tool.id
                  )
                  .slice(0, 4)
                  .map((t: (typeof tools)[number]) => (
                    <Link
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/50 hover:bg-muted"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {t.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {t.description}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
