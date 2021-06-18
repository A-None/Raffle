pragma solidity 0.6.12;

interface IRandom {
  function fulfillRandomness(bytes32 requestId, uint256 randomness) external;
  function getRandomNumber(uint256 userProvidedSeed) external;
}