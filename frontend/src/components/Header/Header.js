import { Flex, Box } from "rimble-ui";
import { StyledLogo } from "./style";
import Logo from "assets/logo.png";

function Header() {
  return (
    <Flex p={[26]}>
      <Box>
        <StyledLogo src={Logo} />
      </Box>
    </Flex>
  );
}

export default Header;
