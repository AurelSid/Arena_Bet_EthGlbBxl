import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TournamentList from '../api';

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openApp, setOpenApp] = useState(false);

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have MetaMask installed!');
      setErrorMessage('Make sure you have MetaMask installed!');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setWalletAddress(account);
    } else {
      console.log('No authorized account found');
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have MetaMask installed!');
      setErrorMessage('Make sure you have MetaMask installed!');
      return;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Found an account! Address:', accounts[0]);
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.message);
    }
  };

  const logoutHandler = () => {
    setWalletAddress(null);
    setErrorMessage(null);
    setOpenApp(false); // Reset openApp state on logout
  };

  return (
    <div className='justify-center text-center items-center m-auto flex flex-col'>
      {walletAddress ? (
        <div>
          <p className='text-sky-400 fixed text-xs w-50% mx-32 left-0 right-0 top-2 bg-sky-900'>Connected with address: {walletAddress}</p>
          <button className='pb-2 text-sky-400 bg-sky-900 mx-32 rounded-b-xl fixed text-xs left-0 right-0 top-6' onClick={logoutHandler}>Log Out</button>
          {!openApp && (
            <button 
              className='shadow-lg shadow-black bg-gradient-to-r from-blue-500 to-pink-600 px-4 py-2 rounded-full w-full my-5' 
              onClick={() => setOpenApp(true)}
            >
              Open App
            </button>
          )}
        </div>
      ) : (
        <button className='bg-gradient-to-r from-blue-500 to-pink-600 px-4 py-2 rounded-full w-full my-5' onClick={connectWalletHandler}>
          Connect Wallet
        </button>
      )}
      {errorMessage && <p>{errorMessage}</p>}
      {openApp && <TournamentList />}
    </div>
  );
};

export default ConnectWallet;