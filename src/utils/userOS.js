const OS = navigator.userAgent;

export const isMac = () => {
  return OS.search("Mac") !== -1;
};
