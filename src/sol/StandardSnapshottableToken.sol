/*
 * Standard Snapshottable Token Smart Contract.
 * Copyright © 2016-2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.16;

import "./AbstractSnapshottableToken.sol";

/**
 * Standard Snapshottable Token Smart Contract.
 */
contract StandardSnapshottableToken is AbstractSnapshottableToken {
  /**
   * Create new Standard Snapshottable Token Smart Contract and make
   * message sender the owner of the smart contract.
   */
  function StandardSnapshottableToken ()
    AbstractSnapshottableToken () {
    owner = msg.sender;
  }

  /**
   * Transfer given number of tokens from message sender to given recipient.
   *
   * @param _to address to transfer tokens to the owner of
   * @param _value number of tokens to transfer to the owner of given address
   * @return true if tokens were transferred successfully, false otherwise
   */
  function transfer (address _to, uint256 _value) returns (bool success) {
    if (frozen) return false;
    else return AbstractSnapshottableToken.transfer (_to, _value);
  }

  /**
   * Transfer given number of tokens from given owner to given recipient.
   *
   * @param _from address to transfer tokens from the owner of
   * @param _to address to transfer tokens to the owner of
   * @param _value number of tokens to transfer from given owner to given
   *        recipient
   * @return true if tokens were transferred successfully, false otherwise
   */
  function transferFrom (address _from, address _to, uint256 _value)
  returns (bool success) {
    if (frozen) return false;
    else
      return AbstractSnapshottableToken.transferFrom (_from, _to, _value);
  }

  /**
   * Create given number of tokens and give them to message sender.  May only be
   * called by the owner of the smart contract.
   *
   * @param _value number of tokens to create
   * @return true on success, false on error
   */
  function createTokens (uint256 _value) returns (bool success) {
    require (msg.sender == owner);

    return doCreateTokens (_value);
  }

  /**
   * Freeze token transfers.  May only be called by the owner of the smart
   * contract.
   */
  function freezeTransfers () {
    require (msg.sender == owner);

    if (!frozen)
    {
      frozen = true;
      Freeze ();
    }
  }

  /**
   * Unfreeze token transfers.  May only be called by the owner of the smart
   * contract.
   */
  function unfreezeTransfers () {
    require (msg.sender == owner);

    if (frozen) {
      frozen = false;
      Unfreeze ();
    }
  }

  /**
   * Set new owner address.  May only be called by the owner of the smart
   * contract.
   *
   * @param _newOwner new owner address
   */
  function setOwner (address _newOwner) {
    require (msg.sender == owner);

    owner = _newOwner;
  }

  /**
   * Owner of this smart contract.
   */
  address owner;

  /**
   * Whether token transfers are currently frozen.
   */
  bool frozen;

  /**
   * Logged when token transfers were frozen.
   */
  event Freeze ();

  /**
   * Logged when token transfers were unfrozen.
   */
  event Unfreeze ();
}
