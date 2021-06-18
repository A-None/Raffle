import styled from "styled-components";
import { Input, Button, Text, Flex } from "rimble-ui";

export const StyledModalContainer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 35px;
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
  width: 949px;
`;

export const StyledModalHeader = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-bottom: 1px solid ${(props) => props.theme.colors.grey3};
  padding: 16px 32px;
  border-top-right-radius: 35px;
  border-top-left-radius: 35px;
`;

export const StyledModalFooter = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  padding: 16px 32px;
  border-bottom-right-radius: 35px;
  border-bottom-left-radius: 35px;
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

export const StyledRows = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.border};
  }
`;

export const StyledInput = styled(Input)`
  font-family: Roboto-Regular;
  font-size: 16px;
  background-color: ${(props) => props.theme.colors.grey6};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 12px;
`;

export const StyledButtonContainer = styled.div`
  position: absolute;
  right: 24px;
`;

export const StyledInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledBlankButton = styled.div`
  display: inline-block;
  cursor: pointer;
`;

export const StyledDropdown = styled.div`
  border-radius: 12px;
  width: 140px;
  position: absolute;
  bottom: 32px;
  left: 0;
  background-color ${(props) => props.theme.colors.grey6};
`;

export const StyledPagination = styled(Button)`
  min-width: 38px;
  height: 38px;
  border-radius: 19px;
  border: 1px solid
    ${(props) =>
      props.active ? props.theme.primary : props.theme.colors.grey7};
`;

export const StyledArrowDown = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid ${(props) => props.theme.colors.grey7};
`;

export const StyledArrowDown2 = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid ${(props) => props.theme.colors.primary};
`;

export const StyledArrowUp = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 8px solid ${(props) => props.theme.colors.primary};
`;

export const StyledPaginationContainer = styled.div`
  display: inline-block;
`;

export const StyledPaginationContainer2 = styled.div`
  display: inline-block;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

export const StyledTokensWon = styled(Text.span)`
  border-bottom: 1px dashed ${(props) => props.theme.border};
  ${(props) => props.sum === 0 && `border-bottom: none`};
  cursor: default;
  &:hover {
    border: none;
  }
`;

export const StyledOrangeCircle = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.orange};
  display: inline-block;
  margin-bottom: 2px;
  margin-right: 2px;
`;

export const StyledOuterFlex = styled(Flex)`
  position: absolute;
  left: 229.5px;
  bottom: -96px;
`;
