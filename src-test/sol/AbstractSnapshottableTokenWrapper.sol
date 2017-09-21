/*
 * Wrapper for Abstract Snapshottable Token Smart Contract.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */
pragma solidity ^0.4.16;

import "./../../src/sol/AbstractSnapshottableToken.sol";

/**
 * Wrapper for Abstract Snapshottable Token Smart Contract.
 */
contract AbstractSnapshottableTokenWrapper
  is AbstractSnapshottableToken {
  /**
   * Create new Abstract Snapshottable Token Wrapper smart contract.
   */
  function AbstractSnapshottableTokenWrapper ()
    AbstractSnapshottableToken () {
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
    Result (success = AbstractSnapshottableToken.transfer (_to, _value));
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
    Result (success =
      AbstractSnapshottableToken.transferFrom (_from, _to, _value));
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
    Result (success = AbstractSnapshottableToken.approve (_spender, _value));
  }


  /**
   * Get total number of tokens in circulation at the moment of snapshot with
   * given index.
   *
   * @param _index index of the snapshot to get total number of tokens in
   *       circulation at the moment of
   * @return total number of tokens in circulation at the moment of snapshot with
   *         given index
   */
  function doTotalSupplyAt (uint256 _index)
    constant returns (bool success, uint256 supply) {
    return (true, totalSupplyAt (_index));
  }

  /**
   * Get number of tokens given owner had at the moment of snapshot with given
   * index.
   *
   * @param _owner address of the owner to get number of tokens for
   * @param _index index of the snapshot to get number of tokens at the time of
   * @return number of tokens owner of given address had at the moment of the
   *         snapshot with given index
   */
  function doBalanceOfAt (address _owner, uint256 _index)
    constant returns (bool success, uint256 balance) {
    return (true, balanceOfAt (_owner, _index));
  }

  /**
   * Get first address that probably had non-zero token balance at the moment of
   * snapshot with given index.
   *
   * @param _index index of the snapshot to get first address the probably had
   *        non-zero token balance at the moment of
   * @return flag that tells whether there is at least one address that probably
   *         had non-zero token balance at the moment of snapshot with given
   *         index (hasResult); and the fist address that probably had non-zero
   *         token balance at the moment of snapshot with given index or zero
   *         if there are no such addresses (result)
   */
  function doFirstAddressAt (uint256 _index)
    constant returns (bool success, bool hasResult, address result) {
    (hasResult, result) = firstAddressAt (_index);
    return (true, hasResult, result);
  }

  /**
   * Get next address that probably had non-zero token balance at the moment of
   * certain snapshot.
   *
   * @param _address previous address that probably had non-zero token balance
   *        at the moment of certain snapshot
   * @return flag that tells whether there is next address that probably had
   *         non-zero token balance at the moment of snapshot with given index
   *         (hasResult); and the next address that probably had non-zero
   *         token balance at the moment of snapshot with given index or zero
   *         if there are no such addresses (result)
   */
  function doNextAddress (address _address)
    constant returns (bool success, bool hasResult, address result) {
    (hasResult, result) = nextAddress (_address);
    return (true, hasResult, result);
  }

  /**
   * Create given number of tokens and give them to message sender.
   *
   * @param _value number of tokens to create
   * @return true on success, false on error
   */
  function createTokens (uint256 _value) returns (bool success) {
    Result (success = AbstractSnapshottableToken.doCreateTokens (_value));
  }

  /**
   * Create snapshot of token holder balances.
   *
   * @return index of new snapshot
   */
  function snapshot () returns (uint256 index) {
    ResultValue (index = AbstractSnapshottableToken.snapshot ());
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
}
