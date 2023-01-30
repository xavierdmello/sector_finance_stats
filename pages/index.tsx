import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Stats from "../components/Stats";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const [inputBoxAddress, setInputBoxAddress] = useState("");
  const [selectionMethod, setSelectionMethod] = useState("button");
  const [validAddress, setValidAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<`0x${string}`>(ethers.constants.AddressZero);
  const { address: buttonAddress } = useAccount();

  useEffect(() => {
    const localInputBoxAddress = localStorage.getItem("inputBoxAddress");
    if (localInputBoxAddress) {
      setInputBoxAddress(localInputBoxAddress);
    }
  }, []);

  useEffect(() => {
    let selectedAddressTemp: `0x${string}` = ethers.constants.AddressZero;
    let validAddressTemp = ethers.utils.isAddress(inputBoxAddress);
    if (selectionMethod === "button" && buttonAddress) {
      selectedAddressTemp = buttonAddress;
    } else if (selectionMethod === "input") {
      if (validAddressTemp) {
        selectedAddressTemp = inputBoxAddress as `0x${string}`;
        localStorage.setItem("inputBoxAddress", selectedAddressTemp);
      }
    }
    setValidAddress(validAddressTemp);
    setSelectedAddress(selectedAddressTemp);
  }, [inputBoxAddress, buttonAddress, selectionMethod]);

  return (
    <div className={styles.container}>
      <a href="https://scion.finance/" target="_blank" rel="noopener noreferrer">https://scion.finance/</a>
      <h1 className={styles.title}>Sector Finance Stats</h1>
      <div className={styles.row}>
        <p className={styles.selectMethodHeader}>Method of choosing account:</p>
        <select value={selectionMethod} onChange={(event) => setSelectionMethod(event.target.value)} name="selectionOptions">
          <option value="button">Connect Button</option>
          <option value="input">Paste Address</option>
        </select>
      </div>
      <div className={styles.row} id={styles.inputRow}>
        {selectionMethod === "button" && <ConnectButton />}
        {selectionMethod === "input" && <input type="text" className={styles.addressInputBox} onChange={(event) => setInputBoxAddress(event.target.value)} value={inputBoxAddress}></input>}
        {selectionMethod === "input" && !validAddress && inputBoxAddress && <p className={styles.error}>Error: Invalid Address</p>}
      </div>
      <Stats address={selectedAddress} />

      <center>
        <p className={styles.disclaimer}>
          Note: If the stats are still showing ??? after connecting your wallet, you are getting rate-limited by Moonscan. Try refreshing the page.{" "}
        </p>
        <a href="https://github.com/xavierdmello/sector_finance_stats" target="_blank" rel="noopener noreferrer">Github</a>
        <p>
          Data provided by <a href="https://moonriver.moonscan.io/" target="_blank" rel="noopener noreferrer">Moonriver Moonscan</a>
        </p>
        <p>
          Have feedback? Send me a message <a href="https://twitter.com/nova_holo" target="_blank" rel="noopener noreferrer">@nova_holo</a>
        </p>
        <p>&copy; 2023 Xavier D'Mello</p>
      </center>
    </div>
  );
};

export default Home;
