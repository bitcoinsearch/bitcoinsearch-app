import { useEffect, useRef } from "react";

const useScrollTop = ({ current }) => {
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [current]);
  return null;
}

export default useScrollTop;
