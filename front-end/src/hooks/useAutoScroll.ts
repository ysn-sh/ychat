import { useEffect, type RefObject } from "react";

export function useAutoScroll(ref: RefObject<HTMLElement | null>, deps: any[]) {
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, deps);

  return { scrollToBottom };
}