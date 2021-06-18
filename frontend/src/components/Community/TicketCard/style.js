import styled from "styled-components";
import { Box, Text } from "rimble-ui";

export const StyledBox = styled(Box)`
  border-radius: 35px;
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
  background-color: ${(props) => props.theme.colors.white};
`;

export const StyledButtonBox = styled(Box)`
  border-right: 1px solid ${(props) => props.theme.colors.grey3};
`;

export const StyledTicket = styled(Text.p)`
  position: absolute;
  top: 20%;
  left: 27%;
`;

export const StyledTicketContainer = styled(Box)`
  position: relative;
  margin-right: 8px;
  margin-bottom: 8px;
`;
