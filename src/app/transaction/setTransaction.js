// web3Utils.js
import Web3 from 'web3';
import abi from '../abis/contractAbi.json';
import axios from 'axios';

export async function sendTx(matchId, team) {
	//arbitrum sepolia 0xf56e5c36ffe1770abe1b4ad5c69a205b0ad1f82a
	const contractAddress = '0xfBcf66Dc9D36814E011d06fc569d8B154E7C5a83';

  const web3 = new Web3(window.ethereum);

  // Get the connected user's Ethereum address
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  const userAddress = accounts[0];

  const contract = new web3.eth.Contract(abi, contractAddress);

  const result = await contract.methods.setBet(matchId, team).send({
    from: userAddress,
    value: web3.utils.toWei('0.0001', 'ether'),  // Send 0.0001 ether (1e14 wei)
  });

  console.log('Transaction successful:', result.transactionHash);

  const blockScoutUrl = 'https://eth-sepolia.blockscout.com/tx/';

  const hash = result.transactionHash;

  const transactionLink = `${blockScoutUrl}${hash}`;

  console.log('BlockScout transaction link:', transactionLink);

  const apiUrl = `https://eth-sepolia.blockscout.com/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}`;

  const response = await axios.get(apiUrl);

  console.log('BlockScout API response:', response.data);

  return transactionLink;
}
