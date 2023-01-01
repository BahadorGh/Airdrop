//  SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BGToken is ERC20 {
        constructor() ERC20("BGToken", "BGT") {
            _mint(msg.sender, 1_000_000 * (10 ** decimals()) );
        }
}