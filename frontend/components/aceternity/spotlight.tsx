"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  children: React.ReactNode;
}

export const SpotlightCard = ({ className, children }: SpotlightProps) => (
  <div className={cn("relative overflow-hidden rounded-4xl", className)}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 1 }}
      className="pointer-events-none absolute inset-0 bg-spotlight-overlay"
    />
    <div className="relative">{children}</div>
  </div>
);
