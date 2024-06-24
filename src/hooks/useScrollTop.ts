import { useEffect, useRef } from "react";

const useScrollTop = ({ current }: { current: number }) => {
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [current]);
  return null;
};

export default useScrollTop;
