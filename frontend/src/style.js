import styled from "styled-components";
import background from "./assets/background.png";

export const StyledBackground = styled.div`
  min-height: 100vh;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;
