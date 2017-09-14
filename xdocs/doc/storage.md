# Science Blockchain Token Smart Contract: Storage

This document describes storage structure of Science Blockchain Token Smart
Contract.

## 1. owner

### Signature

    address owner

### Description

Address of the owner of smart contract.

### Read in use cases

* Admin:CreateTokens
* Admin:SetOwner
* Admin:FreezeTransfers
* Admin:UnfreezeTransfers

### Modified in use cases

* Administration:Deploy
* Administration:SetOwner

## 2. frozen

### Signature

    bool frozen

### Description

True if token transfers are currently frozen, false otherwise.

### Read in use cases:

* ERC20:Transfer
* ERC20:TransferFrom
* Administration:FreezeTransfers
* Administration:UnfreezeTransfers

### Modified in use cases:

* Administration:FreezeTransfers
* Administration:UnfreezeTransfers

## 3. tokensCount

### Signature

    uint256 tokensCount

### Description

Total number of tokens in circulation.

### Read in use cases:

* ERC20:TotalSupply
* Administration:CreateTokens
* Token:Burn

### Modified in use cases:

* Administration:CreateTokens
* Token:Burn

## 4. snapshots

### Signature

    SnapshotInfo [] snapshots;
    struct SnapshotInfo {
      uint256 tokensCount;
      uint256 firstAddress;
    }

### Description

Stores information about all snapshots created in the past.
Value of `snapshots [index].tokensCount` is the total number of tokens in circulation at the moment when snapshot with given index was created.
Value of `snapshots [index].firstAddress` is the the value of `firstAddress` storage variable as it was at the moment when snapshot with given index was created

### Read in use cases

* Snapshot:TotalSupplyAt
* Snapshot:FirstAddressAt

### Modified in use cases:

* Snapshot:Create

## 5. accounts

### Signature

    mapping (address => Account) accounts
    struct Account {
      uint256 balance;
      uint256 lastSnapshotIndex;
    }

### Description

Stores information about states of accounts of token holders.
Value of `accounts [owner].balance` if current number of Science Blockchain tokens belonging to the owner of address `owner`.
Value of `accounts [owner].lastSnapshotIndex` is the number of latest snapshot historical balance for the owner of address `owner` was saved for the moment of.

### Read in use cases

* ERC20:BalanceOf
* ERC20:Transfer
* ERC20:TransferFrom
* Snapshot:BalanceOfAt
* Snapshot:ListTokenHolders
* Administration:CreateTokens
* Token:Burn

### Modified in use cases

* ERC20:Transfer
* ERC20:TransferFrom
* Administration:CreateTokens
* Token:Burn

## 6. firstAddress

### Signature

    uint256 firstAddress

### Description

If list of addresses that probably had non-zero token balance is not empty, contains first address from the list plus 2^160.
If the list is empty, contains 2^256-1.

### Read in use cases

* Snapshot:Create
* ERC20:Transfer
* ERC20:TransferFrom
* Administration:CreateTokens

### Modified in use cases

* ERC20:Transfer
* ERC20:TransferFrom
* Administration:CreateTokens

## 7. nextAddresses

### Signature

    mapping (address => uint256) nextAddresse

### Description

For every address that is in the list of addresses that probably had non-zero token balance, contains next address in the list plus 2^160 or, if there is no next address, 2^256-1.

### Read in use cases

* Snapshot:ListTokenHolders

### Modified in use cases

* ERC20:Transfer
* ERC20:TransferFrom
* Administration:CreateTokens

## 8. historicalBalances

### Signature

    mapping (address => mapping (uint8 => mapping (uint256 => uint256))) historicalBalances

### Description

Stores historical balances of token holders at the moments of snapshots created in the past.
If value of `historicalBalances [owner][level][index]` is non-zero, then this value is the number of tokens owner of address `owner` had at the moments of snapshots with indexes from `index*2^level` to `(index + 1)*2^level-1` (inclusive).
For any owner address and snapshot index, at most one of the following values could be non-zero: `historicalBalances [owner][1][index]`, `historicalBalances [owner][2][index/2]`, ...,  `historicalBalances [owner][level][index/(2^level)]`, ...

### Read in use cases:

* Snapshot:BalanceOfAt

### Modified in use cases

* ERC20:Transfer
* ERC20:TransferFrom
* Administration:CreateTokens
* Token:Burn

## 9. approves

### Signature

    mapping (address => mapping (address => uint256)) approved

### Description

Stores number of tokens one token holders allowed other token holders to transfer.
Value of `approved [owner][spender]` is the number of tokens belonging to the owner of address `owner` the owner of address `spender` is currently allowed to transfer.

### Read in use cases

* ERC20:TransferFrom
* ERC20:Allowance

### Midifier in use cases

* ERC20:TransferFrom
* ERC20:Approve