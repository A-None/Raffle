pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    event Minted(address receiver, uint tokenAmt);
    
    constructor() public ERC20("Mock Token", "MOC") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }

    function mint(address receiver, uint256 tokenAmt) public {
        _mint(receiver, tokenAmt);
        emit Minted(receiver, tokenAmt);
    }
}