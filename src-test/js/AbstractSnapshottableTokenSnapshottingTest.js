/*
 * Test for Abstract Snapshottable Token Smart Contract that tests
 * snapshotting functionality.
 * Copyright © 2017 by ABDK Consulting.
 * Author: Mikhail Vladimirov <mikhail.vladimirov@gmail.com>
 */

tests.push ({
  name: "AbstractSnapshottableTokenSnapshotting",
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
    { name: "Alice deploys AbstractSnapshottableTokenWrapper contract",
      body: function (test) {
        test.abstractSnapshottableTokenWrapperContract =
          loadContract ("AbstractSnapshottableTokenWrapper");
        var abstractSnapshottableTokenWrapperCode =
          loadContractCode ("AbstractSnapshottableTokenWrapper");

        personal.unlockAccount (test.alice, "");
        test.tx = test.abstractSnapshottableTokenWrapperContract.new (
          {from: test.alice, data: abstractSnapshottableTokenWrapperCode,
            gas: 1500000}).
          transactionHash;
      }},
    { name: "Make sure contract was deployed",
      precondition: function (test) {
        miner.start ();
        return web3.eth.getTransactionReceipt (test.tx);
      },
      body: function (test) {
        miner.stop ();

        test.abstractSnapshottableTokenWrapper =
          getDeployedContract ("AbstractSnapshottableTokenWrapper",
              test.abstractSnapshottableTokenWrapperContract, test.tx);
      }},
    { name: "Make sure getting balance, total supply, and first address at snapshot #0 leads to an exception",
      body: function (test) {
        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.bob.address, 0);
        assert ("!result [0]", !result [0]);

        var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (0);
        assert ("!result [0]", !result [0]);

        var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (0);
        assert ("!result [0]", !result [0]);
      }},
    { name: "Make sure getting balance, total supply, and first address at snapshot #1 leads to an exception",
      body: function (test) {
        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.bob.address, 1);
        assert ("!result [0]", !result [0]);

        var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (1);
        assert ("!result [0]", !result [0]);

        var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (1);
        assert ("!result [0]", !result [0]);
      }},
    { name: "Carol creates snapshot",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.abstractSnapshottableTokenWrapper.address,
          test.abstractSnapshottableTokenWrapper.snapshot.getData (),
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
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.ResultValue",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.ResultValue,
          test.tx,
          { _value: 1 });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Snapshot",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Snapshot,
          test.tx,
          { _index: 1 });

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.bob.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.carol.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.dave.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (1);
        assert ("result [0]", result [0]);
        assert ("!result [1]", !result [1]);
        assertBNEquals ("result [2]", 0, result [2]);
      }},
    { name: "Bob creates 100 tokens",
      body: function (test) {
        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.totalSupply ()",
          0,
          test.abstractSnapshottableTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          0,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.abstractSnapshottableTokenWrapper.address,
          test.abstractSnapshottableTokenWrapper.createTokens.getData (
            100),
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
          "test.abstractSnapshottableTokenWrapper.Result",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.totalSupply ()",
          100,
          test.abstractSnapshottableTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          100,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address));
      }},
    { name: "Carol creates 30 snapshots",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = [];
        for (var i = 0; i < 30; i++) {
          test.tx.push (test.carol.execute (
            test.abstractSnapshottableTokenWrapper.address,
            test.abstractSnapshottableTokenWrapper.snapshot.getData (),
              0,
              {from: test.alice, gas: 1000000}));
        }
      }},
    { name: "Make sure transactions succeeded",
      precondition: function (test) {
        miner.start ();
        for (var i = 0; i < 30; i++)
          if (!web3.eth.getTransactionReceipt (test.tx [i]))
            return false;

        return true;
      },
      body: function (test) {
        miner.stop ();

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.bob.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.carol.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.dave.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (1);
        assert ("result [0]", result [0]);
        assert ("!result [1]", !result [1]);
        assertBNEquals ("result [2]", 0, result [2]);

        for (var i = 0; i < 30; i++) {
          assertEvents (
            "test.carol.Result",
            test.carol,
            test.carol.Result,
            test.tx [i],
            { _value: true });

          assertEvents (
            "test.abstractSnapshottableTokenWrapper.ResultValue",
            test.abstractSnapshottableTokenWrapper,
            test.abstractSnapshottableTokenWrapper.ResultValue,
            test.tx [i],
            { _value: 2 + i });

          assertEvents (
            "test.abstractSnapshottableTokenWrapper.Snapshot",
            test.abstractSnapshottableTokenWrapper,
            test.abstractSnapshottableTokenWrapper.Snapshot,
            test.tx [i],
            { _index: 2 + i });

          var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
            test.bob.address, 2 + i);
          assert ("result [0]", result [0]);
          assertBNEquals ("result [1]", 100, result [1]);
  
          var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
            test.carol.address, 2 + i);
          assert ("result [0]", result [0]);
          assertBNEquals ("result [1]", 0, result [1]);
  
          var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
            test.dave.address, 2 + i);
          assert ("result [0]", result [0]);
          assertBNEquals ("result [1]", 0, result [1]);
  
          var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (2 + i);
          assert ("result [0]", result [0]);
          assertBNEquals ("result [1]", 100, result [1]);

          var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (2 + i);
          assert ("result [0]", result [0]);
          assert ("result [1]", result [1]);
          assertEquals ("result [2]", test.bob.address, result [2]);

          var result = test.abstractSnapshottableTokenWrapper.doNextAddress (test.bob.address);
          assert ("result [0]", result [0]);
          assert ("!result [1]", !result [1]);
          assertBNEquals ("result [2]", 0, result [2]);
        }
      }},
    { name: "Bob transfers 10 tokens to Dave",
      body: function (test) {
        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          100,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address));

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address)",
          0,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.bob.execute (
          test.abstractSnapshottableTokenWrapper.address,
          test.abstractSnapshottableTokenWrapper.transfer.getData (
            test.dave.address,
            10),
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
          "test.abstractSnapshottableTokenWrapper.Result",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Transfer",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Transfer,
          test.tx,
          { _from: test.bob.address, _to: test.dave.address, _value: 10 });

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          90,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address));

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address)",
          10,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address));
      }},
    { name: "Carol creates 20 tokens",
      body: function (test) {
        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.totalSupply ()",
          100,
          test.abstractSnapshottableTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          0,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.carol.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.abstractSnapshottableTokenWrapper.address,
          test.abstractSnapshottableTokenWrapper.createTokens.getData (
            20),
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
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Result",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.totalSupply ()",
          120,
          test.abstractSnapshottableTokenWrapper.totalSupply ());

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          20,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.carol.address));
      }},
    { name: "Make sure historical balances didn't change",
      body: function (test) {
        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.bob.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.carol.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.dave.address, 1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (1);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 0, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (1);
        assert ("result [0]", result [0]);
        assert ("!result [1]", !result [1]);
        assertBNEquals ("result [2]", 0, result [2]);

        for (var i = 0; i < 30; i++) {
          var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
            test.bob.address, 2 + i);
          assert ("result [0]", result [0]);
          assertBNEquals ("result [1]", 100, result [1]);
  
          var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
            test.carol.address, 2 + i);
          assert ("result [0]", result [0]);
          assertBNEquals ("result [1]", 0, result [1]);
  
          var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
            test.dave.address, 2 + i);
          assert ("result [0]", result [0]);
          assertBNEquals ("result [1]", 0, result [1]);
  
          var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (2 + i);
          assert ("result [0]", result [0]);
          assertBNEquals ("result [1]", 100, result [1]);

          var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (2 + i);
          assert ("result [0]", result [0]);
          assert ("result [1]", result [1]);
          assertEquals ("result [2]", test.bob.address, result [2]);

          var result = test.abstractSnapshottableTokenWrapper.doNextAddress (test.bob.address);
          assert ("result [0]", result [0]);
          assert ("!result [1]", !result [1]);
          assertBNEquals ("result [2]", 0, result [2]);
        }
      }},
    { name: "Carol creates snapshot",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.abstractSnapshottableTokenWrapper.address,
          test.abstractSnapshottableTokenWrapper.snapshot.getData (),
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
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.ResultValue",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.ResultValue,
          test.tx,
          { _value: 32 });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Snapshot",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Snapshot,
          test.tx,
          { _index: 32 });

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.bob.address, 32);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 90, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.carol.address, 32);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 20, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.dave.address, 32);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 10, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (32);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 120, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (32);
        assert ("result [0]", result [0]);
        assert ("result [1]", result [1]);
        assertEquals ("result [2]", test.carol.address, result [2]);

        var result = test.abstractSnapshottableTokenWrapper.doNextAddress (
          test.carol.address);
        assert ("result [0]", result [0]);
        assert ("result [1]", result [1]);
        assertEquals ("result [2]", test.dave.address, result [2]);

        var result = test.abstractSnapshottableTokenWrapper.doNextAddress (
          test.dave.address);
        assert ("result [0]", result [0]);
        assert ("result [1]", result [1]);
        assertEquals ("result [2]", test.bob.address, result [2]);

        var result = test.abstractSnapshottableTokenWrapper.doNextAddress (
          test.bob.address);
        assert ("result [0]", result [0]);
        assert ("!result [1]", !result [1]);
        assertBNEquals ("result [2]", 0, result [2]);
      }},
    { name: "Dave transfers 1 token to Bob",
      body: function (test) {
        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          90,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address));

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address)",
          10,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.dave.execute (
          test.abstractSnapshottableTokenWrapper.address,
          test.abstractSnapshottableTokenWrapper.transfer.getData (
            test.bob.address,
            1),
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
          "test.dave.Result",
          test.dave,
          test.dave.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Result",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Transfer",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Transfer,
          test.tx,
          { _from: test.dave.address, _to: test.bob.address, _value: 1 });

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address)",
          91,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.bob.address));

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address)",
          9,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address));
      }},
    { name: "Carol transfers 1 token to Dave",
      body: function (test) {
        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          20,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address)",
          9,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address));

        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.abstractSnapshottableTokenWrapper.address,
          test.abstractSnapshottableTokenWrapper.transfer.getData (
            test.dave.address,
            1),
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
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Result",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Transfer",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Transfer,
          test.tx,
          { _from: test.carol.address, _to: test.dave.address, _value: 1 });

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.carol.address)",
          19,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.carol.address));

        assertBNEquals (
          "test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address)",
          10,
          test.abstractSnapshottableTokenWrapper.balanceOf (test.dave.address));
      }},
    { name: "Carol creates snapshot",
      body: function (test) {
        personal.unlockAccount (test.alice, "");
        test.tx = test.carol.execute (
          test.abstractSnapshottableTokenWrapper.address,
          test.abstractSnapshottableTokenWrapper.snapshot.getData (),
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
          "test.carol.Result",
          test.carol,
          test.carol.Result,
          test.tx,
          { _value: true });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.ResultValue",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.ResultValue,
          test.tx,
          { _value: 33 });

        assertEvents (
          "test.abstractSnapshottableTokenWrapper.Snapshot",
          test.abstractSnapshottableTokenWrapper,
          test.abstractSnapshottableTokenWrapper.Snapshot,
          test.tx,
          { _index: 33 });

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.bob.address, 33);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 91, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.carol.address, 33);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 19, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doBalanceOfAt (
          test.dave.address, 33);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 10, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doTotalSupplyAt (33);
        assert ("result [0]", result [0]);
        assertBNEquals ("result [1]", 120, result [1]);

        var result = test.abstractSnapshottableTokenWrapper.doFirstAddressAt (33);
        assert ("result [0]", result [0]);
        assert ("result [1]", result [1]);
        assertEquals ("result [2]", test.carol.address, result [2]);

        var result = test.abstractSnapshottableTokenWrapper.doNextAddress (
          test.carol.address);
        assert ("result [0]", result [0]);
        assert ("result [1]", result [1]);
        assertEquals ("result [2]", test.dave.address, result [2]);

        var result = test.abstractSnapshottableTokenWrapper.doNextAddress (
          test.dave.address);
        assert ("result [0]", result [0]);
        assert ("result [1]", result [1]);
        assertEquals ("result [2]", test.bob.address, result [2]);

        var result = test.abstractSnapshottableTokenWrapper.doNextAddress (
          test.bob.address);
        assert ("result [0]", result [0]);
        assert ("!result [1]", !result [1]);
        assertBNEquals ("result [2]", 0, result [2]);
      }}
  ]});