import React, { useContext, useState, useEffect } from "react";
import {
  StyledModalContainer,
  StyledModalHeader,
  StyledModalBody,
  StyledTitles,
  StyledTicket,
  StyledModalFooter,
  StyledPrice,
  StyledMinimalButton,
} from "./style";
import { Text, Flex, Box, Button, Input } from "rimble-ui";
import Modal from "react-modal";
import { modalStyle } from "theme/modal";
import Tooltip from "../Tooltip";
import PropTypes from "prop-types";
import {
  getTotalPrice,
  formatNumber,
  getTotalTickets,
  getPerPrice,
} from "utils/number";
import { ReactComponent as Edit } from "assets/edit.svg";
import { ReactComponent as Trash } from "assets/trash.svg";
import { Context } from "contexts/anoneProvider";
import * as blockchainApi from "apis/blockchain";

function ViewTicketsModal(props) {
  let web3Context = useContext(Context);

  const [state, setState] = useState({
    currentAccountAddress: "",
    anoneContract: null,
    LotteryContract: null,
    allowance: null,
    approveLoading: false,
    buyLoading: false,
    drawed: false,
  });

  const setupStates = async () => {
    try {
      const anoneContract = web3Context.web3.anoneContract;
      const currentAccountAddress = web3Context.currentAccountAddress;
      const LotteryContract = web3Context.web3.LotteryContract;
      const allowance = blockchainApi.weiToEth(
        await blockchainApi.getAllowance(
          anoneContract,
          currentAccountAddress,
          LotteryContract.address
        )
      );
      const drawed = web3Context.web3.drawed;
      setState({
        ...state,
        anoneContract,
        currentAccountAddress,
        allowance,
        LotteryContract,
        drawed,
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

  const handleApprove = async () => {
    setState({ ...state, approveLoading: true });
    await blockchainApi.approveTransfer(
      state.anoneContract,
      state.LotteryContract.address,
      await state.anoneContract.totalSupply()
    );
    setupStates();
  };

  const handleBuy = async () => {
    setState({ ...state, buyLoading: true });
    let allTickets = [];
    for (let bulk of props.tickets) {
      for (let ticket of bulk) {
        allTickets.push(ticket);
      }
    }
    allTickets = allTickets.map((currTicket) => {
      return currTicket.map((val) => {
        return ++val;
      });
    });
    await blockchainApi.multiBuy(
      state.LotteryContract,
      blockchainApi.ethToWei(getPerPrice(props.tickets)),
      allTickets
    );
    setupStates();
    props.toggleBuy();
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const [edit, setEdit] = useState({});
  const [tickets, setTickets] = useState([]);
  const [editedTickets, setEditedTickets] = useState({});
  const handleEdit = (index) => {
    setEdit({ ...edit, [index]: true });
  };
  const handleUnEdit = (index) => {
    const editCopy = edit;
    const editedTicketsCopy = editedTickets;
    delete editCopy[index];
    delete editedTicketsCopy[index];
    setEdit({ ...editCopy });
    setEditedTickets({ ...editedTicketsCopy });
  };
  const handleEditTicket = (e, index, inputType) => {
    e.preventDefault();
    const value = e.target.value;
    if (value.length < 5 && (/^\d+$/.test(value) || value === "")) {
      setEditedTickets({ ...editedTickets, [index]: { [inputType]: value } });
    }
  };
  const handleEditSingleTicket = (e, index) => {
    e.preventDefault();
    const value = e.target.value;
    if (value.length < 5 && (/^\d+$/.test(value) || value === "")) {
      setEditedTickets({
        ...editedTickets,
        [index]: { from: value, to: value },
      });
    }
  };
  const handleSave = (index, from, to) => {
    const lower = editedTickets[index]
      ? editedTickets[index].from ?? from
      : from;
    const upper = editedTickets[index] ? editedTickets[index].to ?? to : to;
    const lowerNum = parseInt(lower);
    const upperNum = parseInt(upper);
    if (
      lower.length < 4 ||
      upper.length < 4 ||
      lowerNum > upperNum ||
      (from !== to && lower === upper)
    ) {
      return;
    }
    const newTickets = [];
    for (let i = lowerNum; i < upperNum + 1; i++) {
      let strTicket = i.toString();
      let ticket = [];
      while (strTicket.length < 4) {
        strTicket = "0" + strTicket;
      }
      for (let num of strTicket) {
        ticket.push(parseInt(num));
      }
      newTickets.push(ticket);
    }
    const ticketsCopy = tickets;
    ticketsCopy[index] = newTickets;
    props.handleEditTickets(ticketsCopy);
    handleUnEdit(index);
  };
  const handleDelete = (index) => {
    const ticketsCopy = tickets;
    ticketsCopy.splice(index, 1);
    props.handleEditTickets(ticketsCopy);
  };

  useEffect(() => {
    setTickets(props.tickets);
  });

  const shouldApprove =
    parseInt(state.allowance) < parseInt(formatNumber(getTotalPrice(tickets)));
  const insufficientBalance = props.balance < getTotalPrice(tickets);
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
              <Text.p
                color="grey4"
                fontFamily="Roboto-Medium"
                fontSize={20}
                m={0}
              >
                Selected Tickets
              </Text.p>
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
                  >
                    {`${props.balance} anone`}
                  </Text.p>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </StyledModalHeader>
        <StyledModalBody maxHeight={228}>
          <StyledTitles>
            <Flex py={[16]}>
              <Box width={[1 / 3]}>
                <Text.p color="primary" fontSize={16} m={0} textAlign="center">
                  Ticket Number
                </Text.p>
              </Box>
              <Box width={[1 / 3]}>
                <Text.p color="primary" fontSize={16} m={0} textAlign="center">
                  Quantity
                </Text.p>
              </Box>
              <Box width={[1 / 3]}>
                <Text.p color="primary" fontSize={16} m={0} textAlign="center">
                  Actions
                </Text.p>
              </Box>
            </Flex>
          </StyledTitles>
          {tickets.map((ticket, index) => {
            const startRange = ticket[0];
            const endRange = ticket[ticket.length - 1];
            const from = `${startRange[0]}${startRange[1]}${startRange[2]}${startRange[3]}`;
            const to = `${endRange[0]}${endRange[1]}${endRange[2]}${endRange[3]}`;
            return (
              <StyledTicket py={[16]} key={`view_tickets_${index}`}>
                <Box width={[1 / 3]}>
                  {edit[index] ? (
                    ticket.length > 1 ? (
                      <Flex justifyContent="center" alignItems="center">
                        <Box width={1 / 3}>
                          <Input
                            width="100%"
                            height={36}
                            p={0}
                            placeholder="0000"
                            value={
                              editedTickets[index]
                                ? editedTickets[index].from ?? from
                                : from
                            }
                            textAlign="center"
                            onChange={(e) => handleEditTicket(e, index, "from")}
                          />
                        </Box>
                        <Box width="auto">
                          <Text.span
                            fontFamily="Roboto-Regular"
                            color="grey1"
                            fontSize={16}
                            m={0}
                            mx={1}
                            textAlign="center"
                          >
                            -
                          </Text.span>
                        </Box>
                        <Box width={1 / 3}>
                          <Input
                            width="100%"
                            height={36}
                            p={0}
                            placeholder="0000"
                            value={
                              editedTickets[index]
                                ? editedTickets[index].to ?? to
                                : to
                            }
                            textAlign="center"
                            onChange={(e) => handleEditTicket(e, index, "to")}
                          />
                        </Box>
                      </Flex>
                    ) : (
                      <Flex justifyContent="center" alignItems="center">
                        <Box>
                          <Input
                            width="100%"
                            height={36}
                            p={0}
                            placeholder="0000"
                            value={
                              editedTickets[index]
                                ? editedTickets[index].from ?? from
                                : from
                            }
                            textAlign="center"
                            onChange={(e) => handleEditSingleTicket(e, index)}
                          />
                        </Box>
                      </Flex>
                    )
                  ) : (
                    <Text.p
                      fontFamily="Roboto-Regular"
                      color="grey1"
                      fontSize={16}
                      m={0}
                      textAlign="center"
                    >
                      {ticket.length > 1 ? `${from}-${to}` : `${from}`}
                    </Text.p>
                  )}
                </Box>
                <Box width={[1 / 3]}>
                  <Text.p
                    fontFamily="Roboto-Regular"
                    color="grey1"
                    fontSize={16}
                    m={0}
                    textAlign="center"
                  >
                    {ticket.length}
                  </Text.p>
                </Box>
                <Box width={[1 / 3]}>
                  <Text.p
                    fontFamily="Roboto-Regular"
                    color="grey1"
                    fontSize={16}
                    m={0}
                    textAlign="center"
                  >
                    {edit[index] ? (
                      <Flex justifyContent="center">
                        <Box mr={16}>
                          <StyledMinimalButton
                            onClick={() => handleSave(index, from, to)}
                          >
                            <Text.p
                              fontFamily="Roboto-Regular"
                              color="primary"
                              fontSize={16}
                              m={0}
                              textAlign="center"
                            >
                              SAVE
                            </Text.p>
                          </StyledMinimalButton>
                        </Box>
                        <Box ml={16}>
                          <StyledMinimalButton
                            onClick={() => handleUnEdit(index)}
                          >
                            <Text.p
                              fontFamily="Roboto-Regular"
                              color="primary"
                              fontSize={16}
                              m={0}
                              textAlign="center"
                            >
                              CLOSE
                            </Text.p>
                          </StyledMinimalButton>
                        </Box>
                      </Flex>
                    ) : (
                      <Flex justifyContent="center">
                        <Box mr={16}>
                          <StyledMinimalButton
                            onClick={() => handleEdit(index)}
                          >
                            <Edit />
                          </StyledMinimalButton>
                        </Box>
                        <Box ml={16}>
                          <StyledMinimalButton
                            onClick={() => handleDelete(index)}
                          >
                            <Trash />
                          </StyledMinimalButton>
                        </Box>
                      </Flex>
                    )}
                  </Text.p>
                </Box>
              </StyledTicket>
            );
          })}
        </StyledModalBody>
        <StyledModalFooter>
          <Flex justifyContent="space-between">
            <Box width={[50 / 101]}>
              <Flex justifyContent="flex-end">
                <Box>
                  <Text.p
                    fontFamily="Roboto-Regular"
                    color="grey4"
                    fontSize={16}
                    m={0}
                    textAlign="right"
                    mb={[10]}
                  >
                    Total Tickets:
                  </Text.p>
                  <Text.p
                    fontFamily="Roboto-Regular"
                    color="grey4"
                    fontSize={16}
                    m={0}
                    textAlign="right"
                  >
                    Total Price:
                  </Text.p>
                </Box>
              </Flex>
            </Box>
            <Box width={[50 / 101]}>
              <Text.p
                fontFamily="Roboto-Bold"
                color="green"
                fontSize={16}
                m="auto"
                mb={[10]}
              >
                {` ${formatNumber(getTotalTickets(tickets))}`}
              </Text.p>
              <Flex>
                <Box>
                  <StyledPrice
                    fontFamily="Roboto-Bold"
                    color="green"
                    fontSize={16}
                    m="auto"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    position="relative"
                  >
                    {` ${formatNumber(getTotalPrice(tickets))} anone`}
                    {showTooltip && <Tooltip />}
                  </StyledPrice>
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Flex justifyContent="space-between" mt={[40]}>
            <Box width={[10 / 21]}>
              <Button
                width="100%"
                height={[52]}
                borderRadius={[26]}
                mainColor="green"
                onClick={() => props.toggleModal()}
              >
                <Text.p
                  fontFamily="Roboto-Regular"
                  color="white"
                  fontSize={16}
                  m="auto"
                >
                  ADD MORE
                </Text.p>
              </Button>
            </Box>
            <Box width={[10 / 21]}>
              <Button
                width="100%"
                height={[52]}
                borderRadius={[26]}
                onClick={() => (shouldApprove ? handleApprove() : handleBuy())}
                disabled={
                  state.approveLoading ||
                  state.buyLoading ||
                  insufficientBalance ||
                  state.drawed
                }
              >
                <Text.p
                  fontFamily="Roboto-Regular"
                  mainColor="primary"
                  fontSize={16}
                  m="auto"
                >
                  {`${
                    insufficientBalance
                      ? "INSUFFICIENT BALANCE"
                      : shouldApprove
                      ? state.approveLoading
                        ? "APPROVING"
                        : "APPROVE anone"
                      : state.buyLoading
                      ? "BUYING"
                      : "BUY"
                  }`}
                </Text.p>
              </Button>
            </Box>
          </Flex>
        </StyledModalFooter>
      </StyledModalContainer>
    </Modal>
  );
}

ViewTicketsModal.propTypes = {
  toggleModal: PropTypes.func,
  toggleBuy: PropTypes.func,
  handleEditTickets: PropTypes.func,
  isOpen: PropTypes.bool,
  tickets: PropTypes.array,
  balance: PropTypes.string,
};

export default ViewTicketsModal;
