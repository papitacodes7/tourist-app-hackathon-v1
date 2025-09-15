import { cn } from "@/lib/utils";
import { useState } from "react";

export const GradientBackground = ({ children, variant = "default", className = "" }) => {
  const [count, setCount] = useState(0);

  const gradientVariants = {
    default: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
    blue: "radial-gradient(125% 125% at 50% 10%, #f8fafc 30%, #3b82f6 100%)",
    indigo: "radial-gradient(125% 125% at 50% 10%, #f1f5f9 35%, #4f46e5 100%)",
    purple: "radial-gradient(125% 125% at 50% 10%, #faf5ff 30%, #8b5cf6 100%)",
    emerald: "radial-gradient(125% 125% at 50% 10%, #f0fdf4 35%, #10b981 100%)",
    rose: "radial-gradient(125% 125% at 50% 10%, #fff1f2 30%, #f43f5e 100%)",
    slate: "radial-gradient(125% 125% at 50% 10%, #f8fafc 40%, #64748b 100%)",
  };

  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: gradientVariants[variant] || gradientVariants.default,
        }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export const Component = GradientBackground;