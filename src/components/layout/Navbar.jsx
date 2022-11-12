import React from 'react';
import { Link } from 'wouter';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import { CONTRACT_ADDRESS_PIXIENFT, PIXIENFT_ABI } from "../../contractdata/config";

export default function Navbar({ ethaddress, setETHAddress, setEthProvider, setContractNFT }) {
  const openMetaMask = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);  
    setEthProvider(provider);
    
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setETHAddress(address);

    const contractNFT = new ethers.Contract(CONTRACT_ADDRESS_PIXIENFT, PIXIENFT_ABI, signer);
    console.log(contractNFT)
    setContractNFT(contractNFT);
  }

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light" style={{ zIndex: 1}}>
      <div className="container">
        <a className="navbar-brand" href="/">PIXIELAND</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" href="/">HOME</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" href="/">BRIDGE</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" href="/marketplace">MARKETPLACE</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" href="/pixiland">GAME</Link>
            </li>
          </ul>
          <button className="btn btn-outline-danger" onClick={openMetaMask}>
            {ethaddress ? ethaddress.substring(0,8) + "..." + ethaddress.substring(34,42) : "Connect to MetaMask"}
          </button>
        </div>
      </div>
    </nav>
  )
}
