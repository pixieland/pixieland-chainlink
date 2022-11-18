import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export default function Marketplace({ ethaddress, contractNFT }) {
  const [pixies, setPixies] = useState([]);

  useEffect(() => {
    const getNFTs = async () => {
      try{
       
        const ps = await contractNFT.getUrlList();
        console.log(ps);
        setPixies(ps);
      }
      catch(err) {
        console.error(err);
      }
    }
    if(contractNFT) getNFTs();
  }, [contractNFT])
  
  const buyNFT = async (imageurl) => {
    try{
      const transaction = await contractNFT.buyNFT(imageurl, { value: ethers.utils.parseEther("0.00001"), gasLimit: 1e6});
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
                <button className="btn btn-danger" onClick={() => buyNFT(p)}>
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