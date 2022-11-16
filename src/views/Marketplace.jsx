import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export default function Marketplace({ ethaddress, contractNFT }) {
  const [pixies, setPixies] = useState([
    "https://raw.githubusercontent.com/pixieland/pixieland-moralis/website/src/images/pixie1.png",
    "https://raw.githubusercontent.com/pixieland/pixieland-moralis/website/src/images/pixie2.png"
  ]);

  // useEffect(() => {
  //   const getNFTs = async () => {
  //     try{
       
  //       const nft = await fetch(`https://api.covalenthq.com/v1/80001/address/${ethaddress}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=`);
  //       const { data } = await nft.json();
  //       console.log(data)
  //       //setPixies(data);
  //     }
  //     catch(err) {
  //       console.error(err);
  //     }
  //   }
  //   if(contractNFT) getNFTs();
  // }, [contractNFT])
  
  const buyNFT = async (id) => {
    try{
      const transaction = await contractNFT.buyNFT(pixies[id], { value: ethers.utils.parseEther("0.00001"), gasLimit: 1e6});
      const tx = await transaction.wait();
      console.log(tx);
    }
    catch(err) {
      console.error(err);
    }
  }
  return (
    <div className="container">
      <h1>Marketplace</h1>
     
      <div className='row mt-3'>
        {pixies.map((p, i) => (
          <div className='col-3' key={i}>
            <div className="card">
              <img src={p} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">#{i + 1}</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <button className="btn btn-danger" onClick={() => buyNFT(i)}>
                  Buy for 1 MATIC
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      
    </div>
  )
}