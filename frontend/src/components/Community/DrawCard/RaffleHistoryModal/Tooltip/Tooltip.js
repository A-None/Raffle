import { StyledTooltip } from "./style";
import { Flex, Box, Text, Button } from "rimble-ui";
import PropTypes from "prop-types";

function Tooltip(props) {
  return (
    <StyledTooltip>
      <Flex justifyContent="space-between">
        <Box>
          <Text.span
            fontFamily="Roboto-Regular"
            color="grey1"
            fontSize={16}
            m={0}
          >{`You won `}</Text.span>
          <Text.span
            fontFamily="Roboto-Medium"
            color="orange"
            fontSize={16}
            m={0}
          >
            {props.anoneAmount} anone
          </Text.span>
        </Box>
        <Box>
          <Button.Text
            fontFamily="Roboto-Regular"
            color="primary"
            fontSize={16}
            m={0}
            p={[0]}
            height="auto"
            onClick={() => props.handleDetails()}
          >
            DETAILS
          </Button.Text>
        </Box>
      </Flex>
    </StyledTooltip>
  );
}

Tooltip.propTypes = {
  handleDetails: PropTypes.func,
  anoneAmount: PropTypes.number,
};

export default Tooltip;
