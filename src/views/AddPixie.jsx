import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: "" });

export default function AddPixie({ ethaddress, contractNFT }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')
  const [url, seturl] = useState('');

  const getImage = event => {
    const file = event.target.files[0]
    console.log(file)
    setImage(file)
  }
  
  const addPixie = async () => {
    try{
      const cid = await client.put([image], {
        onRootCidReady: localCid => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `)
          console.log('> 📡 sending files to web3.storage ')
        },
        onStoredChunk: bytes => console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
      })

      console.log(`https://dweb.link/ipfs/${cid}`);
      seturl(`https://dweb.link/ipfs/${cid}`);
    }
    catch(err) {
      console.error(err);
    }
  }
  return (
    <div className="container">
      <div className="card card-body m-auto mt-4" style={{ maxWidth: "600px"}}>
        <h2>Add Pixie</h2>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input className="form-control" id="name" onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea className="form-control" id="description" rows="5" onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="formFileMultiple" className="form-label">
            Add Image
          </label>
          <input className="form-control" type="file" id="formFileMultiple" onChange={getImage} />
        </div>
        {!loading
          ? <button className="btn btn-danger mb-3"onClick={addPixie} >
            Submit
          </button>
          : <p>Loading...</p>
        }
        <p>{url}</p>
      </div>
    </div>
  )
}