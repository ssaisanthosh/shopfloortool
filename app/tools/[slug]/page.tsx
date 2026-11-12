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
  Image,
  Edit,
  CheckSquare,
  Link2,
} from "lucide-react"
import { use } from "react"

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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Back to all tools
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Tool Detail */}
          <div className="lg:col-span-2">
            <div className="mb-8 flex flex-col gap-6 lg:flex-row">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <Badge variant="category">{tool.category}</Badge>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  {tool.name}
                </h1>
                <Badge variant="count">{tool.usedCount} times used</Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tool Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Category
                  </span>
                  <span className="font-medium">{tool.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Times Used
                  </span>
                  <span className="font-medium">{tool.usedCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Slug</span>
                  <span className="font-mono text-sm">{tool.slug}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">ID</span>
                  <span className="font-mono text-sm">{tool.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Related */}
          <aside className="lg:col-span-1">
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
