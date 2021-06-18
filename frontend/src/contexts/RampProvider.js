  
import React, { createContext, useEffect, useState } from 'react'
import {
  getWeb3Provider,
  getMetamaskProvider,
  isMetamaskConnected,
  addMetamaskListeners,
  getAccountSigner,
  getLotteryContract,
  getanoneContract,
  getLotteryNFTContract,
  getUserTickets,
  getRaffleHistory,
  getBurnedAmount,
} from 'apis/blockchain'
import PropTypes from "prop-types";

export const Context = createContext();

const anoneProvider = ({ children }) => {
  const [currentAccountAddress, setCurrentAccountAddress] = useState('');
  const [userTickets, setUserTickets] = useState([]);
  const [web3, setWeb3] = useState({
    initialized: false,

    metamaskProvider: null,
    web3Provider: null,
    metamaskInstalled: true,
    metamaskConnected: true,

    networkId: 1,
    LotteryContract: null,
    lotteryNFTContract: null,
    anoneContract: null,
    issueIndex: null,
    raffleHistory: null,
    burnedAmount: null,
  })

  useEffect(() => {
    web3Setup();
  }, []);

  const web3Setup = async () => {
    let metamaskProvider = await getMetamaskProvider()
    let web3Provider = await getWeb3Provider(metamaskProvider)

    if (metamaskProvider && web3Provider) {
      addMetamaskListeners(
        metamaskProvider,
        async (chainId) => {
          setWeb3({
            ...web3,
            networkId: parseInt(chainId)
          })
        },
        () => {},
        async (accounts) => {
          if (accounts.length === 0) {
            console.log("WHY2")
            setWeb3({ ...web3, 
              metamaskConnected: false, 
              LotteryContract: null,
              lotteryNFTContract: null,
              anoneContract: null,
              issueIndex: null,
              drawed: null,
              raffleHistory: null,
              burnedAmount: null,});
            setCurrentAccountAddress('');
            setUserTickets([]);
          } else if (accounts[0] !== currentAccountAddress) {
            console.log("WHY")
            let metamaskProvider = await getMetamaskProvider();
            let web3Provider = await getWeb3Provider(metamaskProvider);
            let lotteryContract = await getLotteryContract(web3Provider);
            let lotteryNFTContract = await getLotteryNFTContract(web3Provider);
            let anoneContract = await getanoneContract(web3Provider);
            let issueIndex = await lotteryContract.issueIndex();
            let drawed = await lotteryContract.drawed();
            let raffleHistory = await getRaffleHistory(lotteryContract, drawed, issueIndex);
            let burnedAmount = await getBurnedAmount(lotteryContract, drawed, issueIndex);
            let userTickets = await getUserTickets(
              lotteryContract,
              lotteryNFTContract,
              accounts[0]
            );
            setWeb3({
              ...web3,
              metamaskConnected: true,
              LotteryContract: lotteryContract,
              lotteryNFTContract: lotteryNFTContract,
              anoneContract: anoneContract,
              issueIndex: issueIndex.toNumber(),
              drawed,
              raffleHistory,
              burnedAmount,
            });
            setCurrentAccountAddress(accounts[0]);
            setUserTickets(userTickets);
          }
        }
      )

      let currentAccountAddress
      try {
        currentAccountAddress = await (
          await getAccountSigner(web3Provider)
        ).getAddress()
      } catch (error) {
        currentAccountAddress = ''
      }
      setCurrentAccountAddress(currentAccountAddress);
      let lotteryContract = await getLotteryContract(web3Provider);
      let lotteryNFTContract = await getLotteryNFTContract(web3Provider);
      let anoneContract = await getanoneContract(web3Provider);
      if (currentAccountAddress.length > 0) {
        let issueIndex = await lotteryContract.issueIndex();
        let drawed = await lotteryContract.drawed();
        let raffleHistory = await getRaffleHistory(lotteryContract, drawed, issueIndex);
        let burnedAmount = await getBurnedAmount(lotteryContract, drawed, issueIndex);
        console.log(burnedAmount);
        let userTickets = await getUserTickets(
          lotteryContract,
          lotteryNFTContract,
          currentAccountAddress
        );
        console.log(userTickets);
        setWeb3({
          ...web3,
          initialized: true,
          web3Provider,
          metamaskProvider,
          metamaskConnected: await isMetamaskConnected(metamaskProvider),
          networkId: parseInt(window.ethereum.chainId),
          LotteryContract: lotteryContract,
          lotteryNFTContract: lotteryNFTContract,
          anoneContract: anoneContract,
          issueIndex: issueIndex.toNumber(),
          drawed,
          raffleHistory,
          burnedAmount,
        });
        setUserTickets(userTickets);
      } else {
        setWeb3({
          ...web3,
          initialized: true,
          web3Provider,
          metamaskProvider,
          metamaskConnected: await isMetamaskConnected(metamaskProvider),
          networkId: parseInt(window.ethereum.chainId),
          lotteryContract,
          lotteryNFTContract,
          anoneContract,
        });
      }
    } else {
      setWeb3({
        ...web3,
        metamaskInstalled: false,
        metamaskConnected: false
      })
    }
  }
  return (
    <Context.Provider value={{ web3, currentAccountAddress, userTickets }}>{children}</Context.Provider>
  )
}

anoneProvider.propTypes = {
  children: PropTypes.element
}

export default anoneProvider