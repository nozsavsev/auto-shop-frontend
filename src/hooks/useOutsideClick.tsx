import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(onClickOutside: () => void) {
  const outsideClickRef = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (outsideClickRef.current && !outsideClickRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return {
    outsideClickRef,
  };
}
