import { StyledTooltip } from "./style";
import { Flex, Box, Text } from "rimble-ui";
import PropTypes from "prop-types";

function Tooltip(props) {
  return (
    <StyledTooltip>
      <Flex flexDirection="column">
        {props.matches.map((match, index) => {
          return (
            <Box key={`match_${index}`}>
              <Text.span
                fontFamily="Roboto-Regular"
                color="grey1"
                fontSize={16}
                m={0}
              >{`${4 - index} (x${match})`}</Text.span>
            </Box>
          );
        })}
      </Flex>
    </StyledTooltip>
  );
}

Tooltip.propTypes = {
  matches: PropTypes.array,
};

export default Tooltip;
