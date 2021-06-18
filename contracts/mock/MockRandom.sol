pragma solidity 0.6.12;

import "../interfaces/IMockLottery.sol";
import "hardhat/console.sol";

contract MockRandom {
  IMockLottery public lotteryUpgradeProxy;

  constructor(address _lotteryUpgradeProxy) public {
    lotteryUpgradeProxy = IMockLottery(_lotteryUpgradeProxy);
  }
  
  function fulfillRandomness(uint8 randomness) internal {
    uint8[4] memory ticket = [randomness, randomness, randomness, randomness];
    lotteryUpgradeProxy.setRandomNumber(ticket);
  }
  function getRandomNumber(uint8 userProvidedSeed) external onlyLottery {
    fulfillRandomness(userProvidedSeed);
  }

  modifier onlyLottery() {
    require(msg.sender == address(lotteryUpgradeProxy), "Lottery");
    _;
  }
}