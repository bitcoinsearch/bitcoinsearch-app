import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(menuAnatomy.keys);

const Menu = helpers.defineMultiStyleConfig({
  variants: {
    brand: {
      list: {
        // backgroundColor: "blue.600"
        background: "none",
        boxShadow: "sm",
        border: "none",
        paddingBlock: "0px",
      },
      item: {
        fontWeight: "bold",
        background: "none",
      },
    },
  },
});

export default Menu;
