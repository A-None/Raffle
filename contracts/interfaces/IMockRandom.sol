pragma solidity 0.6.12;

interface IMockRandom {
  function fulfillRandomness(uint8 randomness) external;
  function getRandomNumber(uint8 userProvidedSeed) external;
}