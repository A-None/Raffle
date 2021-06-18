import styled from "styled-components";

export const StyledTooltip = styled.div`
  z-index: 3;
  width: 320px;
  padding: 16px;
  border-radius: 20px;
  position: absolute;
  left: -140px;
  bottom: 16px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
`;
