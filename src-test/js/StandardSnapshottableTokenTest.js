/*
 * Test for Standard Snapshottable Token Smart Contract.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "StandardSnapshottableToken",
  steps: [
    { name: "Ensure there is at least one account: Alice",
      body: function (test) {
        while (!web3.eth.accounts || web3.eth.accounts.length < 1)
          personal.newAccount ("");

        test.alice = web3.eth.accounts [0];
      }},
    { name: "Ensure Alice has at least 5 ETH",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getBalance (test.alice).gte (web3.toWei ("5", "ether"));
      },
      body: function (test) {
        miner.stop ();
      }},
    { name: "Alice deploys three Wallet contracts: Bob, Carol and Dave",
      body: function (test) {
        test.walletContract = loadContract ("Wallet");
        var walletCode = loadContractCode ("Wallet");

        personal.unlockAccount (test.alice, "");
        test.tx1 = test.walletContract.new (
          {from: test.alice, data: walletCode, gas: 1000000}).
          transactionHash;
        test.tx2 = test.walletContract.new (
          {from: test.alice, data: walletCode, gas: 1000000}).
          transactionHash;
        test.tx3 = test.walletContract.new (
          {from: test.alice, data: walletCode, gas: 1000000}).
          transactionHash;
      }},
    { name: "Make sure contracts were deployed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx1) &&
          web3.eth.getTransactionReceipt (test.tx2) &&
          web3.eth.getTransactionReceipt (test.tx3);
      },
      body: function (test) {
        miner.stop ();

        test.bob = getDeployedContract ("Bob", test.walletContract, test.tx1);
        test.carol = getDeployedContract ("Carol", test.walletContract, test.tx2);
        test.dave = getDeployedContract ("Dave", test.walletContract, test.tx3);
      }},
    { name: "Alice deploys StandardSnapshottableTokenWrapper contract",
      body: function (test) {
        test.standardSnapshottableTokenWrapperContract =
          loadContract ("StandardSnapshottableTokenWrapper");
        var standardSnapshottableTokenWrapperCode =
          loadContractCode ("StandardSnapshottableTokenWrapper");

        personal.unlockAccount (test.alice, "");
        test.tx = test.standardSnapshottableTokenWrapperContract.new (
          {from: test.alice, data: standardSnapshottableTokenWrapperCode, gas:2000000}).
          transactionHash;
      }},
    { name: "Make sure contract was deployed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        test.standardSnapshottableTokenWrapper = getDeployedContract (
          "standardSnapshottableTokenWrapper",
          test.standardSnapshottableTokenWrapperContract,
          test.tx);
      }},
    { name: "Bob tries to set Carol to be the owner of the smart contrat, but he is not the owner himself",
      body: function (test) {
        assertEquals (
          "test.standardSnapshottableTokenWrapper.getOwner ()",
          test.alice,
          test.standardSnapshottableTokenWrapper.getOwner ());

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.setOwner.getData (
            test.carol.address),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction failed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.bob.Result",
          test.bob,
          test.bob.Result,
          test.tx,
          { _value: false });

        assertEquals (
          "test.standardSnapshottableTokenWrapper.getOwner ()",
          test.alice,
          test.standardSnapshottableTokenWrapper.getOwner ());
      }},
    { name: "Alice makes Bob the owner of the smart contract",
      body: function (test) {
        assertEquals (
          "test.standardSnapshottableTokenWrapper.getOwner ()",
          test.alice,
          test.standardSnapshottableTokenWrapper.getOwner ());

        personal.unlockAccount (test.alice, "");
        test.tx = test.standardSnapshottableTokenWrapper.setOwner (
          test.bob.address,
          { from: test.alice, gas:1000000 });
      }},
    { name: "Make sure transaction succeeded",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEquals (
          "test.standardSnapshottableTokenWrapper.getOwner ()",
          test.bob.address,
          test.standardSnapshottableTokenWrapper.getOwner ());
      }},
    { name: "Bob makes Carol the owner of the smart contrat",
      body: function (test) {
        assertEquals (
          "test.standardSnapshottableTokenWrapper.getOwner ()",
          test.bob.address,
          test.standardSnapshottableTokenWrapper.getOwner ());

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.setOwner.getData (
            test.carol.address),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.bob.Result",
          test.bob,
          test.bob.Result,
          test.tx,
          { _value: true });

        assertEquals (
          "test.standardSnapshottableTokenWrapper.getOwner ()",
          test.carol.address,
          test.standardSnapshottableTokenWrapper.getOwner ());
      }},
    { name: "Bob tries to create 100 tokens but he is not the owner of the smart contract",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.totalSupply ()",
          0,
          test.standardSnapshottableTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          0,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.createTokens.getData (
            100),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction failed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.bob.Result",
          test.bob,
          test.bob.Result,
          test.tx,
          { _value: false });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx);

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.totalSupply ()",
          0,
          test.standardSnapshottableTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          0,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Carol creates 100 tokens",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.totalSupply ()",
          0,
          test.standardSnapshottableTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          0,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.createTokens.getData (
            100),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure succeeded and Carol got 100 tokens",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.totalSupply ()",
          100,
          test.standardSnapshottableTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          100,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));
      }},
    { name: "Carol transfers 10 tokens to Bob",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          100,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          0,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.transfer.getData (
            test.bob.address,
            10),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded and tokens were transferred",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Transfer",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Transfer,
          test.tx,
          { _from: test.carol.address, _to: test.bob.address, _value: 10 });

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          90,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          10,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Carol allows Dave to transfer 100 of her tokens",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address)",
          0,
          test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.approve.getData (
            test.dave.address,
            100),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded and allowance change",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Approval",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Approval,
          test.tx,
          { _owner: test.carol.address, _spender: test.dave.address, _value: 100 });

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address)",
          100,
          test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address));
      }},
    { name: "Dave transfers 20 Carol's tokens to to Bob",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address)",
          100,
          test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          90,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          10,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.dave.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.transferFrom.getData (
            test.carol.address,
            test.bob.address,
            20),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded and tokens were transferred",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.dave.Result",
          test.dave,
          test.dave.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Transfer",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Transfer,
          test.tx,
          { _from: test.carol.address, _to: test.bob.address, _value: 20 });

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address)",
          80,
          test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          70,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          30,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Bob tries to freeze transfers but he is not the owner of the smart contract",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.freezeTransfers.getData (),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction failed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.bob.Result",
          test.bob,
          test.bob.Result,
          test.tx,
          { _value: false });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Freeze",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Freeze,
          test.tx);
      }},
    { name: "Carol freezes transfers",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.freezeTransfers.getData (),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Freeze",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Freeze,
          test.tx,
          {});
      }},
    { name: "Carol freezes transfers but they are already frozen",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.freezeTransfers.getData (),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeede but no events were logged",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Freeze",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Freeze,
          test.tx);
      }},
    { name: "Carol tries to transfer 10 tokens to Bob but token transfers are frozen",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          70,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          30,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.transfer.getData (
            test.bob.address,
            10),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded but tokens were not transferred",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: false });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Transfer",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Transfer,
          test.tx);

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          70,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          30,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Dave tries to transfer 20 Carol's tokens to to Bob",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address)",
          80,
          test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          70,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          30,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.dave.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.transferFrom.getData (
            test.carol.address,
            test.bob.address,
            20),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded but no tokens were transferred",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.dave.Result",
          test.dave,
          test.dave.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: false });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Transfer",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Transfer,
          test.tx);

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address)",
          80,
          test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          70,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          30,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Bob tries to unfreeze transfers but he is not the owner of the smart contract",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.unfreezeTransfers.getData (),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction failed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.bob.Result",
          test.bob,
          test.bob.Result,
          test.tx,
          { _value: false });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Unfreeze",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Unfreeze,
          test.tx);
      }},
    { name: "Carol unfreezes transfers",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.unfreezeTransfers.getData (),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Unfreeze",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Unfreeze,
          test.tx,
          {});
      }},
    { name: "Carol unfreezes transfers but they are already unfrozen",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.unfreezeTransfers.getData (),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeede but no events were logged",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Unfreeze",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Unfreeze,
          test.tx);
      }},
    { name: "Carol tries to transfer 10 tokens to Bob but token transfers are frozen",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          70,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          30,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.transfer.getData (
            test.bob.address,
            10),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded and tokens were transferred",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Transfer",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Transfer,
          test.tx,
          { _from: test.carol.address, _to: test.bob.address, _value: 10 });

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          60,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          40,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Dave tries to transfer 20 Carol's tokens to to Bob",
      body: function (test) {
        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address)",
          80,
          test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          60,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          40,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.dave.execute (
          test.standardSnapshottableTokenWrapper.address,
          test.standardSnapshottableTokenWrapper.transferFrom.getData (
            test.carol.address,
            test.bob.address,
            20),
          0,
          { from: test.alice, gas:1000000});
      }},
    { name: "Make sure transaction succeeded and tokens were transferred",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        assertEvents (
          "test.dave.Result",
          test.dave,
          test.dave.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Result",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.standardSnapshottableTokenWrapper.Transfer",
          test.standardSnapshottableTokenWrapper,
          test.standardSnapshottableTokenWrapper.Transfer,
          test.tx,
          { _from: test.carol.address, _to: test.bob.address, _value: 20 });

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address)",
          60,
          test.standardSnapshottableTokenWrapper.allowance (test.carol.address, test.dave.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          40,
          test.standardSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          60,
          test.standardSnapshottableTokenWrapper.balanceOf (test.bob.address));
      }}
  ]});
