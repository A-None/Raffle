import { useState, useContext, useEffect } from "react";
import { Flex, Box, Text, Button } from "rimble-ui";
import { StyledBox, StyledWinningCard, StyledWinningText } from "./style";
import WinningTickets from "./WinningTickets";
import { formatNumber } from "utils/number";
import RaffleHistoryModal from "./RaffleHistoryModal";
import * as blockchainApi from "apis/blockchain";
import { Context } from "contexts/anoneProvider";
import { truncate, decrement } from "utils/number";

function DrawCard() {
  let web3Context = useContext(Context);
  const [state, setState] = useState({
    currentAccountAddress: "",
    LotteryContract: null,
    lotteryNFTContract: null,
    burnedAmount: 0.0,
    winningNumbers: [0, 0, 0, 0],
    winningTickets: [],
  });
  const setupStates = async () => {
    try {
      const lotteryContract = web3Context.web3.LotteryContract;
      const lotteryNFTContract = web3Context.web3.lotteryNFTContract;
      const issueIndex = web3Context.web3.issueIndex;
      let winningNumbers = [
        await lotteryContract.winningNumbers(0),
        await lotteryContract.winningNumbers(1),
        await lotteryContract.winningNumbers(2),
        await lotteryContract.winningNumbers(3),
      ];
      const burnedIndexes = web3Context.web3.burnedAmount;
      let burnedAmount = 0;
      for (let burnedIndex of burnedIndexes) {
        burnedAmount += parseFloat(burnedIndex);
      }
      let winningTickets = [];
      let allTickets = await blockchainApi.getUserTickets(
        lotteryContract,
        lotteryNFTContract,
        web3Context.currentAccountAddress
      );
      allTickets = allTickets.filter(
        (ticket) => ticket.issueIndex === web3Context.web3.issueIndex && !ticket.isClaimed
      );
      for (let ticket of allTickets) {
        if (ticket.issueIndex === issueIndex && winningNumbers[0] !== 0) {
          let matches = 0;
          for (let i = 0; i < ticket.ticketNum.length; i++) {
            if (ticket.ticketNum[i] === winningNumbers[i] - 1) {
              matches++;
            }
          }
          if (matches > 1) {
            const winners = parseInt(blockchainApi.weiToEth(await lotteryContract.historyAmount(
              issueIndex,
              5 - matches
            ))) / 10;
            const tokensWon = truncate(blockchainApi.weiToEth(await lotteryContract.getRewardView(
              ticket.NFTNum
            )));
            winningTickets.push({
              ticketNum: ticket.ticketNum,
              matches,
              winners,
              tokensWon,
              NFTNum: ticket.NFTNum,
            });
          }
        }
      }
      if (issueIndex !== 0 && winningNumbers[0] === 0) {
        winningNumbers = [
          await lotteryContract.historyNumbers(issueIndex - 1, 0),
          await lotteryContract.historyNumbers(issueIndex - 1, 1),
          await lotteryContract.historyNumbers(issueIndex - 1, 2),
          await lotteryContract.historyNumbers(issueIndex - 1, 3),
        ];
      }
      winningNumbers = decrement(winningNumbers);
      setState({
        ...state,
        lotteryContract,
        lotteryNFTContract,
        burnedAmount,
        currentAccountAddress: web3Context.currentAccountAddress,
        winningNumbers,
        winningTickets,
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
  const handleClaim = async () => {
    const NFTNumbers = [];
    state.winningTickets.map(winningTicket => NFTNumbers.push(winningTicket.NFTNum));
    await blockchainApi.multiClaim(state.lotteryContract, NFTNumbers);
    setState({...state, winningTickets: []});
  }
  let sum = 0;
  state.winningTickets.map((winningTicket) => (sum += parseFloat(winningTicket.tokensWon)));
  const [historyOpen, setHistoryOpen] = useState(false);
  return (
    <Flex mt={32} mb={75}>
      <StyledBox px={[60]} pt={[36]} pb={[30]}>
        <Flex flexDirection="column" alignItems="center">
          <Text.p
            color="grey1"
            fontSize={24}
            m={0}
            mb={[26]}
            textAlign="center"
          >
            anone Burned to date :
            <Text.span color="green" fontSize={24} m={0}>
              {` ${state.burnedAmount} anone`}
            </Text.span>
            !
          </Text.p>
          <Text.p color="grey1" fontSize={24} m={0} textAlign="center">
            Latest Draw
          </Text.p>
          <Flex mt={[16]}>
            {state.winningNumbers.map((winningNumber, i) => {
              return (
                <Box key={`winning_num_${i}`}>
                  <StyledWinningCard>
                    <Text.p
                      color="primary"
                      fontSize={[28, 50]}
                      m={"auto"}
                      textAlign="center"
                    >
                      {winningNumber}
                    </Text.p>
                  </StyledWinningCard>
                </Box>
              );
            })}
          </Flex>
          {state.winningTickets.length > 0 ? (
              <StyledWinningText>
                <Text.span
                  color="grey1"
                  fontSize={[28]}
                  m={"auto"}
                  textAlign="center"
                >
                  {"Congratulations! You won"}
                </Text.span>
                <Text.span
                  color="orange"
                  fontSize={[28]}
                  m={"auto"}
                  textAlign="center"
                >{` ${formatNumber(truncate(sum.toString()))} anone!`}</Text.span>
                <WinningTickets winningTickets={state.winningTickets} />
                <Box mt={[32]}>
                <Button
                  mainColor="orange"
                  width={[200, 267]}
                  height={[48, 60]}
                  borderRadius={[24, 30]}
                  onClick={() => handleClaim()}
                >
                  <Text.p
                    fontFamily="Roboto-Regular"
                    color="white"
                    fontSize={20}
                  >
                    CLAIM PRIZE
                  </Text.p>
                </Button>
              </Box>
              </StyledWinningText>
          ) : (
            <Box mt={[38]}>
              <Text.p color="grey2" fontSize={20} m={0} textAlign="center">
                No Winning Tickets
              </Text.p>
            </Box>
          )}
          <Box mt={[24]}>
            <Button.Text
              fontFamily="Roboto-Regular"
              mainColor="primary"
              p={[0]}
              fontSize={16}
              height="auto"
              onClick={() => setHistoryOpen(true)}
            >
              RAFFLE HISTORY
            </Button.Text>
          </Box>
        </Flex>
        {historyOpen && (
          <RaffleHistoryModal
            isOpen={historyOpen}
            toggleModal={() => setHistoryOpen(false)}
          />
        )}
      </StyledBox>
    </Flex>
  );
}

export default DrawCard;
