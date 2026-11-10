import Link from "next/link";
import { getToolBySlug, tools } from "@/components/tools/tools-data";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Activity, Palette, Layout, Shield, Image, Edit, CheckSquare, Link2 } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Development: Settings,
  Design: Palette,
  Productivity: Activity,
  Utilities: Layout,
  Security: Shield,
};

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const Icon = categoryIcons[tool.category] || Settings;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Back to all tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool Detail */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <Badge variant="category">{tool.category}</Badge>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">{tool.name}</h1>
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
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm">Category</span>
                  <span className="font-medium">{tool.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm">Times Used</span>
                  <span className="font-medium">{tool.usedCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm">Slug</span>
                  <span className="font-mono text-sm">{tool.slug}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm">ID</span>
                  <span className="font-mono text-sm">{tool.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Related */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Related Tools
              </h2>
              <div className="space-y-3">
                {tools
                  .filter((t: typeof tools[number]) => t.category === tool.category && t.id !== tool.id)
                  .slice(0, 4)
                  .map((t: typeof tools[number]) => (
                    <Link
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted hover:border-primary/50 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{t.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{t.description}</div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
