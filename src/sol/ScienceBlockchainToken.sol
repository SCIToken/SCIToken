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
   * Create new Science Blockchain Token smart contract and make message sender
   * to be the owner of smart contract and to be a snapshot creator.
   */
  function ScienceBlockchainToken ()
    StandardSnapshottableToken () {
    snapshotCreator = msg.sender;
  }

  /**
   * Create snapshot of token holder balances.
   *
   * @return index of new created snapshot
   */
  function snapshot () returns (uint256 index) {
    require (msg.sender == snapshotCreator);
    return AbstractSnapshottableToken.snapshot ();
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

  /**
   * Set new snapshot creator address.
   *
   * @param _snapshotCreator new snapshot creator address
   */
  function setSnapshotCreator (address _snapshotCreator) {
    require (msg.sender == owner);
    snapshotCreator = _snapshotCreator;
  }

  /**
   * Address of snapshot creator, i.e. the one allowed to create snapshots.
   */
  address snapshotCreator;
}
