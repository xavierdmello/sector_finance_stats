import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Stats from "../components/Stats";
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <a href="https://scion.finance/">https://scion.finance/</a>
      <h1>Sector Finance Stats</h1>
      <ConnectButton />
      <Stats />

      <center>
        <p className={styles.disclaimer}>
          Note: If the stats are still showing ??? after connecting your wallet, you are getting rate-limited by Moonscan. Try refreshing the page.{" "}
        </p>
        <a href="https://github.com/xavierdmello/sector_finance_stats">Github</a>
        <p>
          Data provided by <a href="https://moonriver.moonscan.io/">Moonriver Moonscan</a>
        </p>
        <p>
          Have feedback? Send me a message <a href="https://twitter.com/nova_holo">@nova_holo</a>
        </p>
        <p>&copy; 2023 Xavier D'Mello</p>
      </center>
    </div>
  );
};

export default Home;
