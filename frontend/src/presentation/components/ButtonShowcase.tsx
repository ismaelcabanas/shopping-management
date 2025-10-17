import { Button } from "@/components/ui/button";

export function ButtonShowcase() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Shopping Manager - Shadcn/UI Setup ✅
        </h1>
        <p className="text-muted-foreground">
          Validating Button component with all variants and theming
        </p>
      </div>

      {/* Button Variants */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🛒</Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Shopping Manager Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">➕ Add Item</Button>
            <Button variant="outline">📝 Edit List</Button>
            <Button variant="secondary">🛍️ View Cart</Button>
            <Button variant="destructive">🗑️ Clear All</Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Interactive States</h2>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button
              onClick={() => alert("Button clicked! 🎉")}
              variant="outline"
            >
              Click Me
            </Button>
          </div>
        </div>
      </div>

      {/* Theme Toggle Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Theme Testing</h2>
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            onClick={() => document.documentElement.classList.toggle("dark")}
          >
            🌓 Toggle Dark Mode
          </Button>
          <p className="text-sm text-muted-foreground">
            Test CSS variables and theme switching
          </p>
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">✅ Validation Checklist</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Shadcn/UI Button component renders correctly</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>
              All variants (default, destructive, outline, etc.) display
              properly
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>All sizes (sm, default, lg, icon) work as expected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>CSS variables and theming system functional</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>TypeScript aliases (@/*) resolving correctly</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Dark mode toggle works (try the button above!)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
