import { useState, useContext, useEffect } from "react";
import {
  StyledContainer,
  StyledHeader,
  StyledTitles,
  StyledRows,
} from "./style";
import { Text, Flex, Box } from "rimble-ui";
import PropTypes from "prop-types";
import { formatNumber } from "utils/number";
import { Context } from "contexts/anoneProvider";

function WinningTickets(props) {
  let web3Context = useContext(Context);
  const [state, setState] = useState({
    currentAccountAddress: null,
  });
  const setupStates = async () => {
    try {
      const currentAccountAddress = web3Context.currentAccountAddress;
      setState({
        ...state,
        currentAccountAddress,
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(async () => {
    if (web3Context.web3.initialized === true) {
      setupStates();
    }
  }, [web3Context]);
  const { winningTickets } = props;
  return (
    <StyledContainer>
      <StyledHeader>
        <Flex justifyContent="space-between">
          <Box>
            <Text.p color="grey4" fontSize={20} m={0}>
              Your Winning Tickets
            </Text.p>
          </Box>
          <Box>
            <Text.p
              fontFamily="Roboto-Regular"
              color="grey1"
              fontSize={16}
              m={0}
            >
              {state.currentAccountAddress
                ? `Metamask ID: ${state.currentAccountAddress.slice(
                    0,
                    6
                  )}....${state.currentAccountAddress.slice(
                    state.currentAccountAddress.length - 4,
                    state.currentAccountAddress.length
                  )}`
                : ""}
            </Text.p>
          </Box>
        </Flex>
      </StyledHeader>
      <StyledTitles>
        <Flex py={[16]}>
          <Box width={[1 / 4]}>
            <Text.p color="primary" fontSize={16} m={0}>
              Ticket Number
            </Text.p>
          </Box>
          <Box width={[1 / 4]}>
            <Text.p color="primary" fontSize={16} m={0}>
              Match
            </Text.p>
          </Box>
          <Box width={[1 / 4]}>
            <Text.p color="primary" fontSize={16} m={0}>
              No. of Winners
            </Text.p>
          </Box>
          <Box width={[1 / 4]}>
            <Text.p color="primary" fontSize={16} m={0}>
              Tokens Won
            </Text.p>
          </Box>
        </Flex>
      </StyledTitles>
      {winningTickets.map((winningTicket, index) => {
        return (
          <StyledRows key={`winning_ticket_${index}`}>
            <Flex py={[16]}>
              <Box width={[1 / 4]}>
                <Text.p
                  fontFamily="Roboto-Regular"
                  color="grey1"
                  fontSize={16}
                  m={0}
                >
                  {`${winningTicket.ticketNum[0]}${winningTicket.ticketNum[1]}${winningTicket.ticketNum[2]}${winningTicket.ticketNum[3]}`}
                </Text.p>
              </Box>
              <Box width={[1 / 4]}>
                <Text.p
                  fontFamily="Roboto-Regular"
                  color="grey1"
                  fontSize={16}
                  m={0}
                >
                  {winningTicket.matches}
                </Text.p>
              </Box>
              <Box width={[1 / 4]}>
                <Text.p
                  fontFamily="Roboto-Regular"
                  color="grey1"
                  fontSize={16}
                  m={0}
                >
                  {winningTicket.winners}
                </Text.p>
              </Box>
              <Box width={[1 / 4]}>
                <Text.p
                  fontFamily="Roboto-Regular"
                  color="grey1"
                  fontSize={16}
                  m={0}
                >
                  {`${formatNumber(winningTicket.tokensWon)} anone`}
                </Text.p>
              </Box>
            </Flex>
          </StyledRows>
        );
      })}
    </StyledContainer>
  );
}

WinningTickets.propTypes = {
  winningTickets: PropTypes.arrayOf(
    PropTypes.shape({
      ticketNum: PropTypes.array,
      watches: PropTypes.number,
      winners: PropTypes.number,
      tokensWon: PropTypes.string,
    })
  ),
};

export default WinningTickets;
