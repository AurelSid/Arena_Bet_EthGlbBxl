import { MetaMaskSDK } from "@metamask/sdk";

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Example JavaScript Dapp",
    url: window.location.href,
  },
  infuraAPIKey: d7bd1491201b44c385d4688f105f34f9,
  // Other options.
});

// You can also access via window.ethereum.
const ethereum = MMSDK.getProvider();

ethereum.request({ method: "eth_requestAccounts", params: [] });