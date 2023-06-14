import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import "./App.css";
// import RPC from "./evm.web3";
import RPC from './evm.ethers';

const clientId =  "BK6Xwpoa40meGWjvW4wqf_yO-WA_x1ZkJScFA0meRBXdqUb2UycOw5h3FO-YzwjqBEHhZ_n78VsMZ8OY3RUn_zY"; // get from https://dashboard.web3auth.io

const ethChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x5", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth_goerli",
  displayName: "Goerli Testnet",
  blockExplorer: "https://goerli.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const verifier =            "product-auth0-aggregated-email-uid";
const sub_verifier_google = "auth0-google";
const sub_verifier_email =  "auth0-email";
const auth0_clientId =      "8dS9rIx7gz8imcXZ6LsbOpfKe4teBPaH";
const auth0_domain =        "https://dev-hy10skdc.eu.auth0.com";

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthNoModal({
          clientId, // get from https://dashboard.web3auth.io
          chainConfig: ethChainConfig,
          web3AuthNetwork: "cyan",
          useCoreKitKey: false,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            uxMode: "redirect",
            loginConfig: {
              auth0google: {
                verifier: verifier,
                verifierSubIdentifier: sub_verifier_google,
                typeOfLogin: "jwt",
                clientId: auth0_clientId,
              },
              auth0email: {
                verifier: verifier,
                verifierSubIdentifier: sub_verifier_email,
                typeOfLogin: "jwt",
                clientId: auth0_clientId,
              },
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const loginAuth0Google = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "auth0google",
        extraLoginOptions: {
          domain: auth0_domain,
          // this corresponds to the field inside jwt which must be used to uniquely
          // identify the user. This is mapped b/w google and email logins
          verifierIdField: "email",
          isVerifierIdCaseSensitive: false,
          //connection: "google",
        },
      }
    );
    setProvider(web3authProvider);
  };

  const loginAuth0Email = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "auth0email",
        extraLoginOptions: {
          domain: auth0_domain,
          // this corresponds to the field inside jwt which must be used to uniquely
          // identify the user. This is mapped b/w google and email logins
          verifierIdField: "email",
          isVerifierIdCaseSensitive: false,
          //connection: "email",
        },
      }
    );
    setProvider(web3authProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getPrivateKey = async () => {
    /*
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
    */
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    /*
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.sendTransaction();
    uiConsole(result);
    */
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loginView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Private Key
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const logoutView = (
    <>
      <button onClick={loginAuth0Google} className="card">
        Login using <b>Google</b> [ via Auth0 ]
      </button>
      <button onClick={loginAuth0Email} className="card">
        Login using <b>email</b> [ via Auth0 ]
      </button>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>{" "}
        Aggregate Verifier Example in React
      </h1>
      <h3 className="sub-title">
        Aggregate Verifier - Google & Email with Auth0
      </h3>

      <h6 className="center">
        Logging in with any of the below login methods will return the same
        wallet address. Provided, you have the same email address for all the
        logins.
      </h6>

      <div className="grid">{provider ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/web3auth/examples/web-no-modal-sdk/custom-authentication/aggregate-verifiers/auth0-google-aggregate-react-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
