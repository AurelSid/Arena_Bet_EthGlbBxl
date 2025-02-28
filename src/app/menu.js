'use client'

import menu from './menu.module.css';
import Link from 'next/link';
import ConnectWallet from './userData/connectWallet';

export default function Menu() {
    return (
      <div>
        <div className='fade-in' >

            <ConnectWallet/>
          </div>
        </div>
    );
  }