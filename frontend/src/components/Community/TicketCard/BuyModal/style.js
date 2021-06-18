import styled from "styled-components";
import { Input, Text, Button } from "rimble-ui";

export const StyledModalContainer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 35px;
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
  width: 650px;
`;

export const StyledModalHeader = styled.div`
  background-color: ${(props) => props.theme.colors.grey9};
  padding: 14px 16px 0;
  border-top-right-radius: 35px;
  border-top-left-radius: 35px;
`;

export const StyledModalBody = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-bottom: 1px solid ${(props) => props.theme.colors.grey3};
  max-height: ${(props) => props.maxHeight}px;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }
  padding: 20px 0;
  border-bottom-right-radius: 35px;
  border-bottom-left-radius: 35px;
`;

export const StyledInputContainer = styled.div`
  position: relative;
  margin-top: 20px;
`;

export const StyledButtonContainer = styled.div`
  position: absolute;
  right: 24px;
  top: 0;
  display: flex;
`;

export const StyledInput = styled(Input)`
  width: 100%;
  font-family: Roboto-Bold;
  letter-spacing: 6px;
  font-size: 24px;
  &::placeholder {
    font-family: Roboto-Regular;
    letter-spacing: 0px;
    color: ${(props) => props.theme.colors.grey2};
  }
`;

export const StyledTrashIcon = styled.button`
  border: none;
  background: none;
  margin-left: 16px;
  cursor: pointer;
`;

export const StyledTicketContainer = styled.div`
  padding: 0 40px;
`;

export const StyledPrice = styled(Text.span)`
  border-bottom: 1px dashed ${(props) => props.theme.border};
  cursor: default;
  &:hover {
    border: none;
  }
`;

export const StyledTabs = styled(Button.Text)`
`;

export const StyledTicketCount = styled.div`
  height: 20px;
  border-radius: 10px;
  position: absolute;
  padding: 0 8px;
  background-color: ${(props) => props.theme.colors.red};
  z-index: 2;
  right: 20%;
  top: -20%;
`;