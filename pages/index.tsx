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
    </div>
  );
};

export default Home;
