import { useState, useEffect } from "react";
import throttle from "lodash.throttle";

const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const getDeviceConfig = (width) => {
  if (width < screens.sm) return "sm";
  if (width < screens.md) return "md";
  if (width < screens.lg) return "lg";
  if (width < screens.xl) return "xl";
  return "2xl";
};

const useBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState(() =>
    typeof window !== "undefined" ? getDeviceConfig(window.innerWidth) : "sm"
  );

  useEffect(() => {
    const calcInnerWidth = throttle(function () {
      setBrkPnt(getDeviceConfig(window.innerWidth));
    }, 200);
    window.addEventListener("resize", calcInnerWidth);
    return () => window.removeEventListener("resize", calcInnerWidth);
  }, []);

  return brkPnt;
};
export default useBreakpoint;
