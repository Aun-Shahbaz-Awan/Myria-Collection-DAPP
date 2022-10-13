import { EnvTypes, MyriaClient } from "myria-core-sdk";
import Web3 from "web3";

async function initWeb3Instance() {
  console.log("Initializing a Web3 provider...");
  let windowBrowser;
  if (window && window.ethereum) {
    windowBrowser = new Web3(Web3.givenProvider);
    window.web3 = windowBrowser;
  } else {
    console.log("Couldn't set a Web3 provider");
    return;
  }
  return windowBrowser;
}

export async function getMyriaClient() {
  const web3Instance = await initWeb3Instance();
  const networkId = await web3Instance.eth.net.getId();

  console.log("Initializing a Myria client...");
  const client = {
    provider: web3Instance.eth.currentProvider,
    networkId: networkId,
    web3: web3Instance,
    env: EnvTypes.STAGING,
  };

  const myriaClient = new MyriaClient(client);
  return myriaClient;
}
