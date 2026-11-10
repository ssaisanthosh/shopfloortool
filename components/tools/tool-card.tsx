"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tool } from "@/components/tools/tools-data";
import { LucideProps } from "lucide-react";
import { createElement } from "react";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = createElement(tool.icon as any);

  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <Card
        className={cn(
          "w-72 h-80 hover:border-primary/50 transition-all cursor-pointer",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                {IconComponent}
              </div>
              <CardTitle className="text-base">{tool.name}</CardTitle>
            </div>
            <Badge variant="category">{tool.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </CardHeader>
        <CardFooter>
          <Badge variant="count">{tool.usedCount} uses</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
