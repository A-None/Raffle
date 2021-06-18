import styled from "styled-components";
import PropTypes from "prop-types";
import { Button } from "rimble-ui";

function anoneButton(props) {
  const { width, height, radius, children, ...rest } = props;
  let customWidth = width ?? 296;
  let customHeight = height ?? 60;
  let customRadius = radius ?? 30;
  return (
    <Button
      height={customHeight}
      width={customWidth}
      borderRadius={customRadius}
      {...rest}
    >
      {children}
    </Button>
  );
}

export const StyledButton = styled(Button)`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: ${(props) => props.radius}px;
`;

anoneButton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  radius: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  children: PropTypes.element,
};

export default anoneButton;
