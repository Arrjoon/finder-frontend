// app/demo/page.tsx
import React from "react";

// Server Component
const ServerTime = () => {
  const now = new Date().toLocaleTimeString();
  return (
    <div className="p-4 mb-4 border border-red-400 rounded">
      <h2 className="font-bold text-red-600">Server Component</h2>
      <p>Time generated on server: {now}</p>
      <p>This will NOT update in the browser.</p>
    </div>
  );
};

// Client Component
const ClientTime = () => {
  "use client"; // 🔑 Makes this a client component
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 border border-green-400 rounded">
      <h2 className="font-bold text-green-600">Client Component</h2>
      <p>Time updating in browser: {time}</p>
      <p>This will keep updating every second.</p>
    </div>
  );
};

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Server vs Client Rendering Demo</h1>
      <ServerTime />
      <ClientTime />
    </div>
  );
}