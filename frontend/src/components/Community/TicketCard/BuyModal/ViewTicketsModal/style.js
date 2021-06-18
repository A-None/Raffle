import styled from "styled-components";
import { Flex, Text } from "rimble-ui";

export const StyledModalContainer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 35px;
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
  width: 514px;
`;

export const StyledModalHeader = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-bottom: 1px solid ${(props) => props.theme.colors.grey3};
  padding: 40px 40px 16px;
  border-top-right-radius: 35px;
  border-top-left-radius: 35px;
`;

export const StyledModalBody = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-bottom: 1px solid ${(props) => props.theme.colors.grey3};
  max-height: ${(props) => props.maxHeight}px;
  overflow: auto;
`;

export const StyledTitles = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

export const StyledTicket = styled(Flex)`
  border-bottom: 1px solid ${(props) => props.theme.colors.grey3};
`;

export const StyledModalFooter = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  padding: 40px 42px;
  border-bottom-right-radius: 35px;
  border-bottom-left-radius: 35px;
`;

export const StyledPrice = styled(Text.p)`
  border-bottom: 1px dashed ${(props) => props.theme.border};
  cursor: default;
  &:hover {
    border: none;
  }
`;

export const StyledMinimalButton = styled.button`
  border: none;
  background-color: ${(props) => props.theme.colors.white};
  cursor: pointer;
`;
