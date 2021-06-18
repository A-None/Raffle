import { useRef, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import useWindowDimensions from "hooks/useWindowDimensions";
import MultiBuy from "./MultiBuy";
import SingleBuy from "./SingleBuy";
import { Text, Flex, Box, Button } from "rimble-ui";
import Modal from "react-modal";
import { modalStyle } from "theme/modal";
import {
  StyledModalContainer,
  StyledModalHeader,
  StyledModalBody,
  StyledTicketContainer,
  StyledPrice,
  StyledTabs,
  StyledTicketCount,
} from "./style";
import { getTotalPrice, formatNumber, getTotalTickets } from "utils/number";
import Tooltip from "./Tooltip";
import ViewTicketsModal from "./ViewTicketsModal";
import { Context } from "contexts/anoneProvider";
import * as blockchainApi from "apis/blockchain";
import { truncate } from "utils/number";

function BuyModal(props) {
  let web3Context = useContext(Context);

  const [state, setState] = useState({
    balanceOf: 0.0,
  });

  const setupStates = async () => {
    try {
      const anoneContract = web3Context.web3.anoneContract;
      const currentAccountAddress = web3Context.currentAccountAddress;
      const balanceOf = truncate(
        blockchainApi.weiToEth(
          await anoneContract.balanceOf(currentAccountAddress)
        )
      );
      setState({
        ...state,
        balanceOf,
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
  const inputRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [isMulti, setIsMulti] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);

  const handleAddTickets = (newTickets) => {
    setTickets([...tickets, newTickets]);
  };

  const handleEditTickets = (newTickets) => {
    setTickets([...newTickets]);
  };

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevTickets = usePrevious(tickets);

  const scrollToBottom = () => {
    inputRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (prevTickets && prevTickets.length < tickets.length) {
      scrollToBottom();
    }
  }, [tickets, prevTickets]);

  const { height } = useWindowDimensions();

  return (
    <Modal
      isOpen={props.isOpen}
      style={modalStyle}
      onRequestClose={() => props.toggleModal()}
      ariaHideApp={false}
    >
      <StyledModalContainer>
        <StyledModalHeader>
          <Flex justifyContent="space-between">
            <Box>
              <Flex height="100%">
                <Box
                  mr="4px"
                  backgroundColor={isMulti ? "white" : "purple"}
                  borderTopRightRadius="20px"
                  borderTopLeftRadius="20px"
                >
                  <StyledTabs
                    mainColor={isMulti ? "grey4" : "white"}
                    fontFamily="Roboto-Medium"
                    fontSize={16}
                    m={0}
                    fontWeight="400"
                    height="100%"
                    onClick={() => setIsMulti(true)}
                    px="30px"
                  >
                    SELECT RANGE
                  </StyledTabs>
                </Box>
                <Box
                  backgroundColor={isMulti ? "purple" : "white"}
                  borderTopRightRadius="20px"
                  borderTopLeftRadius="20px"
                >
                  <StyledTabs
                    mainColor={isMulti ? "white" : "grey4"}
                    fontFamily="Roboto-Medium"
                    fontSize={16}
                    m={0}
                    fontWeight="400"
                    height="100%"
                    onClick={() => setIsMulti(false)}
                    px="30px"
                  >
                    SINGLE TICKETS
                  </StyledTabs>
                </Box>
              </Flex>
            </Box>
            <Box>
            <Flex flexDirection="column">
                <Box>
                  <Text.p
                    color="grey4"
                    fontFamily="Roboto-Regular"
                    fontSize={16}
                    m={0}
                  >
                    Wallet Balance
                  </Text.p>
                </Box>
                <Box>
                  <Text.p
                    color="grey4"
                    fontFamily="Roboto-Regular"
                    fontSize={16}
                    m={0}
                    textAlign="right"
                    mb={14}
                  >
                    {`${state.balanceOf} anone`}
                  </Text.p>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </StyledModalHeader>
        <StyledModalBody maxHeight={height - height / 5}>
          <StyledTicketContainer>
            {isMulti ? (
              <MultiBuy
                handleAddTickets={(newTickets) => handleAddTickets(newTickets)}
                handleTicketType={() => setIsMulti(false)}
              />
            ) : (
              <SingleBuy
                handleAddTickets={(newTicket) => handleAddTickets(newTicket)}
                handleTicketType={() => setIsMulti(true)}
              />
            )}
            <div ref={inputRef} />
          </StyledTicketContainer>
          <Flex justifyContent="center" mt={[34]}>
            <Box position="relative">
              <Text.span
                fontFamily="Roboto-Regular"
                color="grey4"
                fontSize={16}
              >
                Total Price:{" "}
              </Text.span>
              <StyledPrice
                fontFamily="Roboto-Bold"
                color="green"
                fontSize={16}
                m="auto"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                position="relative"
              >
                {`${formatNumber(getTotalPrice(tickets))} anone`}
                {showTooltip && <Tooltip />}
              </StyledPrice>
              <ViewTicketsModal
                isOpen={viewOpen}
                toggleModal={() => setViewOpen(false)}
                toggleBuy={() => props.toggleModal()}
                tickets={tickets}
                handleEditTickets={(newTickets) =>
                  handleEditTickets(newTickets)
                }
                balance={state.balanceOf}
              />
            </Box>
          </Flex>
          <Flex justifyContent="space-between" mt={[38]} px={[90]}>
            <Box width={[6 / 13]}>
              <Button
                mainColor="grey5"
                height={52}
                width="100%"
                borderRadius={26}
                onClick={() => props.toggleModal()}
              >
                <Text.p
                  fontFamily="Roboto-Regular"
                  color="white"
                  fontSize={16}
                  m="auto"
                >
                  CANCEL
                </Text.p>
              </Button>
            </Box>
            <Box width={[6 / 13]} position="relative">
              {getTotalTickets(tickets) > 0 && <StyledTicketCount>
                  <Text fontFamily="Roboto-Regular"
                  color="white"
                  fontSize={14}
                  m="auto">
                    {formatNumber(getTotalTickets(tickets))}
                  </Text>
                </StyledTicketCount>}
              <Button
                mainColor="primary"
                height={52}
                width="100%"
                borderRadius={26}
                disabled={getTotalPrice(tickets) <= 0}
                onClick={() => setViewOpen(true)}
              >
                <Text.p
                  fontFamily="Roboto-Regular"
                  color="white"
                  fontSize={16}
                  m="auto"
                >
                  VIEW TICKETS
                </Text.p>
              </Button>
            </Box>
          </Flex>
        </StyledModalBody>
      </StyledModalContainer>
    </Modal>
  );
}

BuyModal.propTypes = {
  toggleModal: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default BuyModal;
