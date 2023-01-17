const hotKeys = [
  {
    key: "/",
    elementIdentifier: ".sui-search-box__text-input",
    callback: (element) => {
      element.focus();
    },
  },
];

const getHotkeys = () => [...hotKeys]

export default getHotkeys;
