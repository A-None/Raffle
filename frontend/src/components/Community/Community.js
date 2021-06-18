import { Flex, Box } from "rimble-ui";
import TicketCard from "./TicketCard";
import DrawCard from "./DrawCard";

function Community() {
  return (
    <Flex justifyContent="center" pt={[24]}>
      <Box>
        <TicketCard />
        <DrawCard />
      </Box>
    </Flex>
  );
}

export default Community;
