import { useRef, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import useWindowDimensions from "hooks/useWindowDimensions";
import { Text, Box, Flex, Button } from "rimble-ui";
import Modal from "react-modal";
import { modalStyle } from "theme/modal";
import {
  StyledModalContainer,
  StyledModalHeader,
  StyledModalBody,
  StyledTitles,
  StyledRows,
  StyledInput,
  StyledButtonContainer,
  StyledInputContainer,
  StyledModalFooter,
  StyledBlankButton,
  StyledDropdown,
  StyledPagination,
  StyledArrowDown,
  StyledArrowUp,
  StyledArrowDown2,
  StyledPaginationContainer,
  StyledPaginationContainer2,
  StyledTokensWon,
  StyledOrangeCircle,
  StyledOuterFlex,
} from "./style";
import SearchIcon from "assets/search-solid.png";
import { formatNumber } from "utils/number";
import Tooltip from "./Tooltip";
import TicketHistoryModal from "../../TicketCard/TicketHistoryModal";
import { Context } from "contexts/anoneProvider";
import { formatDate2 } from "utils/timer";
import * as blockchainApi from "apis/blockchain";

function RaffleHistoryModal(props) {
  let web3Context = useContext(Context);
  const [state, setState] = useState({
    currentAccountAddress: "",
    LotteryContract: null,
    tickets: [],
    raffleHistory: [],
  });
  const setupStates = async () => {
    try {
      const lotteryContract = web3Context.web3.LotteryContract;
      let raffleHistory = web3Context.web3.raffleHistory;
      let tickets = web3Context.userTickets;
      raffleHistory = raffleHistory.reverse();
      setFilterHistory(raffleHistory);
      setState({
        ...state,
        lotteryContract,
        raffleHistory,
        tickets,
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
  const [filterHistory, setFilterHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downArrow, setDownArrow] = useState(true);
  const [allClaimed, setAllClaimed] = useState(false);

  const { height } = useWindowDimensions();

  const dropdownRef = useRef(null);
  const mouseDown = (event) => {
    if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", mouseDown);
    return () => {
      document.removeEventListener("mousedown", mouseDown);
    };
  });

  const handleFilter = (e) => {
    setFilterHistory(
      state.raffleHistory.filter(
        (history) =>
          formatDate2(history.date).toLowerCase().includes(e.target.value) ||
          history.historyNumbers.join("").includes(e.target.value)
      )
    );
  };

  const handleSetRows = (rowSize) => {
    setRows(rowSize);
    const newPages = Math.floor(filterHistory.length / rowSize);
    if (newPages < currPages.length) {
      setPage(newPages);
    }
    setDropdownOpen(false);
  };

  const rowSizes = [10, 20, 30, 40, 50];
  const currPages = [
    ...Array(Math.floor(filterHistory.length / rows) + 1).keys(),
  ];
  const handleClaim = async () => {
    let NFTNumbers = [];
    const winningTickets = state.tickets.filter(history => !history.isClaimed && history.tokensWon > 0);
    winningTickets.map(winningTicket => NFTNumbers.push(winningTicket.NFTNum));
    await blockchainApi.multiClaim(state.lotteryContract, NFTNumbers);
    setAllClaimed(true);
  }
  return (
    <Modal
      isOpen={props.isOpen}
      style={modalStyle}
      onRequestClose={() => props.toggleModal()}
      ariaHideApp={false}
    >
      <StyledModalContainer>
        <StyledModalHeader>
          <Flex justifyContent="space-between" alignItems="flex-end">
            <Box>
              <Text.p
                color="grey4"
                fontFamily="Roboto-Medium"
                fontSize={20}
                m={0}
              >
                Raffle History
              </Text.p>
            </Box>
            <Box>
              <StyledInputContainer>
                <StyledInput
                  type="text"
                  required={true}
                  placeholder="Filter"
                  onChange={(e) => handleFilter(e)}
                />
                <StyledButtonContainer>
                  <img src={SearchIcon} />
                </StyledButtonContainer>
              </StyledInputContainer>
            </Box>
          </Flex>
        </StyledModalHeader>
        <StyledModalBody maxHeight={height - height / 2}>
          <StyledTitles>
            <Flex py={[16]} textAlign="center" alignItems="center">
              <Box width={[1 / 7]}>
                <Flex alignItems="center" justifyContent="center">
                  <Box>
                    <Button.Text
                      fontFamily="Roboto-Medium"
                      color="primary"
                      fontSize={16}
                      height="auto"
                      fontWeight="400"
                      onClick={() => {
                        setFilterHistory([...filterHistory.reverse()]);
                        setDownArrow(!downArrow);
                      }}
                      m={0}
                    >
                      Date
                    </Button.Text>
                  </Box>
                  <Box>
                    {downArrow ? <StyledArrowDown2 /> : <StyledArrowUp />}
                  </Box>
                </Flex>
              </Box>
              <Box width={[1 / 9]}>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  Draw Result
                </Text.p>
              </Box>
              <Box width={[1 / 9]}>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  4
                </Text.p>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  Matches
                </Text.p>
              </Box>
              <Box width={[1 / 9]}>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  3
                </Text.p>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  Matches
                </Text.p>
              </Box>
              <Box width={[1 / 9]}>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  2
                </Text.p>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  Matches
                </Text.p>
              </Box>
              <Box width={[2 / 9]}>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  Tokens in POT
                </Text.p>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  (anone) | (USDT)
                </Text.p>
              </Box>
              <Box width={[1 / 7]}>
                <Text.p
                  fontFamily="Roboto-Medium"
                  color="primary"
                  fontSize={16}
                  m={0}
                >
                  Tokens Burned (anone)
                </Text.p>
              </Box>
            </Flex>
          </StyledTitles>
          {filterHistory
            .slice(
              page * rows,
              Math.min(filterHistory.length, (page + 1) * rows)
            )
            .map((history, index) => {
              let sum = 0;
              state.tickets.map(async (ticket) => {
                if (ticket.issueIndex === history.issueIndex && !ticket.isClaimed) {
                  sum += await state.lotteryContract.getRewardView(ticket.NFTNum);
                }
              });
              return (
                <StyledRows key={`raffle_${index}`}>
                  <Flex py={[16]} textAlign="center">
                    <Box width={[1 / 7]}>
                      <Text.p
                        fontFamily="Roboto-Regular"
                        color="grey1"
                        fontSize={16}
                        m={0}
                      >
                        {formatDate2(history.date)}
                      </Text.p>
                    </Box>
                    <Box width={[1 / 9]}>
                      <Text.p
                        fontFamily="Roboto-Regular"
                        color="grey1"
                        fontSize={16}
                        m={0}
                      >
                        {`${history.historyNumbers.join("")}`}
                      </Text.p>
                    </Box>
                    <Box width={[1 / 9]}>
                      <Text.p
                        fontFamily="Roboto-Regular"
                        color="grey1"
                        fontSize={16}
                        m={0}
                      >
                        {`${history.historyAmount[1]}`}
                      </Text.p>
                    </Box>
                    <Box width={[1 / 9]}>
                      <Text.p
                        fontFamily="Roboto-Regular"
                        color="grey1"
                        fontSize={16}
                        m={0}
                      >
                        {`${history.historyAmount[2]}`}
                      </Text.p>
                    </Box>
                    <Box width={[1 / 9]}>
                      <Text.p
                        fontFamily="Roboto-Regular"
                        color="grey1"
                        fontSize={16}
                        m={0}
                      >
                        {`${history.historyAmount[3]}`}
                      </Text.p>
                    </Box>
                    <Box width={[2 / 9]}>
                      <StyledTokensWon
                        fontFamily="Roboto-Regular"
                        color="grey1"
                        fontSize={16}
                        m={0}
                        onMouseEnter={() => setShowTooltip(index)}
                        onMouseLeave={() => setShowTooltip(null)}
                        position="relative"
                        sum={sum}
                      >
                        {showTooltip === index && sum > 0 && (
                          <Tooltip handleDetails={() => setHistoryOpen(true)} anoneAmount={sum} />
                        )}
                        {sum > 0 && <StyledOrangeCircle />}
                        {`${formatNumber(history.historyAmount[0])}`}
                      </StyledTokensWon>
                      <Text.span
                        fontFamily="Roboto-Regular"
                        color="grey1"
                        fontSize={16}
                        m={0}
                      >
                        {` | ${formatNumber(19999999)}`}
                      </Text.span>
                      {historyOpen && (
                        <TicketHistoryModal
                          isOpen={historyOpen}
                          toggleModal={() => setHistoryOpen(false)}
                          filter={formatDate2(history.date)}
                        />
                      )}
                    </Box>
                    <Box width={[1 / 7]}>
                      <Text.p
                        fontFamily="Roboto-Regular"
                        color="grey1"
                        fontSize={16}
                        m={0}
                      >
                        {formatNumber(history.burnedAmount)}
                      </Text.p>
                    </Box>
                  </Flex>
                </StyledRows>
              );
            })}
        </StyledModalBody>
        <StyledModalFooter>
          <Flex alignItems="flex-end">
            <Box width={1 / 4} position="relative">
              <StyledBlankButton ref={dropdownRef}>
                <Flex alignItems="center">
                  <Box>
                    <Text.p
                      fontFamily="Roboto-Regular"
                      color="grey1"
                      fontSize={16}
                      m={0}
                      mr="6px"
                    >
                      {`Rows per page: ${rows}`}
                    </Text.p>
                  </Box>
                  <Box>
                    <StyledArrowDown />
                  </Box>
                </Flex>
                {dropdownOpen && (
                  <StyledDropdown>
                    {rowSizes.map((rowSize, index) => {
                      return (
                        <StyledRows key={`row_${index}`}>
                          <Flex textAlign="center" justifyContent="center">
                            <Box width={1}>
                              <Button.Text
                                fontFamily="Roboto-Regular"
                                mainColor="grey1"
                                py={[8]}
                                fontSize={16}
                                height="auto"
                                width="100%"
                                onClick={() => handleSetRows(rowSize)}
                              >
                                {rowSize}
                              </Button.Text>
                            </Box>
                          </Flex>
                        </StyledRows>
                      );
                    })}
                  </StyledDropdown>
                )}
              </StyledBlankButton>
            </Box>
            <Box width={2 / 4}>
              <Flex justifyContent="center">
                <Box>
                  {currPages.map((currPage, index) => {
                    return (
                      <StyledPaginationContainer key={`pagination_${index}`}>
                        {index + 2 === page && (
                          <StyledPaginationContainer2>
                            <StyledPagination
                              fontFamily="Roboto-Regular"
                              active={currPage === page}
                              mainColor={
                                currPage === page ? "primary" : "white"
                              }
                              p={0}
                              fontSize={16}
                              onClick={() => setPage(currPages[0])}
                            >
                              <Text.p
                                fontFamily="Roboto-Regular"
                                color={currPage === page ? "white" : "grey7"}
                                fontSize={16}
                                m={0}
                              >
                                {currPages[0] + 1}
                              </Text.p>
                            </StyledPagination>
                          </StyledPaginationContainer2>
                        )}
                        <StyledPaginationContainer2>
                          {index + 2 === page && (
                            <Text.p
                              fontFamily="Roboto-Regular"
                              color="grey7"
                              fontSize={16}
                              m={0}
                            >
                              ...
                            </Text.p>
                          )}
                          {(index === page ||
                            index + 1 === page ||
                            index - 1 === page) && (
                            <StyledPagination
                              fontFamily="Roboto-Regular"
                              active={currPage === page}
                              mainColor={
                                currPage === page ? "primary" : "white"
                              }
                              p={0}
                              fontSize={16}
                              onClick={() => setPage(currPage)}
                            >
                              <Text.p
                                fontFamily="Roboto-Regular"
                                color={currPage === page ? "white" : "grey7"}
                                fontSize={16}
                                m={0}
                              >
                                {currPage + 1}
                              </Text.p>
                            </StyledPagination>
                          )}
                          {index - 2 === page && (
                            <Text.p
                              fontFamily="Roboto-Regular"
                              color="grey7"
                              fontSize={16}
                              m={0}
                            >
                              ...
                            </Text.p>
                          )}
                        </StyledPaginationContainer2>
                        <StyledPaginationContainer>
                          {index - 2 === page && (
                            <StyledPagination
                              fontFamily="Roboto-Regular"
                              active={currPage === page}
                              mainColor={
                                currPage === page ? "primary" : "white"
                              }
                              p={0}
                              fontSize={16}
                              onClick={() =>
                                setPage(currPages[currPages.length - 1])
                              }
                            >
                              <Text.p
                                fontFamily="Roboto-Regular"
                                color={currPage === page ? "white" : "grey7"}
                                fontSize={16}
                                m={0}
                              >
                                {currPages[currPages.length - 1] + 1}
                              </Text.p>
                            </StyledPagination>
                          )}
                        </StyledPaginationContainer>
                      </StyledPaginationContainer>
                    );
                  })}
                </Box>
              </Flex>
            </Box>
            <Box width={1 / 4}>
              <Text.p
                fontFamily="Roboto-Regular"
                color="grey1"
                fontSize={16}
                m={0}
                mr="6px"
              >
                {`${page * rows + 1} to ${Math.min(
                  filterHistory.length,
                  (page + 1) * rows
                )} out of ${filterHistory.length}`}
              </Text.p>
            </Box>
          </Flex>
        </StyledModalFooter>
        <StyledOuterFlex>
          <Box mr={[16]}>
            <Button
              width={[237]}
              height={[62]}
              borderRadius={[31]}
              onClick={() => props.toggleModal()}
              mainColor="white"
            >
              <Text.p fontFamily="Roboto-Regular" color="primary" fontSize={16}>
                CLOSE
              </Text.p>
            </Button>
          </Box>
          <Box>
            <Button
              width={[237]}
              height={[62]}
              borderRadius={[31]}
              onClick={() => handleClaim()}
              disabled={state.tickets.filter(history => !history.isClaimed && history.tokensWon > 0).length === 0 && !allClaimed}
              mainColor={state.tickets.filter(history => !history.isClaimed && history.tokensWon > 0).length === 0 && !allClaimed ? "grey8" : "orange"}
            >
              <Text.p fontFamily="Roboto-Regular" color="white" fontSize={16}>
                CLAIM ALL
              </Text.p>
            </Button>
          </Box>
        </StyledOuterFlex>
      </StyledModalContainer>
    </Modal>
  );
}

RaffleHistoryModal.propTypes = {
  toggleModal: PropTypes.func,
  handleDetails: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default RaffleHistoryModal;
