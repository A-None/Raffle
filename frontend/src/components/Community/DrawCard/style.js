import styled from "styled-components";
import { Box } from "rimble-ui";
import { device } from "theme/breakpoints";

export const StyledBox = styled(Box)`
  border-radius: 35px;
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
  background-color: ${(props) => props.theme.colors.white};
  width: 100%;
`;

export const StyledWinningCard = styled.div`
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.blue2};
  box-shadow: 0px 3px 6px ${(props) => props.theme.boxShadow};
  display: flex;
  width: 80px;
  height: 90px;
  @media ${device.mobile} {
    width: 56px;
    height: 56px;
  }
  margin-right: 16px;
`;

export const StyledButtonBox = styled(Box)`
  border-right: 1px solid ${(props) => props.theme.colors.grey3};
`;

export const StyledWinningText = styled(Box)`
  margin-top: 32px;
  width: 100%;
  text-align: center;
`;
