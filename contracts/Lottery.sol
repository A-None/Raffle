pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./LotteryNFT.sol";
import "./LotteryOwnable.sol";
import "./interfaces/IRandom.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/proxy/Initializable.sol";

import "hardhat/console.sol";

// 4 numbers
contract Lottery is LotteryOwnable, Initializable {
    using SafeMath for uint256;
    using SafeMath for uint8;
    using SafeERC20 for IERC20;

    uint8 constant keyLengthForEachBuy = 11;
    // Allocation for first/sencond/third reward
    uint8[3] public allocation;
    // The TOKEN to buy lottery
    IERC20 public anone;
    // The Lottery NFT for tickets
    LotteryNFT public lotteryNFT;
    // The RANDOM number generator
    IRandom public random;
    // adminAddress
    address public adminAddress;
    // maxNumber
    uint8 public maxNumber;
    // minPrice, if decimal is not 18, please reset it
    uint256[3] public minPrice;
    // whether or not to use Chainlink VRF
    bool public useVRF;
    // Breakpoints for bulk buy price change e.g [100, 1000]
    uint256[2] public bulkAmount;

    // =================================

    // issueId => winningNumbers[numbers]
    mapping (uint256 => uint8[4]) public historyNumbers;
    // issueId => [tokenId]
    mapping (uint256 => uint256[]) public lotteryInfo;
    // issueId => [totalAmount, firstMatchAmount, secondMatchingAmount, thirdMatchingAmount]
    mapping (uint256 => uint256[]) public historyAmount;
    // issueId => trickyNumber => buyAmountSum
    mapping (uint256 => mapping(uint64 => uint256)) public userBuyAmountSum;
    // address => [tokenId]
    mapping (address => uint256[]) public userInfo;
    // address => [tokenId]
    mapping (address => uint256) public userNumTickets;

    uint256 public issueIndex;
    uint256 public totalAddresses;
    uint256 public totalAmount;
    uint256 public lastTimestamp;
    // issueId => burnedAmount
    mapping (uint256 => uint256) public burnedAmount;
    // issueId => drawDate
    mapping (uint256 => uint256) public drawDate;

    uint8[4] public winningNumbers;
    // ticket that cannot win
    uint8[4] private nullTicket;

    // default false
    bool public drawingPhase;

    // =================================

    event Buy(address indexed user, uint256 tokenId);
    event Drawing(uint256 indexed issueIndex, uint8[4] winningNumbers);
    event Claim(address indexed user, uint256 tokenid, uint256 amount);
    event DevWithdraw(address indexed user, uint256 amount);
    event Reset(uint256 indexed issueIndex);
    event MultiClaim(address indexed user, uint256 amount);
    event MultiBuy(address indexed user, uint256 amount);
    
    function initialize(
        IERC20 _anone,
        LotteryNFT _lottery,
        uint256[3] memory _minPrice,
        uint256[2] memory _bulkAmount,
        uint8 _maxNumber,
        address _adminAddress,
        bool _useVRF
    ) public initializer {
        anone = _anone;
        lotteryNFT = _lottery;
        minPrice = _minPrice;
        bulkAmount = _bulkAmount;
        maxNumber = _maxNumber + 1;
        adminAddress = _adminAddress;
        useVRF = _useVRF;
        lastTimestamp = block.timestamp;
        allocation = [50, 20, 10];
        issueIndex = 0;
        totalAddresses = 0;
        totalAmount = 0;
        nullTicket = [0, 0, 0, 0];
        initOwner(_adminAddress);
    }

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Caller is not the admin");
        _;
    }

    modifier onlyRandom() {
        require(msg.sender == address(random), "Caller is not the Random contract");
        _;
    }

    function drawed() public view returns(bool) {
        return winningNumbers[0] != 0;
    }

    function reset() external onlyAdmin {
        require(drawed(), "drawed?");
        lastTimestamp = block.timestamp;
        totalAddresses = 0;
        totalAmount = 0;
        winningNumbers[0]=0;
        winningNumbers[1]=0;
        winningNumbers[2]=0;
        winningNumbers[3]=0;
        drawingPhase = false;
        issueIndex = issueIndex + 1;
        if(getMatchingRewardAmount(issueIndex-1, 4) == 0) {
            uint256 amount = getTotalRewards(issueIndex-1).mul(allocation[0]).div(100);
            internalBuy(amount, nullTicket);
        }
        emit Reset(issueIndex);
    }

    function enterDrawingPhase() external onlyAdmin {
        require(!drawed(), 'drawed');
        drawingPhase = true;
    }

    function setRandomNumber(uint256 _randomness) external onlyRandom {
        drawing(_randomness);
    }

    function startDrawing(uint256 _userProvidedSeed) external onlyAdmin {
        require(!drawed(), "please call reset function first");
        require(drawingPhase, "enter drawing phase first");
        if (useVRF) {
            random.getRandomNumber(_userProvidedSeed);
        } else {
            drawing(_userProvidedSeed);
        }
    }

    function drawing(uint256 _externalRandomNumber) internal {
        require(!drawed(), "please call reset function first");
        require(drawingPhase, "enter drawing phase first");
        bytes32 _structHash;
        uint256 _randomNumber;
        uint8 _maxNumber = maxNumber;
        bytes32 _blockhash = blockhash(block.number-1);

        // waste some gas fee here
        for (uint i = 0; i < 10; i++) {
            getTotalRewards(issueIndex);
        }
        uint256 _gasleft = gasleft();

        // 1
        _structHash = keccak256(
            abi.encode(
                _blockhash,
                totalAddresses,
                _gasleft,
                _externalRandomNumber
            )
        );
        _randomNumber  = uint256(_structHash);
        assembly {_randomNumber := add(mod(_randomNumber, _maxNumber),1)}
        winningNumbers[0]=uint8(_randomNumber);

        // 2
        _structHash = keccak256(
            abi.encode(
                _blockhash,
                totalAmount,
                _gasleft,
                _externalRandomNumber
            )
        );
        _randomNumber  = uint256(_structHash);
        assembly {_randomNumber := add(mod(_randomNumber, _maxNumber),1)}
        winningNumbers[1]=uint8(_randomNumber);

        // 3
        _structHash = keccak256(
            abi.encode(
                _blockhash,
                lastTimestamp,
                _gasleft,
                _externalRandomNumber
            )
        );
        _randomNumber  = uint256(_structHash);
        assembly {_randomNumber := add(mod(_randomNumber, _maxNumber),1)}
        winningNumbers[2]=uint8(_randomNumber);

        // 4
        _structHash = keccak256(
            abi.encode(
                _blockhash,
                _gasleft,
                _externalRandomNumber
            )
        );
        _randomNumber  = uint256(_structHash);
        assembly {_randomNumber := add(mod(_randomNumber, _maxNumber),1)}
        winningNumbers[3]=uint8(_randomNumber);
        
        historyNumbers[issueIndex] = winningNumbers;
        historyAmount[issueIndex] = calculateMatchingRewardAmount();
        burnedAmount[issueIndex] = getBurnAmount(issueIndex);
        drawDate[issueIndex] = block.timestamp;
        drawingPhase = false;
        emit Drawing(issueIndex, winningNumbers);
    }

    function internalBuy(uint256 _price, uint8[4] memory _numbers) internal {
        require (!drawed(), 'drawed, can not buy now');
        for (uint i = 0; i < 4; i++) {
            require (_numbers[i] <= maxNumber, 'exceed the maximum');
        }
        uint256 tokenId = lotteryNFT.newLotteryItem(address(this), _numbers, _price, issueIndex, block.timestamp);
        lotteryInfo[issueIndex].push(tokenId);
        totalAmount = totalAmount.add(_price);
        lastTimestamp = block.timestamp;
        emit Buy(address(this), tokenId);
    }

    function buy(uint256 _price, uint8[4] memory _numbers) external {
        require(!drawed(), 'drawed, can not buy now');
        require(!drawingPhase, 'drawing, can not buy now');
        require (_price >= minPrice[0], 'price must above minPrice');
        for (uint i = 0; i < 4; i++) {
            require (_numbers[i] <= maxNumber, 'exceed number scope');
        }
        uint256 tokenId = lotteryNFT.newLotteryItem(msg.sender, _numbers, minPrice[0], issueIndex, block.timestamp);
        lotteryInfo[issueIndex].push(tokenId);
        if (userInfo[msg.sender].length == 0) {
            totalAddresses = totalAddresses + 1;
            userNumTickets[msg.sender] = 0;
        }
        userInfo[msg.sender].push(tokenId);
        userNumTickets[msg.sender]++;
        totalAmount = totalAmount.add(_price);
        lastTimestamp = block.timestamp;
        uint64[keyLengthForEachBuy] memory userNumberIndex = generateNumberIndexKey(_numbers);
        for (uint i = 0; i < keyLengthForEachBuy; i++) {
            userBuyAmountSum[issueIndex][userNumberIndex[i]]=userBuyAmountSum[issueIndex][userNumberIndex[i]].add(minPrice[0]);
        }
        anone.safeTransferFrom(address(msg.sender), address(this), _price);
        emit Buy(msg.sender, tokenId);
    }

    function multiBuy(uint256 _price, uint8[4][] memory _numbers) external {
        require (!drawed(), 'drawed, can not buy now');
        require ((_numbers.length < bulkAmount[0] && _price >= minPrice[0]) 
        || (_numbers.length >= bulkAmount[0] && _numbers.length < bulkAmount[1] && _price >= minPrice[1]) 
        || (_numbers.length >= bulkAmount[1] && _price >= minPrice[2]), 'price must above minPrice');
        uint256 totalPrice  = 0;
        uint256 timestamp = block.timestamp;
        for (uint i = 0; i < _numbers.length; i++) {
            for (uint j = 0; j < 4; j++) {
                require (_numbers[i][j] <= maxNumber && _numbers[i][j] > 0, 'exceed number scope');
            }
            uint256 tokenId = lotteryNFT.newLotteryItem(msg.sender, _numbers[i], minPrice[0], issueIndex, timestamp);
            lotteryInfo[issueIndex].push(tokenId);
            if (userInfo[msg.sender].length == 0) {
                totalAddresses = totalAddresses + 1;
                userNumTickets[msg.sender] = 0;
            }
            userInfo[msg.sender].push(tokenId);
            userNumTickets[msg.sender]++;
            totalAmount = totalAmount.add(_price);
            totalPrice = totalPrice.add(_price);
            uint64[keyLengthForEachBuy] memory numberIndexKey = generateNumberIndexKey(_numbers[i]);
            for (uint k = 0; k < keyLengthForEachBuy; k++) {
                userBuyAmountSum[issueIndex][numberIndexKey[k]]=userBuyAmountSum[issueIndex][numberIndexKey[k]].add(minPrice[0]);
            }
        }
        anone.safeTransferFrom(address(msg.sender), address(this), totalPrice);
        emit MultiBuy(msg.sender, totalPrice);
    }

    function claimReward(uint256 _tokenId) external {
        require(msg.sender == lotteryNFT.ownerOf(_tokenId), "not from owner");
        require (!lotteryNFT.getClaimStatus(_tokenId), "already claimed");
        uint256 reward = getRewardView(_tokenId);
        lotteryNFT.claimReward(_tokenId);
        if(reward>0) {
            anone.safeTransfer(address(msg.sender), reward);
        }
        emit Claim(msg.sender, _tokenId, reward);
    }

    function  multiClaim(uint256[] memory _tickets) external {
        uint256 totalReward = 0;
        for (uint i = 0; i < _tickets.length; i++) {
            require (msg.sender == lotteryNFT.ownerOf(_tickets[i]), "not from owner");
            require (!lotteryNFT.getClaimStatus(_tickets[i]), "already claimed");
            uint256 reward = getRewardView(_tickets[i]);
            if(reward>0) {
                totalReward = reward.add(totalReward);
            }
        }
        lotteryNFT.multiClaimReward(_tickets);
        if(totalReward>0) {
            anone.safeTransfer(address(msg.sender), totalReward);
        }
        emit MultiClaim(msg.sender, totalReward);
    }

    function generateNumberIndexKey(uint8[4] memory number) public pure returns (uint64[keyLengthForEachBuy] memory) {
        uint64[4] memory tempNumber;
        tempNumber[0]=uint64(number[0]);
        tempNumber[1]=uint64(number[1]);
        tempNumber[2]=uint64(number[2]);
        tempNumber[3]=uint64(number[3]);

        uint64[keyLengthForEachBuy] memory result;
        result[0] = tempNumber[0]*256*256*256*256*256*256 + 1*256*256*256*256*256 + tempNumber[1]*256*256*256*256 + 2*256*256*256 + tempNumber[2]*256*256 + 3*256 + tempNumber[3];

        result[1] = tempNumber[0]*256*256*256*256 + 1*256*256*256 + tempNumber[1]*256*256 + 2*256+ tempNumber[2];
        result[2] = tempNumber[0]*256*256*256*256 + 1*256*256*256 + tempNumber[1]*256*256 + 3*256+ tempNumber[3];
        result[3] = tempNumber[0]*256*256*256*256 + 2*256*256*256 + tempNumber[2]*256*256 + 3*256 + tempNumber[3];
        result[4] = 1*256*256*256*256*256 + tempNumber[1]*256*256*256*256 + 2*256*256*256 + tempNumber[2]*256*256 + 3*256 + tempNumber[3];

        result[5] = tempNumber[0]*256*256 + 1*256+ tempNumber[1];
        result[6] = tempNumber[0]*256*256 + 2*256+ tempNumber[2];
        result[7] = tempNumber[0]*256*256 + 3*256+ tempNumber[3];
        result[8] = 1*256*256*256 + tempNumber[1]*256*256 + 2*256 + tempNumber[2];
        result[9] = 1*256*256*256 + tempNumber[1]*256*256 + 3*256 + tempNumber[3];
        result[10] = 2*256*256*256 + tempNumber[2]*256*256 + 3*256 + tempNumber[3];

        return result;
    }

    function calculateMatchingRewardAmount() internal view returns (uint256[4] memory) {
        uint64[keyLengthForEachBuy] memory numberIndexKey = generateNumberIndexKey(winningNumbers);

        uint256 totalAmout1 = userBuyAmountSum[issueIndex][numberIndexKey[0]];

        uint256 sumForTotalAmout2 = userBuyAmountSum[issueIndex][numberIndexKey[1]];
        sumForTotalAmout2 = sumForTotalAmout2.add(userBuyAmountSum[issueIndex][numberIndexKey[2]]);
        sumForTotalAmout2 = sumForTotalAmout2.add(userBuyAmountSum[issueIndex][numberIndexKey[3]]);
        sumForTotalAmout2 = sumForTotalAmout2.add(userBuyAmountSum[issueIndex][numberIndexKey[4]]);

        uint256 totalAmout2 = sumForTotalAmout2.sub(totalAmout1.mul(4));

        uint256 sumForTotalAmout3 = userBuyAmountSum[issueIndex][numberIndexKey[5]];
        sumForTotalAmout3 = sumForTotalAmout3.add(userBuyAmountSum[issueIndex][numberIndexKey[6]]);
        sumForTotalAmout3 = sumForTotalAmout3.add(userBuyAmountSum[issueIndex][numberIndexKey[7]]);
        sumForTotalAmout3 = sumForTotalAmout3.add(userBuyAmountSum[issueIndex][numberIndexKey[8]]);
        sumForTotalAmout3 = sumForTotalAmout3.add(userBuyAmountSum[issueIndex][numberIndexKey[9]]);
        sumForTotalAmout3 = sumForTotalAmout3.add(userBuyAmountSum[issueIndex][numberIndexKey[10]]);

        uint256 totalAmout3 = sumForTotalAmout3.add(totalAmout1.mul(6)).sub(sumForTotalAmout2.mul(3));

        return [totalAmount, totalAmout1, totalAmout2, totalAmout3];
    }

    function getMatchingRewardAmount(uint256 _issueIndex, uint256 _matchingNumber) public view returns (uint256) {
        return historyAmount[_issueIndex][5 - _matchingNumber];
    }

    function getTotalRewards(uint256 _issueIndex) public view returns(uint256) {
        require (_issueIndex <= issueIndex, '_issueIndex <= issueIndex');

        if(!drawed() && _issueIndex == issueIndex) {
            return totalAmount;
        }
        return historyAmount[_issueIndex][0];
    }

    function getRewardView(uint256 _tokenId) public view returns(uint256) {
        uint256 _issueIndex = lotteryNFT.getLotteryIssueIndex(_tokenId);
        uint8[4] memory lotteryNumbers = lotteryNFT.getLotteryNumbers(_tokenId);
        uint8[4] memory _winningNumbers = historyNumbers[_issueIndex];
        require(_winningNumbers[0] != 0, "not drawed");

        uint256 matchingNumber = 0;
        for (uint i = 0; i < lotteryNumbers.length; i++) {
            if (_winningNumbers[i] == lotteryNumbers[i]) {
                matchingNumber= matchingNumber +1;
            }
        }
        uint256 reward = 0;
        if (matchingNumber > 1) {
            uint256 amount = lotteryNFT.getLotteryAmount(_tokenId);
            uint256 poolAmount = getTotalRewards(_issueIndex).mul(allocation[4-matchingNumber]).div(100);
            reward = amount.mul(1e12).div(getMatchingRewardAmount(_issueIndex, matchingNumber)).mul(poolAmount);
        }
        return reward.div(1e12);
    }

    function getBurnAmount(uint256 _issueIndex) public view returns(uint256) {
        uint256 burned = 0;
        uint256 totalRewardAmount = 0;
        for (uint256 i = 0; i < lotteryInfo[_issueIndex].length; i++) {
            totalRewardAmount += getRewardView(lotteryInfo[_issueIndex][i]);
        }
        burned = getTotalRewards(_issueIndex).sub(totalRewardAmount);
        return burned;
    }

    // Update admin address by the previous dev.
    function setAdmin(address _adminAddress) public onlyOwner {
        adminAddress = _adminAddress;
    }

    // Update Random address
    function setRandom(address _random) public onlyOwner {
        random = IRandom(_random);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function adminWithdraw(uint256 _amount) public onlyAdmin {
        anone.safeTransfer(address(msg.sender), _amount);
        emit DevWithdraw(msg.sender, _amount);
    }

    // Set the minimum price for tickets
    function setMinPrice(uint256[3] memory _price) external onlyAdmin {
        minPrice = _price;
    }

    // Set the minimum price for one ticket
    function setMaxNumber(uint8 _maxNumber) external onlyAdmin {
        maxNumber = _maxNumber + 1;
    }

    // Set the allocation for one reward
    function setAllocation(uint8 _allcation1, uint8 _allcation2, uint8 _allcation3) external onlyAdmin {
        allocation = [_allcation1, _allcation2, _allcation3];
    }

    // Set whether or not to use VRF
    function setUseVRF(bool _useVRF) external onlyAdmin {
        useVRF = _useVRF;
    }
}