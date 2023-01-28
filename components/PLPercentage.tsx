import { BigNumber } from "ethers";

interface Props {
  balance: string;
  netDeposits: string;
}
export default function PLPercentage({ balance, netDeposits }: Props) {
  if (balance === "???" || netDeposits === "???") {
    return <p>???</p>;
  }
  const change = ((parseFloat(balance) - parseFloat(netDeposits)) / parseFloat(netDeposits)) * 100;
  const roundedChange = change.toFixed(2);
  const sign = Math.sign(change) === -1 ? "" : "+";

  const styles = {
    color: sign === "+" ? "green" : "red",
  };
  return (
    <h1 style={styles}>
      {sign}
      {roundedChange}%
    </h1>
  );
}
