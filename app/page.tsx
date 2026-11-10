import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>
            The header with navigation menu and theme toggle is now available.
          </p>
          <p>
            Open the menu on mobile using the hamburger icon, or toggle between
            light and dark themes using the button on the right.
          </p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  );
}
