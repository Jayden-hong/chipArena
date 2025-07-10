import type { SpringOptions } from "framer-motion";
import { useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./TiltedCard.css";

interface TiltedCardProps {
  children: ReactNode;
  imageSrc?: React.ComponentProps<"img">["src"];
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  children,
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "40px",
  imageWidth = "40px",
  scaleOnHover = 1.04,
  rotateAmplitude = 7,
  showMobileWarning = false,
  showTooltip = false,
  overlayContent = null,
  displayOverlayContent = false,
  className = "",
  style = {},
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState<number>(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <motion.figure
      ref={ref}
      className={`tilted-card-figure ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth,
        ...style,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{}}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">
          该效果仅适用于桌面端，请在桌面端体验。
        </div>
      )}
      <motion.div
        className="tilted-card-inner"
        style={{
          width: "100%",
          height: "100%",
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* 可选小logo */}
        {imageSrc && (
          <motion.img
            src={imageSrc}
            alt={altText}
            className="tilted-card-img"
            style={{
              width: imageWidth,
              height: imageHeight,
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 2,
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
              borderRadius: "0.75rem",
              background: "#fff"
            }}
          />
        )}
        {/* 主内容区 */}
        <div className="tilted-card-content w-full h-full flex flex-col justify-between relative z-10">
          {children}
        </div>
        {/* 可选高光/装饰层 */}
        {displayOverlayContent && overlayContent && (
          <motion.div className="tilted-card-overlay">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
      {showTooltip && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </motion.figure>
  );
} 