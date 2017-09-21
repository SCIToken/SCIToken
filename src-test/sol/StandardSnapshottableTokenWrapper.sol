/*
 * Wrapper for Standard Snapshottable Token Smart Contract.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.16;

import "./../../src/sol/StandardSnapshottableToken.sol";

/**
 * Wrapper for Standard Snapshottable Token Smart Contract.
 */
contract StandardSnapshottableTokenWrapper
  is StandardSnapshottableToken {
  /**
   * Create new Standard Snapshottable Token Wrapper smart contract.
   */
  function StandardSnapshottableTokenWrapper ()
    StandardSnapshottableToken () {
    // Nothing here
  }

  /**
   * Transfer given number of tokens from message sender to given recipient.
   *
   * @param _to address to transfer tokens from the owner of
   * @param _value number of tokens to transfer to the owner of given address
   * @return true if tokens were transferred successfully, false otherwise
   */
  function transfer (address _to, uint256 _value) returns (bool success) {
    bool result = StandardSnapshottableToken.transfer (_to, _value);
    Result (result);
    return result;
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
    bool result =
      StandardSnapshottableToken.transferFrom (_from, _to, _value);
    Result (result);
    return result;
  }

  /**
   * Allow given spender to transfer given number of tokens from message sender.
   *
   * @param _spender address to allow the owner of to transfer tokens from
   *        message sender
   * @param _value number of tokens to allow to transfer
   * @return true if token transfer was successfully approved, false otherwise
   */
  function approve (address _spender, uint256 _value) returns (bool success) {
    bool result = AbstractSnapshottableToken.approve (_spender, _value);
    Result (result);
    return result;
  }

  /**
   * Create given number of tokens and give them to message sender.
   *
   * @param _value number of tokens to create
   * @return true on success, false on error
   */
  function createTokens (uint256 _value) returns (bool success) {
    bool result = StandardSnapshottableToken.createTokens (_value);
    Result (result);
    return result;
  }

  /**
   * Get address of the current owner of this smart contract.
   *
   * @return address of the owner of this smart contract.
   */
  function getOwner () constant returns (address _owner) {
    return owner;
  }

  /**
   * Used to log result of operation.
   *
   * @param _value result of operation
   */
  event Result (bool _value);

  /**
   * Used to log result value of operation.
   *
   * @param _value result value of operation
   */
  event ResultValue (uint256 _value);

  /**
   * User to log sending of tokens.
   *
   * @param _token token being sent
   * @param _to address tokens were sent to
   * @param _value number of tokens sent
   */
  event TokensSent (address _token, address _to, uint256 _value);
}
