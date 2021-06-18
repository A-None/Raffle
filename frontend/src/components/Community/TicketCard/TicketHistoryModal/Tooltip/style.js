import styled from "styled-components";

export const StyledTooltip = styled.div`
  z-index: 3;
  width: 130px;
  padding: 16px;
  border-radius: 20px;
  position: absolute;
  right: 125px;
  bottom: -40px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
`;
