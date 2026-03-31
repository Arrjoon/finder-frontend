"use client";

import { useState, useEffect } from "react";

export default function ClientTime() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <p>Client rendered time: {time}</p>;
}