import { getMatches, truncate } from "utils/number";
import * as blockchainApi from "apis/blockchain";

export const bulkTickets = (lotteryTickets) => {
  const tempTickets = [];
  let tempBulkTickets = [];
  let matches = [];
  let totalTokensWon = 0;
  for (let i = 0; i <= lotteryTickets.length; i++) {
    if (i !== lotteryTickets.length) {
      if (
        tempBulkTickets.length === 0 ||
        (tempBulkTickets[tempBulkTickets.length - 1].date ===
          lotteryTickets[i].date &&
          parseInt(
            tempBulkTickets[tempBulkTickets.length - 1].ticketNum.join("")
          ) ==
            parseInt(lotteryTickets[i].ticketNum.join("")) - 1 &&
          tempBulkTickets[tempBulkTickets.length - 1].issueIndex ===
            lotteryTickets[i].issueIndex)
      ) {
        tempBulkTickets.push(lotteryTickets[i]);
        continue;
      }
    } else {
      if (tempBulkTickets.length === 0) break;
    }
    matches = getMatches(tempBulkTickets);
    if (tempBulkTickets[0].isDrawn) {
      tempBulkTickets.map(
        (tempBulkTicket) =>
          (totalTokensWon += parseFloat(
            truncate(blockchainApi.weiToEth(tempBulkTicket.tokensWon))
          ))
      );
    }
    if (tempBulkTickets.length > 1) {
      tempTickets.push({
        ...tempBulkTickets[0],
        tokensWon: totalTokensWon,
        matches,
        date: new Date(tempBulkTickets[0].date * 1000),
        ticketNum: `${tempBulkTickets[0].ticketNum.join("")}-${tempBulkTickets[
          tempBulkTickets.length - 1
        ].ticketNum.join("")}`,
        NFTNum: tempBulkTickets.map((tempBulkTicket) => {
          return tempBulkTicket.NFTNum;
        }),
      });
    } else {
      tempTickets.push({
        ...tempBulkTickets[0],
        tokensWon: totalTokensWon,
        matches,
        NFTNum: [tempBulkTickets[0].NFTNum],
        date: new Date(tempBulkTickets[0].date * 1000),
        ticketNum: tempBulkTickets[0].ticketNum.join(""),
      });
    }
    tempBulkTickets = [];
    matches = [];
    totalTokensWon = 0;
    tempBulkTickets.push(lotteryTickets[i]);
  }
  return tempTickets;
};
