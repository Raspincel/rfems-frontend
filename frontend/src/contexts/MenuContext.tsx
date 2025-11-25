import { createContext, useEffect, useRef, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export const menuContext = createContext<{
  isMenuOpen: boolean | null;
  setIsMenuOpen: (open: boolean) => void;
  shouldShowOverlay: boolean;
}>({
  isMenuOpen: false,
  shouldShowOverlay: true,
  setIsMenuOpen: () => {},
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = (e?: UIEvent) => {
      if (isMenuOpen !== null && !e) return;

      if (!isMenuOpen && window.innerWidth >= MOBILE_BREAKPOINT) {
        setIsMenuOpen(true);
      } else if (isMenuOpen && window.innerWidth < MOBILE_BREAKPOINT) {
        setIsMenuOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const shouldShowOverlay =
    isMenuOpen === true &&
    typeof window !== "undefined" &&
    window.innerWidth < MOBILE_BREAKPOINT;

  return (
    <menuContext.Provider
      value={{ isMenuOpen, setIsMenuOpen, shouldShowOverlay }}
    >
      {children}
    </menuContext.Provider>
  );
}
