import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Field, Button } from "rimble-ui";
import { StyledButton, StyledInput } from "./style";
import ranges from "./ranges";

function MultiBuy(props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState(false);
  // const [tickets, setTickets] = useState([]);
  const [buttonIndex, setButtonIndex] = useState(null);

  const handleRangeChange = (range, index) => {
    setButtonIndex(index);
    setFrom(range[0]);
    setTo(range[1]);
  };

  const handleInputChange = (e, inputType) => {
    e.preventDefault();
    const value = e.target.value;
    const input = inputType === "from" ? from : to;
    if (
      (input.length < 4 || value.length < 4) &&
      (/^\d+$/.test(value) || value === "")
    ) {
      inputType === "from" ? setFrom(value) : setTo(value);
      setButtonIndex(null);
    }
  };

  const handleAddTickets = () => {
    const lower = parseInt(from);
    const upper = parseInt(to) + 1;
    if (lower >= upper - 1) {
      setError(true);
      return;
    }
    const tickets = [];
    for (let i = lower; i < upper; i++) {
      let strTicket = i.toString();
      let ticket = [];
      while (strTicket.length < 4) {
        strTicket = "0" + strTicket;
      }
      for (let num of strTicket) {
        ticket.push(parseInt(num));
      }
      tickets.push(ticket);
    }
    props.handleAddTickets(tickets);
  };

  useEffect(() => {
    setError(false);
  }, [from, to]);

  return (
    <Flex flexDirection="column">
      <Box>
        <Flex flexWrap="wrap" maxWidth={880}>
          {ranges.map((range, index) => {
            return (
              <StyledButton
                mainColor={`${index === buttonIndex ? "grey1" : "white"}`}
                key={`buy_range_${index}`}
                onClick={() => handleRangeChange(range, index)}
              >
                <Text
                  fontSize={16}
                  fontFamily="Roboto-Regular"
                  color={`${index === buttonIndex ? "white" : "primary"}`}
                >
                  {`${range[0]} - ${range[1]}`}
                </Text>
              </StyledButton>
            );
          })}
        </Flex>
        <Flex justifyContent="space-between" mt={[24]}>
          <Box width={[9 / 19]}>
            <Field label="From" fontFamily="Roboto-Regular">
              <StyledInput
                type="text"
                required={true}
                placeholder="0000"
                onChange={(e) => handleInputChange(e, "from")}
                value={from}
              />
            </Field>
          </Box>
          <Box width={[9 / 19]}>
            <Field label="To" fontFamily="Roboto-Regular">
              <StyledInput
                type="text"
                required={true}
                placeholder="0000"
                onChange={(e) => handleInputChange(e, "to")}
                value={to}
              />
            </Field>
          </Box>
        </Flex>
        {error && (
          <Text.p
            fontFamily="Roboto-Regular"
            color="red"
            fontSize={16}
            textAlign="center"
            mb={0}
          >
            The selected range is invalid
          </Text.p>
        )}
        <Flex px={[8]} mt={[50]} justifyContent="center">
          <Box>
            <Button
              mainColor="green"
              height={40}
              width={[184]}
              borderRadius={20}
              disabled={from.length < 4 || to.length < 4}
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

MultiBuy.propTypes = {
  handleAddTickets: PropTypes.func,
  handleTicketType: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default MultiBuy;
