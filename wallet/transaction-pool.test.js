const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', ()=>{
	let transactionPool, transaction;

	beforeEach(() => {
		transactionPool = new TransactionPool();
		senderWallet = new Wallet();
		transaction = new Transaction({
			senderWallet,
			recipient: 'fake-recipient',
			amount: 50
		});
	});

	describe('setTransaction()', ()=>{
		it('adds a transaction', ()=>{
			transactionPool.setTransaction(transaction);

			expect(transactionPool.transactionMap[transaction.id])
			.toBe(transaction);
		});
	});
	
});