const Block = require('./block');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', ()=>{
	const timestamp = 'a-date';
	const lastHash = 'foo-hash';
	const hash = 'bar-hash';
	const data = ['blockchain', 'data'];
	const block = new Block({timestamp, lastHash, hash, data
	});

	it('has a timestamp, lastHash, hash, data property', ()=>{
		expect(block.timestamp).toEqual(timestamp);
		expect(block.lastHash).toEqual(lastHash);
		expect(block.hash).toEqual(hash);
		expect(block.data).toEqual(data);
	});

	describe('genesis()', ()=>{
		const genesisBlock = Block.genesis();

		it('return a Block instance', ()=>{
			expect(genesisBlock instanceof Block).toBe(true);
		});

		it('return the genesis data', ()=>{
			expect(genesisBlock).toEqual(GENESIS_DATA);
		});
	});

	describe('mineBlock()', ()=>{
		const lastBlock = Block.genesis();
		const data = 'mined data';
		const minedBlock = Block.mineBlock({lastBlock, data});

		it('return a block instance', ()=>{
			expect(minedBlock instanceof Block).toBe(true);
		});

		it('sets lastHash to be ta hash of lastBlock', ()=>{
			expect(minedBlock.lastHash).toEqual(lastBlock.hash);
		});

		it('set the data', ()=>{
			expect(minedBlock.data).toEqual(data);
		});

		it('set a timestamp', ()=>{
			expect(minedBlock.timestamp).not.toEqual(undefined);
		});

		it('create a SHA-256 has based on proper input', ()=>{
			expect(minedBlock.hash)
				.toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
		});

	});

});