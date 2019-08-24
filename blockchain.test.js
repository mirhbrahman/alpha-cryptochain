const Blockchain = require('./blockchain');
const Block = require('./block');

describe('BlockChain', ()=>{
	let blockchain, newChain, originalChain;

	beforeEach(()=>{
		blockchain = new Blockchain();
		newChain = new Blockchain();
		originalChain = blockchain.chain;
	});

	it('contain a chain array instance', ()=>{
		expect(blockchain.chain instanceof Array).toBe(true);
	});

	it('start with genesis block', ()=>{
		expect(blockchain.chain[0]).toEqual(Block.genesis());
	});

	it('add a new value to the chain', ()=>{
		const newData = 'foo bar';
		blockchain.addBlock({data: newData});

		expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
	});

	describe('isValidChain()', ()=>{
		describe('when the chain does not start with genesis block', ()=>{
			it('return false', ()=>{
				blockchain.chain[0] = { data: 'fack-genesis' };
				expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
			});
		});

		describe('when the chain start with genesis block and has multiple blocks', ()=>{

			beforeEach(()=>{
				blockchain.addBlock({data: 'one'});
				blockchain.addBlock({data: 'two'});
				blockchain.addBlock({data: 'three'});
			});

			describe('and a lastHash reference has changed', ()=>{
				it('return false', ()=>{
					blockchain.chain[2].lastHash = 'broken-lastHash';

					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe('and the chain contains a block with a invalid field', ()=>{
				it('return false', ()=>{
					blockchain.chain[2].data = 'bad-data';

					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe('and the chain dose not contain a invalid blocks', ()=>{
				it('return true', ()=>{
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
				});
			});

		});
	});

	describe('replaceChain()', ()=>{
		describe('when the new chain is not longer', ()=>{
			it('does not replace the chain', ()=>{
				newChain.chain[0] = { new: 'chain' };
				blockchain.replaceChain(newChain.chain);
				expect(blockchain.chain).toEqual(originalChain);
			});
		});
		describe('when the new chain is longer', ()=>{
			beforeEach(()=>{
				newChain.addBlock({data: 'one'});
				newChain.addBlock({data: 'two'});
				newChain.addBlock({data: 'three'});
			});
			describe('and the chain is invalid', ()=>{
				it('does not replace the chain', ()=>{
					newChain.chain[2].hash = 'some-fake-hash';
					blockchain.replaceChain(newChain.chain);
					expect(blockchain.chain).toEqual(originalChain);
				});
			});
			describe('and the chain is valid', ()=>{
				it('replace the chain', ()=>{
					blockchain.replaceChain(newChain.chain);
					expect(blockchain.chain).toEqual(newChain.chain);
				});
			});
		});
	});

});