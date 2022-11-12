import { useState } from 'react';
import { Route, Switch } from "wouter";
import Navbar from "./components/layout/Navbar";
import Landing from "./views/Landing";
import Marketplace from './views/Marketplace';
import Game from './components/three/Game';
import React from 'react';
import './App.css';
import Pixiland from './components/three/Pixiland'

function App() {
  const [ethaddress, setETHAddress] = useState("");
  const [ethProvider, setEthProvider] = useState(null);
  const [contractNFT, setContractNFT] = useState(null);

  return (
    <Switch>
      <Route path="/marketplace">
        <>
        <Navbar
          ethaddress={ethaddress}
          setETHAddress={setETHAddress}
          setEthProvider={setEthProvider}
          setContractNFT={setContractNFT} />
          <Marketplace ethaddress={ethaddress} contractNFT={contractNFT} />
        </>
      </Route>
      <Route path="/">
        <>
        <Navbar
          ethaddress={ethaddress}
          setETHAddress={setETHAddress}
          setEthProvider={setEthProvider} />
          <Landing />
        </>
      </Route>
      <Route path="/pixiland">
         <Pixiland />
      </Route>
      <Route path="/game">
        <Game />
      </Route>
    </Switch>
  ); 
  
}


export default App;
