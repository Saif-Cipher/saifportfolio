"use client";

import React, { useState } from "react";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";

export type LiquidButtonVariant = "floating-glass" | "primary" | "secondary" | "ghost";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LiquidButtonVariant;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  enableScramble?: boolean;
  children: React.ReactNode;
}

export const LiquidButton = React.forwardRef<HTMLElement, LiquidButtonProps>(
  (
    {
      variant = "primary",
      href,
      target,
      rel,
      icon,
      iconPosition = "right",
      enableScramble = true,
      className = "",
      children,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = (e: React.MouseEvent<any>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<any>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    const handleFocus = (e: React.FocusEvent<any>) => {
      setIsHovered(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<any>) => {
      setIsHovered(false);
      onBlur?.(e);
    };

    // Variant Styles combining Neumorphism + Liquid Metal + Glass
    let variantClasses = "";
    switch (variant) {
      case "floating-glass":
        variantClasses =
          "bg-[rgba(19,48,68,0.45)] hover:bg-[rgba(34,87,122,0.65)] text-[#F8F7F2] border border-[#F8F7F2]/20 hover:border-[#FB3640]/70 shadow-[0_8px_32px_0_rgba(11,30,43,0.55),inset_0_1px_1px_0_rgba(248,247,242,0.35)] backdrop-blur-xl hover:shadow-[0_10px_36px_0_rgba(251,54,64,0.25),inset_0_1px_2px_0_rgba(248,247,242,0.45)]";
        break;
      case "primary":
        variantClasses =
          "bg-[#FB3640] hover:bg-[#ff4d56] text-[#F8F7F2] border border-[#FB3640]/80 shadow-[0_6px_24px_rgba(251,54,64,0.42),inset_0_1px_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_8px_32px_rgba(251,54,64,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.6)]";
        break;
      case "secondary":
        variantClasses =
          "bg-[rgba(19,48,68,0.6)] hover:bg-[rgba(34,87,122,0.85)] text-[#F8F7F2] border border-[#22577A]/60 hover:border-[#FB3640]/50 shadow-[0_6px_20px_rgba(11,30,43,0.5),inset_0_1px_1px_0_rgba(248,247,242,0.2)] backdrop-blur-md";
        break;
      case "ghost":
        variantClasses =
          "bg-transparent hover:bg-[rgba(248,247,242,0.08)] text-[#F8F7F2] border border-transparent hover:border-[#F8F7F2]/20";
        break;
    }

    const baseClasses =
      "relative group/lbtn inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer select-none active:scale-[0.97] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB3640] overflow-hidden";

    const content = (
      <>
        {/* Specular Liquid Metal Top Highlight */}
        <span
          className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F8F7F2]/60 to-transparent pointer-events-none opacity-80 group-hover/lbtn:opacity-100 transition-opacity"
          aria-hidden="true"
        />

        {/* Ambient Hover Sheen */}
        <span
          className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover/lbtn:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />

        {/* Left Icon if present */}
        {icon && iconPosition === "left" && (
          <span className="relative z-10 shrink-0 text-[#FB3640] group-hover/lbtn:text-[#F8F7F2] transition-colors">
            {icon}
          </span>
        )}

        {/* Text Content with optional scramble */}
        <span className="relative z-10">
          {typeof children === "string" && enableScramble ? (
            <RandomLetterSwap text={children} isTriggered={isHovered} />
          ) : (
            children
          )}
        </span>

        {/* Right Icon if present */}
        {icon && iconPosition === "right" && (
          <span className="relative z-10 shrink-0 text-[#FB3640] group-hover/lbtn:text-[#F8F7F2] transition-colors">
            {icon}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as any}
          href={href}
          target={target}
          rel={rel}
          className={`${baseClasses} ${variantClasses} ${className}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(props as any)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as any}
        type={props.type || "button"}
        className={`${baseClasses} ${variantClasses} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {content}
      </button>
    );
  }
);

LiquidButton.displayName = "LiquidButton";
