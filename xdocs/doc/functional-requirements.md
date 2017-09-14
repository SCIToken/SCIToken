# Science Blockchain Token Smart Contract: Functional Requirements

This document summarizes functional requirements for Science Blockchain Token Smart
Contract.

## 0. Introduction

Science Blockchain Token Smart Contract is an [ERC-20](https://github.com/ethereum/EIPs/issues/20) compliant [Ethereum](https://ethereum.org) smart contract that manages Science Blockchain Tokens - lightweight cryptocurrency whose units represents shares in Science Blockchain.
The following sections of this document describe functional requirements for Science Blockchain Token Smart Contract.

## 1. Use Cases

This sections describes use cases for Science Blockchain Token Smart Contract.
Related use cases are grouped into functional blocks.

### 1.1. ERC20 Functional Block

This functional block contains use cases required by [ERC-20](https://github.com/ethereum/EIPs/issues/20) standard.
It also contains some non-standard ERC20 extensions that are marked with `ERC20*` prefix.

#### 1.1.1. ERC20:TotalSupply

**Actors**: *User*, *Smart Contract*

**Goal:** *User* wants to know how many tokens are currently in circulation

##### Main Flow:

1. *User* calls constant method on *Smart Contract*
2. *Smart Contract* returns to *User* total number of tokens in circulation

#### 1.1.2. ERC20:BalanceOf

**Actors**: *User*, *Smart Contract*

**Goal:** *User* wants to know how many tokens are currently belonging to the owner of certain address

##### Main Flow:

1. *User* calls constant method on *Smart Contract* providing the following information as method parameters: address to get number of tokens currently belonging to the owner of
2. *Smart Contract* returns to *User* number of tokens currently belonging to the owner of given address

#### 1.1.3. ERC20:Transfer

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to transfer some of his tokens to the owner of certain address

##### Main Flow:

1. *User* calls method on *Smart Contract* providing the following information as method parameters: address to transfer tokens to the owner of and number of tokens to transfer
2. Token transfers are not currently frozen
3. There are enough tokens currently belonging to *User*
4. *Smart Contract* transfers requested number of tokens from *User* to the owner of given address
5. Some tokens actually did change hands during the transfer, i.e. destination address was not the same as *User*'s own address and number of tokens transferred is greater than zero
6. *Smart Contract* logs tokens transfer event with the following information: address tokens were transferred from the owner of, address tokens were transferred to the owner of, and number of tokens transferred
7. *Smart Contract* returns success indicator to *User*

##### Exceptional Flow #1:

1. Same as in Main Flow
2. Token transfers are currently frozen
3. *Smart Contract* returns error indicator to *User*

##### Exceptional Flow #2:

1. Same as in Main Flow
2. Same as in Main Flow
3. There is not enough tokens currently belonging to *User*
4. *Smart Contract* returns error indicator to *User*

##### Exceptional Flow 9:

1. Same as in Main Flow
2. Same as in Main Flow
3. Same as in Main Flow
4. Same as in Main Flow
5. No tokens actually did change hands during the transfer, i.e. destination address was *User*'s own address, or number of tokens transferred was zero
6. *Smart Contract* returns success indicator to *User*

#### 1.1.4. ERC20:TransferFrom

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to transfer some of the tokens currently belonging to the owner of certain source address to the owner of certain destination address

##### Main Flow:

1. *User* calls method on *Smart Contract* providing the following information as method parameters: source address, destination address, and number of tokens to transfer
2. Token transfers are not currently frozen
3. *User* is currently allowed to transfer requested number of tokens from the owner of source address
4. There are enough tokens currently belonging to the owner of source address
5. *Smart Contract* transfers requested number of tokens from the owner of source address to the owner of destination address
6. *Smart Contract* decreases by the number of tokens transferred the number of tokens *User* is allowed to transfer from the owner of source address
7. Some tokens actually did change hands during the transfer, i.e. destination address was not the same as source address and number of tokens transferred was greater than zero
8. *Smart Contract* logs token transfer event with the following information: source address, destination address, and number of tokens transferred
9. *Smart Contract* returns success indicator to *User*

##### Exceptional Flow #1:

1. Same as in Main Flow
2. Token transfers are currently frozen
3. *Smart Contract* returns error indicator to *User*

##### Exceptional Flow #2:

1. Same as in Main Flow
2. Same as in Main Flow
3. *User* is not currently allowed to transfer requested number of tokens from the owner of source address
4. *Smart Contract* returns error indicator to *User*

##### Exceptional Flow #7:

1. Same as in Main Flow
2. Same as in Main Flow
3. Same as in Main Flow
4. There are not enough tokens currently belonging to the owner of source address
5. *Smart Contract* returns error indicator to *User*

##### Exceptional Flow #10:

1. Same as in Main Flow
2. Same as in Main Flow
3. Same as in Main Flow
4. Same as in Main Flow
5. Same as in Main Flow
6. same as in Main Flow
7. No tokens actually did change hands during the transfer, i.e. destination address was the same as source address or number of tokens transferred was zero
8. *Smart Contract* returns success indicator to *User*

#### 1.1.5. ERC20:Approve

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to set how many tokens belonging to *User* the owner of certain address is allowed to transfer

##### Main Flow:

1. *User* calls method on *Smart Contract* providing the following information as method parameters: address to allow the owner of to transfer tokens belonging to *User and number of tokens to allow transfer of
2. *Smart Contract* set the number of tokens belonging to *User* the owner of given address is allowed to transfer
3. *Smart Contract* logs token transfer approval event with the following information: *User*'s address, address the owner of was allowed to transfer tokens belonging to *User*, and number of tokens the transfer was allowed of
4. *Smart Contract* returns success indicator to *User*

#### 1.1.6. ERC20:Allowance

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to know how many tokens belonging to the owner of certain source address the owner of certain spender address is currently allowed to transfer

##### Main Flow:

1. *User* calls constant method on *Smart Contract* providing the following information as method parameters: source address and spender address
2. *Smart Contract* returns to *User* the number of tokens belonging to the owner of source address the owner of spender address is currently allowed to transfer

#### 1.1.7. ERC-20*:Name

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to know name of the token managed by *Smart Contract*

##### Main Flow:

1. *User* calls contact method on *Smart Contract*
2. *Smart Contract* returns the following information to *User*: name of the token managed by *Smart Contract*

#### 1.1.8. ERC-20*:Symbol

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to know symbol of the token managed by *Smart Contract*

##### Main Flow:

1. *User* calls contact method on *Smart Contract*
2. *Smart Contract* returns the following information to *User*: symbol of the token managed by *Smart Contract*

#### 1.1.9. ERC-20*:Decimals

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to know number of decimals for the token managed by *Smart Contract*

##### Main Flow:

1. *User* calls contact method on *Smart Contract*
2. *Smart Contract* returns the following information to *User*: number of decimals for the token managed by *Smart Contract*

### 1.2. Administration Functional Block

This functional block contains use cases related to smart contract administration.

#### 1.2.1. Administration:Deploy

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to deploy *Smart Contract* with certain token issuer address

##### Main Flow:

1. *User* deploys *Smart Contract*
2. *Smart Contract* makes *User* to be the owner of *Smart Contract*

#### 1.2.2. Administration:Freeze

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to freeze token transfers

##### Main Flow:

1. *User* calls method on *Smart Contract*
2. *User* is the owner of *Smart Contract*
3. Token transfers are not currently frozen
4. *Smart Contract* freezes token transfer
5. *Smart Contract* logs token transfers freeze event

##### Exceptional Flow #1:

1. Same as in Main Flow
2. *User* is not the owner of *Smart Contract*
3. *Smart Contract cancels transaction

##### Exceptional Flow #2:

1. Same as in Main Flow
2. Same as in Main Flow
3. Token transfers are currently frozen
4. *Smart Contract* does nothing

#### 1.2.3. Administration:Unfreeze

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to unfreeze token transfers

##### Main Flow:

1. *User* calls method on *Smart Contract*
2. *User* is the owner of *Smart Contract*
3. Token transfers are currently frozen
4. *Smart Contract* unfreezes token transfer
5. *Smart Contract* logs token transfers unfreeze event

##### Exceptional Flow #1:

1. Same as in Main Flow
2. *User* is not the owner of *Smart Contract*
3. *Smart Contract cancels transaction

##### Exceptional Flow #2:

1. Same as in Main Flow
2. Same as in Main Flow
3. Token transfers are not currently frozen
4. *Smart Contract* does nothing

#### 1.2.4. Administration:CreateTokens

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to create certain number of new tokens

##### Main Flow

1. *User* calls method on *Smart Contract* providing the following information as method parameters: number of tokens to be created
2. *User* is the owner of *Smart Contract*
3. Current number of tokens in circulation plus number of tokens *User* wants to create is not greater than the maximum number of tokens in circulation
4. *Smart Contract* creates requested number of new tokens
5. *Smart Contract* gives newly created tokens to *User*
6. *Smart Contract* returns success indicator to *User*

##### Exceptions Flow #1

1. Same as in Main Flow
2. *User* is not the owner of *Smart Contract*
3. *Smart Contract* cancels transaction

##### Exception Flow #2

1. Same as in Main Flow
2. Same as in Main Flow
3. Current number of tokens in circulation plus number of tokens *User* wants to create is greater than the maximum number of tokens in circulation
4. *Smart Contract* return error indicator to *User*

#### 1.2.5. Administration:SetOwner

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to set new owner for *Smart Contract*

##### Main Flow

1. *User* calls method on *Smart Contract* providing the following information as method parameters: address of the new owner of *Smart Contract*
2. *User is the owner of *Smart Contract*
3. *Smart Contract* remember given address as the address of the owner of *Smart Contract*

##### Exceptional Flow #1

1. Same as in Main Flow
2. *User* is not the owner of *Smart Contract*
3. *Smart Contract* cancels transaction

### 1.3. Snapshot Functional Block

This functional block contains use cases related to snapshot of token balances.

#### 1.3.1. Snapshot:TotalSupplyAt

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to known total number of tokens in circulation at the moment when certain snapshot was created

##### Main Flow

1. *User* calls constant method on *Smart Contract* providing the following information as method parameters: index of the snapshot to total number of tokens in circulation at the moment of 
2. Snapshot index is non zero
3. Snapshot index in less than or equals to the total number of Snapshots created in the past
4. *Smart Contract* returns total number of tokens in circulation at the moment of snapshot with given index

##### Exceptional Flow #1:

1. Same as in Main Flow
2. Snapshot index is zero
3. *Smart Contract* cancels transaction

##### Exceptional Flow #2:

1. Same as in Main Flow
2. Same as in Main Flow
3. Snapshot index is greater than the total number of snapshots made in the past
4. *Smart Contract* cancels transaction

#### 1.3.2. Snapshot:BalanceOfAt

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to known how many tokens were belonging to the owner of certain address at the moment when certain snapshot was created

##### Main Flow

1. *User* calls constant method on *Smart Contract* providing the following information as method parameters: address to get number of tokens belonging to the owner of and index of the snapshot to get number of tokens that were belonging to the owner of given address at the moment of
2. Snapshot index is non zero
3. Snapshot index in less than or equals to the total number of Snapshots created in the past
4. *Smart Contract* returns number of tokens that were belonging to the owner of given address at the moment snapshot with given index was created

##### Exceptional Flow #1:

1. Same as in Main Flow
2. Snapshot index is zero
3. *Smart Contract* cancels transaction

##### Exceptional Flow #2:

1. Same as in Main Flow
2. Same as in Main Flow
3. Snapshot index is greater than the total number of snapshots made in the past
4. *Smart Contract* cancels transaction

#### 1.3.3. Snapshot:ListTokenHolders

**Actors**: *User*, *Smart Contract*

**Goal**: *User* wants to get list of all addresses that probably had non-zero token balance at the moment when certain snapshot was created

##### Main Flow

1. *User* calls constant method on *Smart Contract* providing the following information as method parameters: index of the snapshot to get list of all addresses that probably had non-zero token balance at the moment of
2. Snapshot index is non zero
3. Snapshot index in less than or equals to the total number of Snapshots created in the past
4. Requested list of addresses is not empty
5. *Smart Contract* returns the following information to *User*: flag indicating that requested list of addresses is not empty and the first address from the list
6. *User* calls constant method on *Smart Contract* providing the following information as method parameters: previous address from the list
7. *Smart Contract* returns the following information to *User*: flag indications whether there are more addresses in the list, and, if there are more addresses, next address from the list
8. If there were more addresses in the list, go to step 6

##### Exceptional Flow #1:

1. Same as in Main Flow
2. Snapshot index is zero
3. *Smart Contract* cancels transaction

##### Exceptional Flow #2:

1. Same as in Main Flow
2. Same as in Main Flow
3. Snapshot index is greater than the total number of snapshots made in the past
4. *Smart Contract* cancels transaction

##### Exceptional Flow #3:

1. Same as in Main Flow
2. Same as in Main Flow
3. Same as in Main Flow
4. Requested list of addresses in empty
5. *Smart Contract* returns the following information to *User*: flag indicating that requested list of addresses is empty

#### 1.3.4. Snapshot:Create

**Actors:** *User*, *Smart Contact*

**Goal:** *User* wants to create snapshot of token balances

##### Main Flow:

1. *User* calls method on *Smart Contract*
2. *Smart Contract* created snapshot
3. *Smart Contract* logs event with the following information: index of new created snapshot
4. *Smart Contract* returns the following information to *User*: index of new created snapshot

## 2. Limits

The following limits are established:

Limit                                   | Value
--------------------------------------- | -------
Maximum number of tokens in circulation | 2^256-1

