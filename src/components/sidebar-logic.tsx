"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";

export function SidebarLogic() {
  const { setOpen, isMobile } = useSidebar();
  const prevWidth = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // If mobile, the sidebar is handled by the Sheet (hidden/drawer), so we don't mess with 'open' state for the desktop sidebar
      if (isMobile) return;

      // Initial set on mount
      if (prevWidth.current === null) {
        if (width < 1024) {
          setOpen(false);
        } else {
          setOpen(true);
        }
        prevWidth.current = width;
        return;
      }

      // If crossing 1024 downwards -> collapse
      if (prevWidth.current >= 1024 && width < 1024) {
        setOpen(false);
      }
      // If crossing 1024 upwards -> expand
      else if (prevWidth.current < 1024 && width >= 1024) {
        setOpen(true);
      }

      prevWidth.current = width;
    };

    // Run on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen, isMobile]);

  return null;
}
