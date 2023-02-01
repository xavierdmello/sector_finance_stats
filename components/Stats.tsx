import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import styles from "../styles/Stats.module.css";
import { BigNumber, BytesLike, ethers } from "ethers";
import Vault from "../abi/Vault";
import PLPercentage from "./PLPercentage";

const moonscanKey = "F86IKT3Z84MNJENUW4RJRMMZIP2CRKXIF2";
const vault = "0xc24D43093b44b7A9657571DDB79FEdf014eaef7d";
const decimals = 6;
const depositTopic = "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c";
const withdrawTopic = "0x884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364";

function Stats({ address }: { address: `0x${string}` }): JSX.Element {
  const [netDeposits, setNetDeposits] = useState("???");
  const [pl, setPl] = useState("???");
  const [balance, setBalance] = useState("???");

  let {
    data: rawBalance,
    isError,
    isLoading,
  } = useContractRead({
    address: vault,
    abi: Vault,
    functionName: "balanceOfUnderlying",
    args: [address],
    cacheOnBlock: false,
    cacheTime: 0,
    staleTime: 0,
  });

  function bnFormat(bn: BigNumber) {
    const bnString = bn.toString();
    const bnFormatted =
      bnString === "0"
        ? "0"
        : bnString.substring(0, bnString.length - decimals) + "." + bnString.substring(bnString.length - decimals, bnString.length - decimals + 2);
    return bnFormatted;
  }

  useEffect(() => {
    async function load() {
      if (!rawBalance) {
        rawBalance = BigNumber.from(0);
      }

      const encodedAddress = ethers.utils.defaultAbiCoder.encode(["address"], [address]);

      // Fetch events
      const depositDataPromise = fetch(`https://api-moonriver.moonscan.io/api?module=logs&action=getLogs
&fromBlock=0
&toBlock=latest
&address=${vault}
&topic0=${depositTopic}
&topic0_1_opr=and
&topic1=${encodedAddress}
&apikey=${moonscanKey}`);
      const withdrawDataPromise = fetch(`https://api-moonriver.moonscan.io/api?module=logs&action=getLogs
&fromBlock=0
&toBlock=latest
&address=${vault}
&topic0=${withdrawTopic}
&topic0_1_opr=and
&topic1=${encodedAddress}
&apikey=${moonscanKey}`);

      // Parse events
      const [depositData, withdrawData] = await Promise.all([depositDataPromise, withdrawDataPromise]);
      let [rawDeposits, rawWithdrawals] = await Promise.all([depositData.json(), withdrawData.json()]);
      rawDeposits = rawDeposits.result;
      rawWithdrawals = rawWithdrawals.result;

      // Tally deposits, withdrawals, and P/L
      let depositTally = BigNumber.from(0);
      let withdrawalTally = BigNumber.from(0);
      let plCount = BigNumber.from(0);
      rawDeposits.forEach((rawDeposit: any) => {
        const deposit: BigNumber = ethers.utils.defaultAbiCoder.decode(["uint"], rawDeposit.data)[0];
        depositTally = depositTally.add(deposit);
      });
      rawWithdrawals.forEach((rawWithdrawal: any) => {
        const withdrawal: BigNumber = ethers.utils.defaultAbiCoder.decode(["uint"], rawWithdrawal.data)[0];
        withdrawalTally = withdrawalTally.add(withdrawal);
      });
      const netDepositsCount = depositTally.sub(withdrawalTally);

      if (balance) {
        plCount = rawBalance.sub(netDepositsCount);
      }

      setNetDeposits(bnFormat(netDepositsCount));
      setPl(bnFormat(plCount));
      setBalance(bnFormat(rawBalance));
    }
    if (address !== "0x0000000000000000000000000000000000000000" && rawBalance) {
      load();
    } else {
      setNetDeposits("???");
      setPl("???");
      setBalance("???");
    }
  }, [address]);

  return (
    <div className={styles.container}>
      <h1>Current Balance: {balance} USDC</h1>
      <div className={styles.row}>
        <h1>Net Deposits: {netDeposits} USDC</h1>
        <p className={styles.formula}>(Total Deposits - Total Withdrawals)</p>
      </div>

      <div className={styles.row}>
        <h1 className={styles.pl}>P/L: {pl} USDC</h1>
        <PLPercentage balance={balance} netDeposits={netDeposits} />
      </div>
    </div>
  );
}

export default Stats;
