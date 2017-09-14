/*
 * Science Blockchain Token Smart Contract.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.16;

import "./StandardSnapshottableToken.sol";

/**
 * Science Blockchain Token Smart Contract.
 */
contract ScienceBlockchainToken is StandardSnapshottableToken {
  /**
   * Create new Science Blockchain Token smart contract.
   */
  function ScienceBlockchainToken ()
    StandardSnapshottableToken () {
    // Do nothing
  }

  /**
   * Get name of this token.
   *
   * @return name of this token
   */
  function name () constant returns (string result) {
    return "SCIENCE BLOCKCHAIN";
  }

  /**
   * Get symbol of this token.
   *
   * @return symbol of this token
   */
  function symbol () constant returns (string result) {
    return "SCI";
  }

  /**
   * Get number of decimals for this token.
   *
   * @return number of decimals for this token
   */
  function decimals () constant returns (uint8 result) {
    return 0;
  }

  /**
   * Burn given number of tokens belonging to message sender.
   *
   * @param _value number of tokens to burn
   * @return true if tokens were burned successfully, false otherwise
   */
  function burnTokens (uint256 _value) returns (bool success) {
    uint256 balance = accounts [msg.sender].balance;
    if (_value > balance) return false;
    if (_value > 0) {
      updateHistoricalBalances (msg.sender);
      accounts [msg.sender].balance = safeSub (balance, _value);
      tokensCount = safeSub (tokensCount, _value);
      return true;
    }
    return true;
  }
}
