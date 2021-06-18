import styled from "styled-components";

export const StyledContainer = styled.div`
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.border};
  width: 100%;
  margin-top: 36px;
`;

export const StyledHeader = styled.div`
  padding: 30px 30px 20px;
  text-align: left;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

export const StyledTitles = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

export const StyledRows = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.border};
  }
`;
