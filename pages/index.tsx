import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import styles from "../styles/Home.module.css";
import { BigNumber, BytesLike, ethers } from "ethers";

const moonscanKey = "F86IKT3Z84MNJENUW4RJRMMZIP2CRKXIF2";
const vault = "0xc24D43093b44b7A9657571DDB79FEdf014eaef7d";
const decimals = 6;

const Home: NextPage = () => {
  const [deposits, setDeposits] = useState("");

  const { address } = useAccount();

  useEffect(() => {
    async function load() {
      const encodedAddress = ethers.utils.defaultAbiCoder.encode(["address"], [address]);
      const data = await fetch(`https://api-moonriver.moonscan.io/api?module=logs&action=getLogs
&fromBlock=0
&toBlock=latest
&address=${vault}
&topic0=0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c
&topic0_1_opr=and
&topic1=${encodedAddress}
&apikey=${moonscanKey}`);

      const rawDeposits = (await data.json()).result;
      let depositTally = BigNumber.from(0);
      rawDeposits.forEach((rawDeposit: any) => {
        const deposit: BigNumber = ethers.utils.defaultAbiCoder.decode(["uint"], rawDeposit.data)[0];
        depositTally = depositTally.add(deposit);
      });
      const totalDeposits = depositTally.toString();
      const totalDepositsFormatted =
        totalDeposits === "0"
          ? "0"
          : totalDeposits.substring(0, totalDeposits.length - decimals) + "." + totalDeposits.substring(0, totalDeposits.length - decimals - 2);
          
      setDeposits(totalDepositsFormatted);
    }
    load();
  }, [address]);

  return (
    <div className="container">
      <ConnectButton />
      <h1>Net Deposits: {deposits} USDC</h1>
    </div>
  );
};

export default Home;
