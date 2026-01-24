# Quick Reference Guide

Common patterns and code snippets used in this project.

## 🚀 Next.js Quick Reference

### Navigation
```tsx
// Link component
import Link from "next/link";
<Link href="/dashboard/user/profile">Profile</Link>

// Programmatic navigation
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/dashboard/admin");
router.replace("/login");
```

### Route Parameters
```tsx
// Dynamic route: app/listings/[slug]/page.tsx
import { useParams } from "next/navigation";
const params = useParams();
const slug = params?.slug as string;

// Query parameters: /search?q=restaurant&location=kathmandu
import { useSearchParams } from "next/navigation";
const searchParams = useSearchParams();
const query = searchParams.get("q");
const location = searchParams.get("location");
```

### Client Component
```tsx
"use client";
import { useState, useEffect } from "react";

export default function MyComponent() {
  const [state, setState] = useState("");
  // ...
}
```

---

## ⚛️ React Patterns

### useState Hook
```tsx
const [value, setValue] = useState("");
const [object, setObject] = useState({ name: "", email: "" });
const [array, setArray] = useState([]);
const [isOpen, setIsOpen] = useState(false);
```

### useEffect Hook
```tsx
// Run on mount
useEffect(() => {
  // Code here
}, []);

// Run on dependency change
useEffect(() => {
  // Code here
}, [dependency]);

// Cleanup
useEffect(() => {
  const handler = () => {};
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}, []);
```

### Form Handling
```tsx
const [formData, setFormData] = useState({ name: "", email: "" });

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Submit logic
};

<form onSubmit={handleSubmit}>
  <input
    value={formData.name}
    onChange={(e) => handleChange("name", e.target.value)}
  />
</form>
```

---

## 🎨 Tailwind CSS Quick Reference

### Layout
```tsx
// Flexbox
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
```

### Spacing
```tsx
// Padding
<div className="p-4">        // All sides
<div className="px-4 py-2">  // X and Y
<div className="pt-6">      // Top only

// Margin
<div className="m-4">       // All sides
<div className="mx-auto">   // Center horizontally
<div className="mb-6">      // Bottom only
```

### Colors (Project Theme)
```tsx
// Blue (Primary)
className="bg-blue-600 text-white hover:bg-blue-700"

// Green (Accent)
className="bg-green-600 text-white hover:bg-green-700"

// Gradients
className="bg-gradient-to-r from-blue-600 to-green-600"

// Gray (Neutral)
className="bg-gray-50 text-gray-900 border-gray-200"
```

### Responsive Breakpoints
```tsx
// Mobile first
className="text-sm sm:text-base md:text-lg lg:text-xl"

// Hide/Show
className="hidden md:block"  // Hidden on mobile, visible on md+
className="block md:hidden"  // Visible on mobile, hidden on md+
```

### Common Utilities
```tsx
// Rounded corners
className="rounded-lg rounded-full rounded-xl"

// Shadows
className="shadow-sm shadow-md shadow-lg shadow-xl"

// Transitions
className="transition-all duration-300 ease-in-out"

// Hover states
className="hover:bg-blue-50 hover:text-blue-700"

// Focus states
className="focus:outline-none focus:ring-2 focus:ring-blue-500"
```

---

## 🧩 Component Patterns

### Card Component
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Button Component
```tsx
import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button className="bg-blue-600 hover:bg-blue-700">Custom</Button>
```

### Input Component
```tsx
import { Input } from "@/components/ui/input";

<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Select Component
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Badge Component
```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge className="bg-green-600 text-white">Custom</Badge>
```

---

## 🎯 Icons (Lucide React)

```tsx
import { Search, User, Building2, Star } from "lucide-react";

<Search className="h-5 w-5 text-gray-400" />
<User className="h-4 w-4 mr-2" />
```

---

## 📘 TypeScript Patterns

### Interface Definition
```tsx
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "business" | "user";
  status?: "active" | "inactive"; // Optional
}
```

### Component Props
```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  // ...
}
```

### Event Types
```tsx
// Form submit
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

// Input change
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

// Button click
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // ...
};
```

---

## 🎨 Common UI Patterns

### Modal/Dialog
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    Content here
  </DialogContent>
</Dialog>
```

### Sidebar/Drawer
```tsx
// Fixed sidebar sliding in from right
<div
  className={`fixed top-0 right-0 h-full w-full sm:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
    isOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  {/* Content */}
</div>
```

### Sticky Header
```tsx
<header className="sticky top-0 z-40 bg-white border-b">
  {/* Header content */}
</header>
```

### Loading State
```tsx
{isLoading ? (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
) : (
  <div>Content</div>
)}
```

### Empty State
```tsx
{items.length === 0 && (
  <Card>
    <CardContent className="py-12 text-center">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No items found
      </h3>
      <p className="text-gray-600">Description here</p>
    </CardContent>
  </Card>
)}
```

---

## 🔍 Search and Filter Pattern

```tsx
const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

const filteredItems = items.filter((item) => {
  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesStatus = statusFilter === "all" || item.status === statusFilter;
  return matchesSearch && matchesStatus;
});
```

---

## 📱 Responsive Design Pattern

```tsx
// Mobile-first approach
<div className="
  flex flex-col          // Stack on mobile
  sm:flex-row            // Row on small screens
  gap-4                  // Gap between items
  p-4                    // Padding
  sm:p-6                 // More padding on larger screens
">
  <div className="w-full sm:w-1/2 lg:w-1/3">
    {/* Responsive width */}
  </div>
</div>
```

---

## 🎨 Project Theme Colors

```tsx
// Primary Blue
bg-blue-600, text-blue-600, border-blue-600
hover:bg-blue-700, hover:text-blue-700

// Accent Green
bg-green-600, text-green-600, border-green-600
hover:bg-green-700, hover:text-green-700

// Gradients
bg-gradient-to-r from-blue-600 to-green-600
bg-gradient-to-br from-blue-400 to-green-400

// Neutral Grays
bg-gray-50, bg-gray-100, bg-gray-200
text-gray-600, text-gray-700, text-gray-900
```

---

## 🚀 Common File Structure

```
app/
  (public)/              # Public routes
    page.tsx             # Homepage
    search/
      page.tsx           # Search page
  (dashboard)/           # Dashboard routes
    layout.tsx           # Dashboard layout
    admin/
      page.tsx           # Admin dashboard
      businesses/
        page.tsx         # Business list
  (auth)/                # Auth routes
    login/
      page.tsx           # Login page

components/
  ui/                    # shadcn/ui components
    button.tsx
    card.tsx
  layout/                # Layout components
    header.tsx
    footer.tsx
  dashboard/             # Dashboard components
    DashboardSidebar.tsx
```

---

## 💡 Pro Tips

1. **Always use TypeScript interfaces** for props and data
2. **Use "use client"** only when needed (hooks, events, browser APIs)
3. **Mobile-first** responsive design
4. **Consistent spacing** using Tailwind's spacing scale
5. **Reusable components** for common patterns
6. **Form validation** before submission
7. **Loading states** for async operations
8. **Error handling** for user feedback

---

**Keep this reference handy while coding! 📝**

