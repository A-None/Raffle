pragma solidity 0.6.12;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "./interfaces/ILottery.sol";

contract Random is VRFConsumerBase {
  // The Lottery
  ILottery public lotteryUpgradeProxy;
  // used by Chainlink VRF
  bytes32 public reqId;
  bytes32 internal keyHash;
  uint256 public randomNumber;
  uint256 internal fee;
  uint256 seed;

  // Example Network: Kovan
  // VRF Coordinator 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
  // LINK Token 0xa36085F69e2889c224210F603D836748e7dC0088
  constructor(address _vrfCoordinator, address _link, bytes32 _keyHash, uint256 _fee, address _lotteryUpgradeProxy) VRFConsumerBase(
        _vrfCoordinator,
        _link
    ) public {
      lotteryUpgradeProxy = ILottery(_lotteryUpgradeProxy);
      keyHash = _keyHash;
      fee = _fee * 10 ** 18;
  }
  
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    reqId = requestId;
    lotteryUpgradeProxy.setRandomNumber(randomness);
  }
  function getRandomNumber(uint256 userProvidedSeed) external onlyLottery {
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
    seed = uint256(keccak256(abi.encode(userProvidedSeed, blockhash(block.number)))); 
    requestRandomness(keyHash, fee, seed);
  }

  modifier onlyLottery() {
    require(msg.sender == address(lotteryUpgradeProxy), "Lottery");
    _;
  }
}