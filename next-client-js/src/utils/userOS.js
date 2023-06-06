
export const isMac = () => {
  const OS = navigator.userAgent;
  return OS.search("Mac") !== -1;
};
