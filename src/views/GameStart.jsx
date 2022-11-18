import React, { useEffect, useState } from 'react'
import { Link } from 'wouter';
import { ethers } from 'ethers'

export default function Marketplace({ ethaddress, contractNFT }) {
  const [pixies, setPixies] = useState([
    "https://raw.githubusercontent.com/pixieland/pixieland-moralis/website/src/images/pixie1.png",
    "https://raw.githubusercontent.com/pixieland/pixieland-moralis/website/src/images/pixie2.png"
  ]);
  
  useEffect(() => {
    const getNFTs = async () => {
      try{
        const name = await contractNFT.pixies_names(0);
        console.log(name);

        //setPixies(ps);
      }
      catch(err) {
        console.error(err);
      }
    }
    if(contractNFT) getNFTs();
  }, [contractNFT])

  return (
    <div className="container">
      <h1>Choose your Pixie</h1>
     
      <div className='row mt-3'>
        {pixies.map((p, i) => (
          <div className='col-3' key={i}>
            <div className="card">
              <img src={p} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">#{i + 1}</h5>
                <Link className="btn btn-danger btn-lg" aria-current="page" href="/pixiland">
                  Select Pixie
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      
    </div>
  )
}