import styled from "styled-components";

export const StyledTooltip = styled.div`
  z-index: 3;
  width: 320px;
  padding: 16px 36px 4px;
  border-radius: 20px;
  position: absolute;
  left: -160px;
  bottom: 32px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
`;
