import { useState } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Field, Button } from "rimble-ui";
import { StyledInput } from "./style";

function SingleBuy(props) {
  const [strTicket, setStrTicket] = useState("");

  const handleInputChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (
      (strTicket.length < 4 || value.length < 4) &&
      (/^\d+$/.test(value) || value === "")
    ) {
      setStrTicket(value);
    }
  };

  const handleAddTickets = () => {
    let ticket = [];
    for (let num of strTicket) {
      ticket.push(parseInt(num));
    }
    props.handleAddTickets([ticket]);
  };

  return (
    <Flex flexDirection="column">
      <Box>
        <Flex justifyContent="center" mt={[24]}>
          <Box width="100%">
            <Flex justifyContent="center">
              <Box>
                <Field
                  label="Ticket Number"
                  fontFamily="Roboto-Regular"
                  width="390px"
                  margin="auto"
                >
                  <StyledInput
                    type="text"
                    required={true}
                    placeholder="0000"
                    onChange={(e) => handleInputChange(e)}
                    value={strTicket}
                  />
                </Field>
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Flex px={[8]} mt={[50]} justifyContent="center">
          <Box>
            <Button
              mainColor="green2"
              height={40}
              width={[184]}
              borderRadius={20}
              disabled={strTicket.length < 4}
              onClick={() => handleAddTickets()}
            >
              <Text.span
                fontFamily="Roboto-Bold"
                color="white"
                fontSize={32}
                mr={8}
              >
                +
              </Text.span>
              <Text.p
                fontFamily="Roboto-Regular"
                color="white"
                fontSize={16}
                m="auto"
              >
                ADD NEW TICKET
              </Text.p>
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

SingleBuy.propTypes = {
  handleAddTickets: PropTypes.func,
  handleTicketType: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default SingleBuy;
