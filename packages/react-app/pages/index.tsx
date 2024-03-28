import PrimaryButton from "@/components/Button";
import { useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http, parseEther, stringToHex } from "viem";
import { useAccount } from "wagmi";
import StableTokenABI from "../abis/cusd-abi.json";
import { celoAlfajores } from "viem/chains";


const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const [tx, setTx] = useState<any>(undefined);

  const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Testnet

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  const sendCUSD = async (to: string, amount: string) => {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    let [address] = await walletClient.getAddresses();

    const amountInWei = parseEther(amount);

    const tx = await walletClient.writeContract({
      address: cUSDTokenAddress,
      abi: StableTokenABI.abi,
      functionName: "transfer",
      account: address,
      args: [to, amountInWei],
    });

    let receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    return receipt;
  };

  const signTransaction = async () => {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    let [address] = await walletClient.getAddresses();

    const res = await walletClient.signMessage({
      account: address,
      message: stringToHex("Hello from Celo Composer MiniPay Template!"),
    });

    return res;
  };




  return (
    <div className="flex flex-col justify-center items-center">
      <div className="h1">
        There you go... a canvas for your next Celo project!
      </div>
      {isConnected && (
        <div className="h2 text-center">Your address: {userAddress}</div>
      )}

      {address && (
        <>

          {tx && (
            <p className="font-bold mt-4">
              Tx Completed:{" "}
              {(tx.transactionHash as string).substring(0, 6)}
              ...
              {(tx.transactionHash as string).substring(
                tx.transactionHash.length - 6,
                tx.transactionHash.length
              )}
            </p>
          )}
          <div className="w-full px-3 mt-7">
            <PrimaryButton

              onClick={()=>sendCUSD(address, "0.01")}
              title="Send 0.1 cUSD to your own address"
              widthFull
            />
          </div>

          <div className="w-full px-3 mt-6">
            <PrimaryButton

              onClick={signTransaction}
              title="Sign a Message"
              widthFull
            />
          </div>




        </>
      )}
    </div>
  );
}
