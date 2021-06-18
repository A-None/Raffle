import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import LotteryAbi from "../abis/LotteryAbi";
import LotteryNFTAbi from "../abis/LotteryNFTAbi";
import anoneAbi from "../abis/anoneAbi";
import { addresses } from "../constants/addresses";
import { truncate } from "utils/number";

export const getWeb3Provider = (provider) => {
  if (provider) {
    return new ethers.providers.Web3Provider(provider);
  } else {
    return null;
  }
};

export const getMetamaskProvider = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    return provider;
  } else {
    return null;
  }
};

export const isMetamaskConnected = async (provider) => {
  return provider.isConnected();
};

export const addMetamaskListeners = (
  provider,
  chainChangedCallback,
  messageCallback,
  accountsChangedCallback
) => {
  provider.on("chainChanged", (chainId) => {
    chainChangedCallback(chainId);
  });
  provider.on("message", (message) => {
    messageCallback(message);
  });
  provider.on("accountsChanged", (accounts) => {
    accountsChangedCallback(accounts);
  });
};

export const getAccountSigner = async (web3Provider) => {
  return await web3Provider.getSigner();
};

export const weiToEth = (weiBalance) => {
  return ethers.utils.formatEther(weiBalance);
};

export const ethToWei = (ethBalance) => {
  return ethers.utils.parseEther(ethBalance);
};

export const formatUnits = (weiBalance, decimals) => {
  return ethers.utils.formatUnits(weiBalance, decimals);
};

export const connectToMetamask = async (web3Provider) => {
  web3Provider.request({ method: "eth_requestAccounts" });
};

export const getETHBalance = async (web3Provider, address) => {
  return await web3Provider.getBalance(address);
};

export const getLotteryContract = async (web3Provider) => {
  const LotteryContract = new ethers.Contract(
    addresses.LOTTERY_PROXY,
    LotteryAbi,
    await web3Provider.getSigner()
  );

  return LotteryContract;
};

export const getLotteryNFTContract = async (web3Provider) => {
  const LotteryNFTContract = new ethers.Contract(
    addresses.LOTTERY_NFT,
    LotteryNFTAbi,
    await web3Provider.getSigner()
  );

  return LotteryNFTContract;
};

export const getanoneContract = async (web3Provider) => {
  const anoneContract = new ethers.Contract(
    addresses.anone,
    anoneAbi,
    await web3Provider.getSigner()
  );

  return anoneContract;
};

export const getUserTickets = async (
  lotteryContract,
  lotteryNFTContract,
  userAddress
) => {
  const numTickets = (
    await lotteryContract.userNumTickets(userAddress)
  ).toNumber();
  let ticketNumbers = [];
  for (let i = 0; i < numTickets; i++) {
    ticketNumbers.push(
      (await lotteryContract.userInfo(userAddress, i)).toNumber()
    );
  }
  let tickets = [];
  for (let ticketNumber of ticketNumbers) {
    let lotteryNumber = await lotteryNFTContract.getLotteryNumbers(
      ticketNumber
    );
    const purchaseDate = await lotteryNFTContract.purchaseDate(ticketNumber);
    const issueIndex = await lotteryNFTContract.getLotteryIssueIndex(
      ticketNumber
    );
    const isClaimed = await lotteryNFTContract.claimInfo(ticketNumber);
    const isDrawn =
      !issueIndex.eq(await lotteryContract.issueIndex()) ||
      (await lotteryContract.drawed());
    let matches = null;
    let tokensWon = 0;
    if (isDrawn) {
      let currMatches = 0;
      for (let i = 0; i < lotteryNumber.length; i++) {
        if (
          lotteryNumber[i] ===
          (await lotteryContract.historyNumbers(issueIndex, i))
        ) {
          currMatches += 1;
        }
      }
      if (currMatches > 1) {
        matches = currMatches;
      } else {
        matches = 0;
      }
      tokensWon = await lotteryContract.getRewardView(ticketNumber);
    }
    lotteryNumber = lotteryNumber.map((num) => num - 1);
    tickets.push({
      date: purchaseDate.toNumber(),
      ticketNum: lotteryNumber,
      issueIndex: issueIndex.toNumber(),
      NFTNum: ticketNumber,
      isClaimed,
      isDrawn,
      matches,
      tokensWon,
    });
  }
  return tickets;
};

export const getAllowance = async (
  tokenContract,
  ownerAddress,
  spenderAddress
) => {
  return await tokenContract.allowance(ownerAddress, spenderAddress);
};

export const approveTransfer = async (
  tokenContract,
  spenderAddress,
  approveAmount
) => {
  const approveTx = await tokenContract.approve(spenderAddress, approveAmount);
  return await approveTx.wait();
};

export const multiBuy = async (lotteryContract, price, ticketNumbers) => {
  const multiBuyTx = await lotteryContract.multiBuy(price, ticketNumbers);
  return await multiBuyTx.wait();
};

export const multiClaim = async (lotteryContract, tickets) => {
  const multiClaimTx = await lotteryContract.multiClaim(tickets);
  return await multiClaimTx.wait();
};

export const getRaffleHistory = async (lotteryContract, drawed, issueIndex) => {
  const index = drawed ? issueIndex.toNumber() + 1 : issueIndex.toNumber();
  const raffleHistory = [];
  for (let i = 0; i < index; i++) {
    let historyNumbers = [
      await lotteryContract.historyNumbers(i, 0) - 1,
      await lotteryContract.historyNumbers(i, 1) - 1,
      await lotteryContract.historyNumbers(i, 2) - 1,
      await lotteryContract.historyNumbers(i, 3) - 1,
    ];
    let historyAmount = [
      weiToEth(await lotteryContract.historyAmount(i, 0)),
      parseInt(weiToEth(await lotteryContract.historyAmount(i, 1)) / 10),
      parseInt(weiToEth(await lotteryContract.historyAmount(i, 2)) / 10),
      parseInt(weiToEth(await lotteryContract.historyAmount(i, 3)) / 10),
    ];
    let burnedAmount = truncate(weiToEth(await lotteryContract.burnedAmount(i)));
    let date = new Date((await lotteryContract.drawDate(i)).toNumber() * 1000);
    raffleHistory.push({ historyNumbers, historyAmount, issueIndex, date, burnedAmount });
  }
  return raffleHistory;
};

export const getBurnedAmount = async (lotteryContract, drawed, issueIndex) => {
  const index = drawed ? issueIndex + 1 : issueIndex;
  const burned = [];
  for (let i = 0; i < index; i++) {
    burned.push(truncate(weiToEth(await lotteryContract.burnedAmount(i))));
  }
  return burned;
};

