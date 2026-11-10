"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ToolCard } from "@/components/tools/tool-card";
import { cn } from "@/lib/utils";
import { categories, tools, getToolsByCategory } from "@/components/tools/tools-data";
import {
  Layout,
  Palette,
  Settings,
  Activity,
  Shield,
  Image,
  Edit,
  CheckSquare,
  Link2,
  List,
  Minimize2,
  Grid,
} from "lucide-react";

interface CategoryItem {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Development: Settings,
  Design: Palette,
  Productivity: Activity,
  Utilities: Layout,
  Security: Shield,
};

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridLayout, setGridLayout] = useState<"1" | "2" | "3">("3");

  const filteredTools = useMemo(() => {
    let result = getToolsByCategory(selectedCategory);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query),
      );
    }
    return result;
  }, [searchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: tools.length };
    tools.forEach((tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
          <p className="mt-1 text-muted-foreground">
            Discover and use our collection of productivity tools
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Category Filter + Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar: Categories */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Categories
              </h2>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.name;
                  const count = categoryCounts[cat.name] || cat.count;
                  const Icon = categoryIcons[cat.name] || Settings;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {cat.name}
                      </div>
                      <span className="ml-auto">
                        <Badge variant={isActive ? "default" : "outline"}>
                          {count}
                        </Badge>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main: Tools Grid */}
          <section className="lg:col-span-9">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
                </h2>
                <Badge variant="outline">{selectedCategory}</Badge>
              </div>
              <div className="flex items-center gap-1">
                {["1", "2", "3"].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setGridLayout(cols as "1" | "2" | "3")}
                    aria-label={`Grid ${cols}x1`}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      gridLayout === cols
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {cols === "1" ? (
                      <List className="h-4 w-4" />
                    ) : cols === "2" ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Grid className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {filteredTools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 opacity-50">
                  <SearchIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No tools found</h3>
                <p className="mt-1 text-muted-foreground">
                  Try adjusting your search or category filter
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  gridLayout === "1" && "grid-cols-1",
                  gridLayout === "2" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2",
                  gridLayout === "3" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                )}
              >
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21 -4.3-4.3" />
    </svg>
  );
}
