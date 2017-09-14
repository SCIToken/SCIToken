/*
 * Wrapper for Science Blockchain Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.16;

import "./../../src/sol/ScienceBlockchainToken.sol";

/**
 * Wrapper for Science Blockchain Token Smart Contract.
 */
contract ScienceBlockchainTokenWrapper is ScienceBlockchainToken {
  /**
   * Create new Science Blockchain Token smart contract.
   */
  function ScienceBlockchainTokenWrapper ()
    ScienceBlockchainToken () {
    // Do nothing
  }

  /**
   * Burn given number of tokens belonging to message sender.
   *
   * @param _value number of tokens to burn
   * @return true if tokens were burned successfully, false otherwise
   */
  function burnTokens (uint256 _value) returns (bool success) {
    Result (success = ScienceBlockchainToken.burnTokens (_value));
  }

  /**
   * Used to log result of operation.
   *
   * @param _value result of operation
   */
  event Result (bool _value);
}
