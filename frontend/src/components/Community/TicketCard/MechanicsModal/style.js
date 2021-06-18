import styled from "styled-components";

export const StyledModalContainer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 35px;
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
  width: 762px;
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
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }
  padding: 24px 40px;
  border-bottom-right-radius: 35px;
  border-bottom-left-radius: 35px;
`;
