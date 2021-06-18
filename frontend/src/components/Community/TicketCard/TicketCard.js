import { useState, useEffect, useContext } from "react";
import { Flex, Box, Text, Button, MetaMaskButton } from "rimble-ui";
import {
  StyledBox,
  StyledButtonBox,
  StyledTicket,
  StyledTicketContainer,
} from "./style";
import MechanicsModal from "./MechanicsModal";
import BuyModal from "./BuyModal";
import TicketHistoryModal from "./TicketHistoryModal";
import Ticket from "assets/ticket.png";
import LargeTicket from "assets/ticket_large.png";
import { timeTillDraw } from "utils/timer";
import { Context } from "contexts/anoneProvider";
import * as blockchainApi from "apis/blockchain";
import { truncate } from "utils/number";

function TicketCard() {
  const [mechanicsOpen, setMechanicsOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [timer, setTimer] = useState(timeTillDraw());
  const [totalPot, setTotalPot] = useState(0.0);
  const [lotteryTickets, setLotteryTickets] = useState([]);
  let web3Context = useContext(Context);

  const [state, setState] = useState({
    currentAccountAddress: "",
    LotteryContract: null,
    drawingPhase: true,
  });
  let totalPotUpdater = () => {};
  let lotteryTicketsUpdater = () => {};
  const setupStates = async () => {
    try {
      const lotteryContract = web3Context.web3.LotteryContract;
      const lotteryNFTContract = web3Context.web3.lotteryNFTContract;
      const potSize = truncate(blockchainApi.weiToEth(await lotteryContract.getTotalRewards(await lotteryContract.issueIndex())));
      let currTickets = await blockchainApi.getUserTickets(lotteryContract, lotteryNFTContract, web3Context.currentAccountAddress);
      currTickets = currTickets.filter(currTicket => currTicket.issueIndex === web3Context.web3.issueIndex);
      totalPotUpdater = setInterval(async () => {
        const potSize = truncate(blockchainApi.weiToEth(await lotteryContract.getTotalRewards(await lotteryContract.issueIndex())));
        setTotalPot(potSize);
      }, 3000);
      lotteryTicketsUpdater = setInterval(async () => {
        let currTickets = await blockchainApi.getUserTickets(lotteryContract, lotteryNFTContract, web3Context.currentAccountAddress);
        currTickets = currTickets.filter(currTicket => currTicket.issueIndex === web3Context.web3.issueIndex);
        setLotteryTickets(currTickets);
      }, 3000);
      setState({
        ...state,
        lotteryContract,
        drawingPhase: web3Context.web3.drawed,
      });
      setTotalPot(potSize);
      setLotteryTickets(currTickets);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(async () => {
    if (web3Context.web3.initialized === true) {
    setupStates();
  }
  }, [web3Context]);
  useEffect(() => {
    setInterval(() => {
      setTimer(timeTillDraw());
    }, 1000);
    return () => {
      clearInterval(totalPotUpdater);
      clearInterval(lotteryTicketsUpdater);
    };
  }, []);
  useEffect(() => {
    const tempTickets = [];
    let tempBulkTickets = [];
    let counter = 0;
    for (let i = 0; i <= lotteryTickets.length; i++) {
      if (counter >= 15) {
        tempTickets.push(
          <StyledTicketContainer key={`more_tickets_${i}`}>
            <Button.Text
              width={99}
              onClick={() => setHistoryOpen(true)}
              fontFamily="Roboto-Regular"
            >
              MORE
            </Button.Text>
          </StyledTicketContainer>
        );
        break;
      }
      if (i !== lotteryTickets.length) {
        if (
          tempBulkTickets.length === 0 ||
          (tempBulkTickets[tempBulkTickets.length - 1].date === lotteryTickets[i].date &&
            parseInt(tempBulkTickets[tempBulkTickets.length - 1].ticketNum.join("")) ==
            parseInt(lotteryTickets[i].ticketNum.join("")) - 1)
        ) {
          tempBulkTickets.push(lotteryTickets[i]);
          continue;
        }
      } else {
        if (tempBulkTickets.length === 0) break;
      }
      if (tempBulkTickets.length > 1) {
        tempTickets.push(
          <StyledTicketContainer position="relative" key={`tickets_${i}`}>
            <img src={LargeTicket} />
            <StyledTicket color="grey1" fontSize={20} m={0}>
              {`${tempBulkTickets[0].ticketNum.join("")}-${
                tempBulkTickets[tempBulkTickets.length - 1].ticketNum.join("")
              }`}
            </StyledTicket>
          </StyledTicketContainer>
        );
        counter += 2;
      } else {
        tempTickets.push(
          <StyledTicketContainer position="relative" key={`tickets_${i}`}>
            <img src={Ticket} />
            <StyledTicket color="grey1" fontSize={20} m={0}>
              {`${tempBulkTickets[0].ticketNum.join("")}`}
            </StyledTicket>
          </StyledTicketContainer>
        );
        counter += 1;
      }
      tempBulkTickets = [];
      tempBulkTickets.push(lotteryTickets[i]);
    }
    setTickets([...tempTickets]);
  }, [lotteryTickets]);
  return (
    <Flex>
      <StyledBox px={[56, 112]} pt={[36, 56]} pb={[18, 36]}>
        <Flex flexDirection="column" alignItems="center">
          <Text.p color="grey1" fontSize={24} m={0} textAlign="center">
            anone Raffle — Year-Long Daily Draw For
            <Text.span color="green" fontSize={24} m={0}>
              {" "}
              36,750,000 anone
            </Text.span>
            !
          </Text.p>
          <Text.p
            color="grey1"
            fontSize={16}
            m={0}
            textAlign="center"
            maxWidth={[672]}
          >
            Buy tickets for 10 anone, and win prizes if 2, 3, or 4 of your ticket
            numbers match the winning numbers and their exact order!
          </Text.p>
          <Text.p
            color="grey1"
            fontSize={24}
            m={0}
            mt={[50]}
            textAlign="center"
          >
            Current Pot Size
          </Text.p>
          <Text.p color="orange" fontSize={36} m={0} textAlign="center">
            {`${totalPot} anone`}
          </Text.p>
          <Text.p
            fontFamily="Roboto-Regular"
            color="red"
            fontSize={16}
            m={0}
            textAlign="center"
          >
            {`Next Draw in ${timer}`}
          </Text.p>
          <Box mt={[48]}>
            <Button
              width={[200, 267]}
              height={[48, 60]}
              borderRadius={[24, 30]}
              onClick={() => setBuyOpen(true)}
              disabled={state.drawingPhase}
            >
              <Text.p fontFamily="Roboto-Regular" color="white" fontSize={20}>
                {state.drawingPhase ? "DRAWING PHASE..." : "BUY TICKETS"}
              </Text.p>
            </Button>
          </Box>
          <Box>
          {web3Context.currentAccountAddress.length === 0 && (
            <MetaMaskButton.Outline mt={[48]} onClick={() => {
              blockchainApi.connectToMetamask(
                web3Context.web3.metamaskProvider
              );
            }}>Connect with MetaMask</MetaMaskButton.Outline>
          )}
          </Box>
          <Box mt={[26]}>
            <Text.p color="grey1" fontSize={20} m={0} textAlign="center">
              My Tickets :
              <Text.span color="primary" fontSize={20} m={0}>
                {" "}
                {lotteryTickets.length}
              </Text.span>
            </Text.p>
          </Box>
          {lotteryTickets.length > 0 && (
            <Box mt={[26]}>
              <Flex flexWrap="wrap" maxWidth={880} justifyContent="center">
                {tickets}
              </Flex>
            </Box>
          )}
          <Flex mt={[42]}>
            <StyledButtonBox px={[16]}>
              <Button.Text
                fontFamily="Roboto-Regular"
                mainColor="primary"
                p={[0]}
                fontSize={16}
                height="auto"
                onClick={() => setHistoryOpen(true)}
              >
                TICKET HISTORY
              </Button.Text>
            </StyledButtonBox>
            <Box px={[16]}>
              <Button.Text
                fontFamily="Roboto-Regular"
                mainColor="primary"
                p={[0]}
                fontSize={16}
                height="auto"
                onClick={() => setMechanicsOpen(true)}
              >
                READ MECHANICS
              </Button.Text>
            </Box>
          </Flex>
        </Flex>
      </StyledBox>
      <MechanicsModal
        isOpen={mechanicsOpen}
        toggleModal={() => setMechanicsOpen(!mechanicsOpen)}
      />
      {buyOpen && (
        <BuyModal isOpen={buyOpen} toggleModal={() => setBuyOpen(false)} />
      )}
      {historyOpen && (
        <TicketHistoryModal
          isOpen={historyOpen}
          toggleModal={() => setHistoryOpen(!historyOpen)}
        />
      )}
    </Flex>
  );
}

export default TicketCard;
