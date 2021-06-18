import { StyledTooltip } from "./style";
import { Flex, Box, Text } from "rimble-ui";

function Tooltip() {
  return (
    <StyledTooltip>
      <Flex justifyContent="space-between">
        <Box>
          <Text.p
            fontFamily="Roboto-Regular"
            color="primary"
            fontSize={16}
            m={0}
            mb={12}
          >
            Quantity
          </Text.p>
          <Text.p
            fontFamily="Roboto-Regular"
            color="grey1"
            fontSize={16}
            m={0}
            mb={12}
          >
            0 to 99
          </Text.p>
          <Text.p
            fontFamily="Roboto-Regular"
            color="grey1"
            fontSize={16}
            m={0}
            mb={12}
          >
            100 to 999
          </Text.p>
          <Text.p
            fontFamily="Roboto-Regular"
            color="grey1"
            fontSize={16}
            m={0}
            mb={12}
          >
            1000 to above
          </Text.p>
        </Box>
        <Box>
          <Text.p
            fontFamily="Roboto-Regular"
            color="primary"
            fontSize={16}
            m={0}
            mb={12}
          >
            Ticket Price
          </Text.p>
          <Text.p
            fontFamily="Roboto-Bold"
            color="grey1"
            fontSize={16}
            m={0}
            mb={12}
            textAlign="right"
          >
            10 anone
          </Text.p>
          <Text.p
            fontFamily="Roboto-Bold"
            color="grey1"
            fontSize={16}
            m={0}
            mb={12}
            textAlign="right"
          >
            9 anone
          </Text.p>
          <Text.p
            fontFamily="Roboto-Bold"
            color="grey1"
            fontSize={16}
            m={0}
            mb={12}
            textAlign="right"
          >
            8 anone
          </Text.p>
        </Box>
      </Flex>
    </StyledTooltip>
  );
}

Tooltip.propTypes = {};

export default Tooltip;
