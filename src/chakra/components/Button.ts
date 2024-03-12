const Button = {
  baseStyle: {
    borderRadius: "lg",
    textAlign: "center",
    height: "auto",
  },
  sizes: {
    xs: {
      px: 2,
      py: 1,
      height: "auto",
    },
    sm: {
      fontSize: "sm",
      px: 4,
      py: 2,
      height: "auto",
    },
    md: {
      fontSize: "md",
      px: 4,
      py: 2,
      height: "auto",
    },
    "no-size": {
      width: "auto",
      height: "auto",
      p: 0,
      m: 0,
    },
  },
  variants: {
    primary: () => ({
      color: "#fff",
      bgColor: "orange.200",
      _hover: {
        bgColor: "orange.250",
        _disabled: {
          bgColor: "orange.200",
        },
      },
      _active: {
        bgColor: "orange.275",
      },
    }),
    secondary: {
      fontSize: "16px",
      fontWeight: "400",
      borderRadius: "10px",
      backgroundColor: "#292929",
      color: "#FFFFFF",
      padding: "6px 24px",
      transition: "all 200ms ease",
    },
    "facet-pill": {
      fontSize: "11px",
      fontWeight: "400",
      borderRadius: "12px",
      backgroundColor: "grey.100",
      color: "grey.500",
      padding: "6px 8px",
      transition: "all 200ms ease",
      // _hover: {
      //   bgColor: "grey.200",
      //   color: "grey.100",
      //   transform: "scale(1.05) !important",
      // },
      _focus: {
        boxShadow: "none",
      },
      _active: {
        transform: "scale(0.95) !important",
        boxShadow: "none",
      },
    },
  },
};

export default Button;
