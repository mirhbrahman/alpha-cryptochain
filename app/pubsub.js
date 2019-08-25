const PubNub = require('pubnub');

const credentials = {
	publishKey: 'pub-c-6d4893d6-9cf7-4cb0-9aa7-3f332ad1db92',
	subscribeKey: 'sub-c-29601ef8-c74d-11e9-8b24-569e8a5c3af3',
	secretKey: 'sec-c-MzAwZDVjNjEtN2ExNy00ZTM1LThiZDUtMTEzNmEzNjgyYjAw'
};

const CHANNELS = {
	TEST: 'TEST',
	BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
	constructor({blockchain}){
		this.blockchain = blockchain;
		this.pubnub = new PubNub(credentials);
		this.pubnub.subscribe({
			channels: Object.values(CHANNELS)
		});

		this.pubnub.addListener(this.listener());
	}

	listener() {
		return {
			message: messageObject => {
				const {channel, message} = messageObject;
				console.log(`Message received. Channel: ${channel}. Message: ${message}`);

				const parsedMessage = JSON.parse(message);

				switch(channel){
					case CHANNELS.BLOCKCHAIN:
						this.blockchain.replaceChain(parsedMessage);
				}

			}
		}
	}

	publish({channel, message}){
		// there is an unsubscribe function in pubnub
    // but it doesn't have a callback that fires after success
    // therefore, redundant publishes to the same local subscriber will be accepted as noisy no-ops
		this.pubnub.publish({channel, message})
			.then(result=>{})
			.catch(error=>console.log(error));
	}

	broadcastChain(){
		this.publish({
			channel: CHANNELS.BLOCKCHAIN,
			message: JSON.stringify(this.blockchain.chain)
		})
	}
}


module.exports = PubSub;