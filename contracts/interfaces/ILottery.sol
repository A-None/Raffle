pragma solidity 0.6.12;

interface ILottery {
    function drawed() external view returns(bool);

    function reset() external;

    function enterDrawingPhase() external;

    function setRandomNumber(uint256 randomness) external;

    function startDrawing(uint256 userProvidedSeed) external;

    function drawing() external;

    function internalBuy(uint256 _price, uint8[4] memory _numbers) external;

    function buy(uint256 _price, uint8[4] memory _numbers) external;

    function multiBuy(uint256 _price, uint8[4][] memory _numbers) external;

    function claimReward(uint256 _tokenId) external;

    function multiClaim(uint256[] memory _tickets) external;

    function generateNumberIndexKey(uint8[4] memory number) external pure returns (uint64[11] memory);

    function calculateMatchingRewardAmount() external view returns (uint256[4] memory);

    function getMatchingRewardAmount(uint256 _issueIndex, uint256 _matchingNumber) external view returns (uint256);

    function getRewardView(uint256 _tokenId) external view returns(uint256);

    function setAdmin(address _adminAddress) external;

    function setRandom(address _random) external;

    function adminWithdraw(uint256 _amount) external;

    function setMinPrice(uint256 _price) external;

    function setMaxNumber(uint8 _maxNumber) external;

    function setAllocation(uint8 _allcation1, uint8 _allcation2, uint8 _allcation3) external;
}