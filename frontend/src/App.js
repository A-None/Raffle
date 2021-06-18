import { StyledBackground } from "./style";
import Header from "./components/Header";
import Community from "./components/Community";
import anoneProvider from "./contexts/anoneProvider";

function App() {
  return (
    <anoneProvider>
      <StyledBackground>
        <Header />
        <Community />
      </StyledBackground>
    </anoneProvider>
  );
}

export default App;
