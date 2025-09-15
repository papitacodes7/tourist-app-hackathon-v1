import React from 'react';
import { Shield } from 'lucide-react';

const Logo = ({ 
  width, 
  height, 
  className = "", 
  variant = "full", // "full", "icon", "text", "navbar", "hero"
  size = "default", // "tiny", "small", "default", "large"
  context = "default" // "navbar", "hero", "footer"
}) => {
  // Size presets with better proportions
  const sizePresets = {
    tiny: { width: 60, height: 24, iconSize: "w-4 h-4" },      // Compact navbar
    small: { width: 90, height: 36, iconSize: "w-5 h-5" },     // Standard navbar  
    default: { width: 140, height: 56, iconSize: "w-6 h-6" },  // General use
    large: { width: 240, height: 96, iconSize: "w-8 h-8" }     // Hero prominent
  };

  const currentSize = sizePresets[size] || sizePresets.default;

  // Apply props if given, else fallback to preset
  const finalWidth = width || currentSize.width;
  const finalHeight = height || currentSize.height;

  // Context-based styling for visual distinction and visibility
  const contextClasses = {
    navbar: "opacity-90 hover:opacity-100 transition-all duration-300 filter brightness-110 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1",
    hero: "drop-shadow-2xl filter brightness-105 hover:scale-105 transition-transform duration-500",
    footer: "opacity-70 grayscale hover:grayscale-0 transition-all duration-300 bg-white/5 backdrop-blur-sm rounded-lg px-2 py-1",
    dashboard: "bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300",
    panel: "bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-lg rounded-2xl px-4 py-3 shadow-2xl border border-white/40 hover:from-white/35 hover:to-white/25 transition-all duration-300",
    default: "bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1"
  };

  // === Variant: navbar - nav-logo.png ===
  if (variant === "navbar" || context === "navbar") {
    return (
      <div className={`inline-flex items-center ${className} ${contextClasses.navbar}`}>
        <img
          src="/nav-logo.png"
          alt="SafeTrail Navigation Logo"
          className="object-contain flex-shrink-0 drop-shadow-md"
          style={{ 
            width: `${finalWidth}px`,
            height: `${finalHeight}px`,
            maxWidth: `${finalWidth}px`,
            maxHeight: `${finalHeight}px`
          }}
        />
      </div>
    );
  }

  // === Variant: hero - Clean logo without effects ===
  if (variant === "hero" || context === "hero") {
    return (
      <div className={`inline-flex items-center justify-center ${className} ${contextClasses.hero}`}>
        <img
          src="/logo.png"
          alt="SafeTrail Logo"
          className="object-contain flex-shrink-0"
          style={{ 
            width: `${finalWidth}px`,
            height: `${finalHeight}px`,
            maxWidth: `${finalWidth}px`,
            maxHeight: `${finalHeight}px`
          }}
        />
      </div>
    );
  }

  // === Variant: icon ===
  if (variant === "icon") {
    const pixelSize =
      currentSize.iconSize.includes("w-4") ? 20 :
      currentSize.iconSize.includes("w-5") ? 24 :
      currentSize.iconSize.includes("w-6") ? 28 : 32;

    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src="/logo.png"
          alt="SafeTrail Icon"
          className={`${currentSize.iconSize} object-contain flex-shrink-0`}
          style={{
            width: `${pixelSize}px`,
            height: `${pixelSize}px`
          }}
        />
      </div>
    );
  }

  // === Variant: text ===
  if (variant === "text") {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          SafeTrail
        </span>
      </div>
    );
  }

  // === Variant: full (default) ===
  return (
    <div className={`inline-flex items-center ${className} ${contextClasses[context] || contextClasses.default}`}>
      <img
        src="/logo.png"
        alt="SafeTrail Logo"
        className="object-contain flex-shrink-0 drop-shadow-lg"
        style={{ 
          width: `${finalWidth}px`,
          height: `${finalHeight}px`,
          maxWidth: `${finalWidth}px`,
          maxHeight: `${finalHeight}px`
        }}
      />
    </div>
  );
};

export default Logo;
