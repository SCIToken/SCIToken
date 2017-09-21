/*
 * Test for Science Blockchain Token Smart Contract.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "ScienceBlockchainToken",
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
    { name: "Alice deploys ScienceBlockchainTokenWrapper smart contract",
      body: function (test) {
        test.scienceBlockchainTokenWrapperContract =
          loadContract ("ScienceBlockchainTokenWrapper");
        var scienceBlockchainTokenWrapperCode =
          loadContractCode ("ScienceBlockchainTokenWrapper");

        personal.unlockAccount (test.alice, "");
        test.tx = test.scienceBlockchainTokenWrapperContract.new (
          {from: test.alice, data: scienceBlockchainTokenWrapperCode, gas: 1500000}).
          transactionHash;
      }},
    { name: "Make sure contract was deployed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        test.scienceBlockchainTokenWrapper = getDeployedContract (
          "scienceBlockchain",
          test.scienceBlockchainTokenWrapperContract,
          test.tx);

        assertEquals (
          "test.scienceBlockchainTokenWrapper.name ()",
          "SCIENCE BLOCKCHAIN",
          test.scienceBlockchainTokenWrapper.name ());

        assertEquals (
          "test.scienceBlockchainTokenWrapper.symbol ()",
          "SCI",
          test.scienceBlockchainTokenWrapper.symbol ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.decimals ()",
          0,
          test.scienceBlockchainTokenWrapper.decimals ());
      }},
    { name: "Alice deploys Wallet contract: Bob",
      body: function (test) {
        test.walletContract = loadContract ("Wallet");
        var walletCode = loadContractCode ("Wallet");

        personal.unlockAccount (test.alice, "");
        test.tx = test.walletContract.new (
          {from: test.alice, data: walletCode, gas: 1000000}).
          transactionHash;
      }},
    { name: "Make sure contract was deployed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        test.bob = getDeployedContract ("Bob", test.walletContract, test.tx);
      }},
    { name: "Bob tries to set Bob as snapshot creator but he is not an owner of the smart contract",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.setSnapshotCreator.getData (test.bob.address),
          0,
          {from: test.alice, gas: 1000000});
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
      }},
    { name: "Alice makes Bob to be the owner of smart contract",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.scienceBlockchainTokenWrapper.setOwner (
          test.bob.address,
          {from: test.alice, gas: 1000000});
      }},
    { name: "Make sure transaction succeeded",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();
      }},
    { name: "Bob tries to creates snapshot but he is not a snapshot creator",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.snapshot.getData (),
          0,
          {from: test.alice, gas: 1000000});
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
          "test.scienceBlockchainTokenWrapper.Snapshot",
          test.scienceBlockchainTokenWrapper,
          test.scienceBlockchainTokenWrapper.Snapshot,
          test.tx);
      }},
    { name: "Bob sets Bob as snapshot creator",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.setSnapshotCreator.getData (test.bob.address),
          0,
          {from: test.alice, gas: 1000000});
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
      }},
    { name: "Bob creates snapshot",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.snapshot.getData (),
          0,
          {from: test.alice, gas: 1000000});
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

        assertEvents (
          "test.scienceBlockchainTokenWrapper.Snapshot",
          test.scienceBlockchainTokenWrapper,
          test.scienceBlockchainTokenWrapper.Snapshot,
          test.tx,
          { _index: 1 });

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (1)",
          0,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (1));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 1)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 1));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (1);
        assert ("!result [0]", !result [0]);
        assertBNEquals ("result [1]", 0, result [1]);
      }},
    { name: "Bob tries to burn 1 token, but he does not have any tokens",
      body: function (test) {
        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupply ()",
          0,
          test.scienceBlockchainTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.burnTokens.getData (1),
          0,
          {from: test.alice, gas: 1000000});
      }},
    { name: "Make sure transaction succeeded but no tokens were burned",
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

        assertEvents (
          "test.scienceBlockchainTokenWrapper.Result",
          test.scienceBlockchainTokenWrapper,
          test.scienceBlockchainTokenWrapper.Result,
          test.tx,
          { _value: false });

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupply ()",
          0,
          test.scienceBlockchainTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Bob creates 10 tokens",
      body: function (test) {
        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupply ()",
          0,
          test.scienceBlockchainTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.createTokens.getData (10),
          0,
          {from: test.alice, gas: 1000000});
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

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupply ()",
          10,
          test.scienceBlockchainTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address)",
          10,
          test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Bob creates snapshot",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.snapshot.getData (),
          0,
          {from: test.alice, gas: 1000000});
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

        assertEvents (
          "test.scienceBlockchainTokenWrapper.Snapshot",
          test.scienceBlockchainTokenWrapper,
          test.scienceBlockchainTokenWrapper.Snapshot,
          test.tx,
          { _index: 2 });

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (1)",
          0,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (1));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 1)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 1));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (1);
        assert ("!result [0]", !result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (2)",
          10,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (2));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 2)",
          10,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 2));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (2);
        assert ("result [0]", result [0]);
        assertEquals ("result [1]", test.bob.address, result [1]);

        var result = test.scienceBlockchainTokenWrapper.nextAddress (test.bob.address);
        assert ("!result [0]", !result [0]);
        assertBNEquals ("result [1]", 0, result [1]);
      }},
    { name: "Bob burns 3 tokens",
      body: function (test) {
        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupply ()",
          10,
          test.scienceBlockchainTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address)",
          10,
          test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.burnTokens.getData (3),
          0,
          {from: test.alice, gas: 1000000});
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

        assertEvents (
          "test.scienceBlockchainTokenWrapper.Result",
          test.scienceBlockchainTokenWrapper,
          test.scienceBlockchainTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupply ()",
          7,
          test.scienceBlockchainTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address)",
          7,
          test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Bob creates snapshot",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.snapshot.getData (),
          0,
          {from: test.alice, gas: 1000000});
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

        assertEvents (
          "test.scienceBlockchainTokenWrapper.Snapshot",
          test.scienceBlockchainTokenWrapper,
          test.scienceBlockchainTokenWrapper.Snapshot,
          test.tx,
          { _index: 3 });

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (1)",
          0,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (1));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 1)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 1));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (1);
        assert ("!result [0]", !result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (2)",
          10,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (2));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 2)",
          10,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 2));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (2);
        assert ("result [0]", result [0]);
        assertEquals ("result [1]", test.bob.address, result [1]);

        var result = test.scienceBlockchainTokenWrapper.nextAddress (test.bob.address);
        assert ("!result [0]", !result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (3)",
          7,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (3));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 3)",
          7,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 3));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (3);
        assert ("result [0]", result [0]);
        assertEquals ("result [1]", test.bob.address, result [1]);
      }},
    { name: "Bob burns 7 tokens",
      body: function (test) {
        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupply ()",
          7,
          test.scienceBlockchainTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address)",
          7,
          test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.burnTokens.getData (7),
          0,
          {from: test.alice, gas: 1000000});
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

        assertEvents (
          "test.scienceBlockchainTokenWrapper.Result",
          test.scienceBlockchainTokenWrapper,
          test.scienceBlockchainTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupply ()",
          0,
          test.scienceBlockchainTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Bob creates snapshot",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.scienceBlockchainTokenWrapper.address,
          test.scienceBlockchainTokenWrapper.snapshot.getData (),
          0,
          {from: test.alice, gas: 1000000});
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

        assertEvents (
          "test.scienceBlockchainTokenWrapper.Snapshot",
          test.scienceBlockchainTokenWrapper,
          test.scienceBlockchainTokenWrapper.Snapshot,
          test.tx,
          { _index: 4 });

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (1)",
          0,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (1));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 1)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 1));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (1);
        assert ("!result [0]", !result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (2)",
          10,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (2));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 2)",
          10,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 2));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (2);
        assert ("result [0]", result [0]);
        assertEquals ("result [1]", test.bob.address, result [1]);

        var result = test.scienceBlockchainTokenWrapper.nextAddress (test.bob.address);
        assert ("!result [0]", !result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (3)",
          7,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (3));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 3)",
          7,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 3));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (3);
        assert ("result [0]", result [0]);
        assertEquals ("result [1]", test.bob.address, result [1]);

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.totalSupplyAt (4)",
          0,
          test.scienceBlockchainTokenWrapper.totalSupplyAt (4));

        assertBNEquals (
          "test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 4)",
          0,
          test.scienceBlockchainTokenWrapper.balanceOfAt (test.bob.address, 4));

        var result = test.scienceBlockchainTokenWrapper.firstAddressAt (4);
        assert ("result [0]", result [0]);
        assertEquals ("result [1]", test.bob.address, result [1]);
      }}
  ]});
