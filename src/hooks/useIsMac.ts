import React, { useEffect, useRef } from 'react'

const useIsMac = () => {
  const OS = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      OS.current = window.navigator.userAgent;
    }
  }, []);
  return OS.current ? OS.current.search("Mac") !== -1 : false;
}

export default useIsMac;
