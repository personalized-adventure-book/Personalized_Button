import React from "react";

interface ShapePreviewProps {
  shapeId: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ShapePreview({
  shapeId,
  className = "",
  style,
}: ShapePreviewProps) {
  const shapeComponents = {
    round: <div className={`rounded-full ${className}`} style={style} />,

    square: <div className={`rounded-lg ${className}`} style={style} />,

    hexagon: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />
    ),

    octagon: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
      />
    ),

    diamond: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          transform: "rotate(0deg)",
        }}
      />
    ),

    star: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath:
            "polygon(50% 0%, 58% 30%, 95% 35%, 72% 55%, 82% 95%, 50% 75%, 18% 95%, 28% 55%, 5% 35%, 42% 30%)",
        }}
      />
    ),

    triangle: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      />
    ),

    heart: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath:
            "polygon(50% 88%, 15% 45%, 15% 25%, 25% 12%, 40% 12%, 50% 25%, 60% 12%, 75% 12%, 85% 25%, 85% 45%)",
        }}
      />
    ),

    oval: (
      <div
        className={`rounded-full ${className}`}
        style={{
          ...style,
          transform: "scaleX(1.3)",
        }}
      />
    ),

    pentagon: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        }}
      />
    ),

    "rounded-square": (
      <div className={`rounded-2xl ${className}`} style={style} />
    ),

    pill: (
      <div
        className={`rounded-full ${className}`}
        style={{
          ...style,
          transform: "scaleY(0.6)",
        }}
      />
    ),

    cloud: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath:
            "polygon(20% 60%, 5% 80%, 15% 100%, 85% 100%, 95% 80%, 80% 60%, 90% 40%, 85% 20%, 70% 5%, 50% 10%, 30% 5%, 15% 20%, 10% 40%)",
        }}
      />
    ),

    flower: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath:
            "polygon(50% 15%, 58% 35%, 85% 30%, 75% 50%, 90% 70%, 70% 65%, 58% 85%, 50% 70%, 42% 85%, 30% 65%, 10% 70%, 25% 50%, 15% 30%, 42% 35%)",
        }}
      />
    ),

    lightning: (
      <div
        className={`${className}`}
        style={{
          ...style,
          clipPath:
            "polygon(60% 0%, 100% 35%, 70% 35%, 90% 100%, 30% 65%, 60% 65%, 40% 0%)",
        }}
      />
    ),
  };

  return (
    shapeComponents[shapeId as keyof typeof shapeComponents] ||
    shapeComponents.round
  );
}

// Helper function to get shape classes for backward compatibility
export function getShapeClasses(shapeId: string): string {
  const shapeClasses: Record<string, string> = {
    round: "rounded-full",
    square: "rounded-lg",
    hexagon: "",
    octagon: "",
    diamond: "",
    star: "",
    triangle: "",
    heart: "",
    oval: "rounded-full",
    pentagon: "",
    "rounded-square": "rounded-2xl",
    pill: "rounded-full",
    cloud: "",
    flower: "",
    lightning: "",
  };
  return shapeClasses[shapeId] || "rounded-lg";
}
