# Science Blockchain Token Smart Contract: API

This document defines and API of Science Blockchain Token Smart Contract.

## 1. Constructor

### Signature

    function ScienceBlockchainToken ()

### Description

Deploy smart contract and makes message sender to be the owner of smart
contract.
Does not accept ether.

### Use Cases

* Administration:Deploy

## 2. Methods

### 2.1. name

#### Signature

    function name () constant returns (string result)

#### Description

Return name of the token.
May be called by anybody.
Does not accept ether.

#### Use Cases

* ERC20*:Name

### 2.2. symbol

#### Signature

    function symbol () constant returns (string result)

#### Description

Return symbol of the token.
May be called by anybody.
Does not accept ether.

#### Use Cases

* ERC20*:Symbol

### 2.3. decimals

#### Signature

    function decimals () constant returns (uint8 result)

#### Description

Return number of decimals for the token.
May be called by anybody.
Does not accept ether.

#### Use Cases

* ERC20*:Decimals

### 2.4. totalSupply

#### Signature

    function totalSupply ()
    constant returns (uint256 totalSupply)

#### Description

Return total number of tokens in circulation.
May be called by anybody.
Does not accept ether.
Defined by ERC-20.

#### Use Cases

* ERC-20:TotalSupply

### 2.5. balanceOf

#### Signature

    function balanceOf (address _owner)
    constant returns (uint256 balance)

Return number of tokens currently belonging to the owner of address _owner.
May be called by anybody.
Does not accept ether.
Defined by ERC-20.

#### Use Cases

* ERC-20:BalanceOf

### 2.6. transfer

#### Signature

    function transfer (address _to, uint356 _value)
    returns (bool success)

#### Description

Transfer _value tokens from message sender to the owner of address _to.
Returns true on success, false on error.
If this method returned false, it is guaranteed that state of the smart contract was not changed.
May be called by anybody.
Does not accept ether.
Defined by ERC-20.

#### Use Cases

* ERC-20:Transfer

### 2.7. transferFrom

#### Signature

    function transferFrom (address _from, address _to, uint256 _value)
    returns (bool success)

#### Description

Transfer _value tokens from the owner of address _from to the owner of address _to.
The transfer should be approved in advance by the owner of address _from.
Returns true on success, false on error.
If this method returned false, it is guaranteed that state of the smart contract was not changed.
May be called by anybody.
Does not accept ether.
Defined by ERC-20.

#### Use Cases

* ERC-20:TransferFrom

### 2.8. approve

#### Signature

    function approve (address _spender, uint256 _value)
    returns (bool success)

#### Description

Allow the owner of address _spender to transfer _value tokens from message sender.
Call to this method overrides any existing allowance of the owner of _spender address to transfer tokens belonging to message sender.
Returns true on success, false on error.
If this method returned false, it is guaranteed that state of the smart contract was not changed.
May be called by anybody.
Does not accept ether.
Defined by ERC-20.

#### Use Cases

* ERC-20:Approve

### 2.9. allowance

#### Signature

    function allowance (address _owner, address _spender)
    constant returns (uint256 remaining)

#### Description

Return number of tokens belonging to the owner of _owner address the owner of _spender address is currently allowed to transfer.
May be called by anybody.
Does not accept ether.
Defined by ERC-20.

#### Use Cases

* ERC-20:Allowance

### 2.10. totalSupplyAt

#### Signature

    function totalSupplyAt (uint256 _index)
    constant returns (uint256 supply)

#### Description

Return total number of tokens that were in circulation and the moment snapshot with given index _index was created.
May be called by anybody.
Does not accept ether.

#### Use Cases

* Snapshot:TotalSupplyAt

### 2.11. balanceOfAt

#### Signature

    function balanceOfAt (address _owner, uint256 _index)
    constant returns (uint256 balance)

#### Description

Return number of tokens that were belonging to the owner of given address _owner at the moment snapshot with given index _index was created.
May be called by anybody.
Does not accept ether.

#### Use Cases

* Snapshot:BalanceOfAt

### 2.12. firstAddressAt

#### Signature

    function firstAddressAt (uint256 _index)
    constant returns (bool hasResult, address result)

#### Description

Get first address from the list of addresses whose owners probably had non-zero number of tokens belonging to them at the moment snapshot with given index _index was created.
Returns two values:
 * hasResult: true if list of addresses is not empty, false otherwise
 * result: first address from the list if list of addresses is not empty, zero otherwise
May be called by anybody.
Does not accept ether.

#### Use Cases

* Snapshot:ListTokenHolders

### 2.13. nextAddress

#### Signature

    function nextAddress (address _address)
    constant returns (bool hasResult, address result)

#### Description

Get address following the given address _address in the list of address whose owners probably has non-zero number of tokens belonging to them at the moment certain snapshot was created.
Returns two values:
 * hasResult: true if there are more addresses in the list, false otherwise
 * result: next address from the list if if there are more addresses in the list, zero otherwise
May be called by anybody.
Does not accept ether.

#### Use Cases

* Snapshot:ListTokenHolders

### 2.14. snapshot

#### Signature

    function snapshot () returns (uint256 index)

#### Description

Create snapshot of token balances.
Returns index of new created snapshot.
May be called by anybody.
Does not accept ether.

# Use Cases

* Snapshot:Create

### 2.15. createTokens

#### Signature

    function createTokens (uint256 _value)
    returns (bool success)

#### Description

Create _value tokens and give them to the owner of smart contact.
Returns true on success, false on error.
May be called only by the owner of smart contract.
Does not accept ether.

#### Use Cases

* Admin:CreateTokens

### 2.16. burnTokens

#### Signature

    function burnTokens (uint256 _value)
    returns (bool success)

#### Description

Burn (i.e. destroy) _value tokens belonging to message sender.
Returns true on success, false on error.
Does not accept ether.

#### Use Cases

* Token:Burn

### 2.17. setOwner

    function setOwner (address _newOwner) {

#### Description

Set owner of _newOwner address to be the owner of smart contract.
May be called only by the owner of smart contract.
Does not accept ether.

#### Use Cases

* Admin:SetOwner

### 2.18. freezeTransfers

#### Signature

    function freezeTransfers ()

#### Description

Freeze transfers.
May be called only by the owner of smart contract.
Does not accept ether.

#### Use Cases

* Administration:Freeze

### 2.19. unfreezeTransfers

#### Signature

    function unfreezeTransfers ()

#### Description

Unfreeze transfers.
May be called only by the owner of smart contract.
Does not accept ether.

#### Use Cases

* Administration:Unfreeze

### 2.20. setSnapshotCreator

    function setSnapshotCreator (address _snapshotCreator) {

#### Description

Set owner of _snapshotCreator address to be the snapshot creator, i.e. the one who is allowed to create snapshots.
May be called only by the owner of smart contract.
Does not accept ether.

#### Use Cases

* Admin:SetSnapshotCreator

## 3. Events

### 3.1. Transfer

#### Signature

    event Transfer (indexed address _from, indexed address _to, uint256 _value)

#### Description

Logged when _value tokens were transferred from the owner of address _from to the owner of address _to.

#### Use Cases

* ERC-20:Transfer
* ERC-20:TransferFrom

### 3.2. Approval

#### Signature

    event Approval (indexed address _owner, indexed address _spender, uint256 _value)

#### Description

Logged with owner of address _owner allowed the owner of address _spender to transfer _value of tokens belonging to the owner of address _owner.

#### Use Cases

* ERC-20:Approve

### 3.3. Freeze

#### Signature

    event Freeze ()

#### Description

Logged when token transfers were frozen.

#### Use Cases

* Administracion:Freeze

### 3.3. Unfreeze

#### Signature

    event Unfreeze ()

#### Description

Logged when token transfers were unfrozen.

#### Use Cases

* Administracion:Unfreeze

### 3.4. Snapshot

#### Signature

    event Snapshot (uint256 indexed _index)

#### Description

Logged when snapshot with index _index was created.

#### Use Cases

* Snapshot:Create
