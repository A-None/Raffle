import PropTypes from "prop-types";
import { Text } from "rimble-ui";

function BodyText(props) {
  return (
    <Text.p color="grey1" fontFamily="Roboto-Regular" fontSize={16} m={0}>
      {props.children}
    </Text.p>
  );
}

BodyText.propTypes = {
  children: PropTypes.string,
};

export default BodyText;
