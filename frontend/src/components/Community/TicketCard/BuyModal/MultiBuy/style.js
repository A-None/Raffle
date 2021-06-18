import styled from "styled-components";
import { Button, Input } from "rimble-ui";

export const StyledButton = styled(Button)`
  height: 40px;
  width: 106px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.white};
  margin-right: 8px;
  margin-bottom: 8px;
`;

export const StyledInput = styled(Input)`
  width: 100%;
  font-family: Roboto-Medium;
  letter-spacing: 6px;
  font-size: 24px;
  border: 2px solid ${(props) => props.theme.colors.grey1};
  &::placeholder {
    font-family: Roboto-Regular;
    color: ${(props) => props.theme.colors.grey2};
  }
`;
