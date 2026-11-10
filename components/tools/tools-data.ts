export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  usedCount: number;
}

export interface Category {
  name: string;
  count: number;
}

export const categories: Category[] = [
  { name: "All", count: 8 },
  { name: "Development", count: 3 },
  { name: "Design", count: 2 },
  { name: "Productivity", count: 2 },
  { name: "Utilities", count: 1 },
];

export const tools: Tool[] = [
  {
    id: "1",
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON data with syntax highlighting",
    category: "Development",
    icon: "Code",
    usedCount: 1250,
  },
  {
    id: "2",
    slug: "color-picker",
    name: "Color Picker",
    description: "Pick colors from images or create custom color palettes",
    category: "Design",
    icon: "Eyedropper",
    usedCount: 890,
  },
  {
    id: "3",
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different measurement units",
    category: "Utilities",
    icon: "Ruler",
    usedCount: 640,
  },
  {
    id: "4",
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate secure passwords with customizable options",
    category: "Security",
    icon: "Shield",
    usedCount: 420,
  },
  {
    id: "5",
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file size without losing quality",
    category: "Design",
    icon: "Image",
    usedCount: 780,
  },
  {
    id: "6",
    slug: "markdown-editor",
    name: "Markdown Editor",
    description: "Write and preview markdown in real-time",
    category: "Development",
    icon: "Edit",
    usedCount: 560,
  },
  {
    id: "7",
    slug: "task-tracker",
    name: "Task Tracker",
    description: "Manage your daily tasks and to-do lists",
    category: "Productivity",
    icon: "CheckSquare",
    usedCount: 310,
  },
  {
    id: "8",
    slug: "url-shortener",
    name: "URL Shortener",
    description: "Shorten long URLs for easier sharing",
    category: "Development",
    icon: "Link",
    usedCount: 240,
  },
];

export const getToolBySlug = (slug: string): Tool | undefined => {
  return tools.find((tool) => tool.slug === slug);
};

export const getToolsByCategory = (category: string): Tool[] => {
  if (category === "All") return tools;
  return tools.filter((tool) => tool.category === category);
};