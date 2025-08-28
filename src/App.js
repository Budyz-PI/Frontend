import { useState, useEffect, useMemo } from "react";
import "./App.css";

const nft = {
  name: "PI Edition Badge",
  ownerShort: "0x51a8...4865",
  ownerLink: "https://opensea.io/0x51a83F6c75C4309433ba6DA2B1c075aE26254865",
  price: 4
};

function App() {
  const [stage, setStage] = useState(1);
  const [evmAddress, setEvmAddress] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  // Only initialize Pi SDK for stage 2
  const sandbox = useMemo(() => {
    const raw = process.env.REACT_APP_PI_SANDBOX;
    return raw ? raw.toLowerCase() === "true" : true;
  }, []);

  useEffect(() => {
    if (stage === 2 && window.Pi) {
      try {
        window.Pi.init({ version: "2.0", sandbox });
      } catch {
        setStatus("Pi SDK init error.");
      }
    }
  }, [stage, sandbox]);

  const isValidEvmAddress = (address) =>
    /^0x[a-fA-F0-9]{40}$/.test(address);

  // Stage 1: check NFT and enter address
  const handleContinue = () => {
    setStatus("");
    if (!isValidEvmAddress(evmAddress)) {
      setStatus("Please enter a valid EVM address.");
      return;
    }
    setStage(2);
  };

  // Stage 2: login & purchase
  const handleLoginAndPurchase = async () => {
    setStatus("");
    setBusy(true);
    if (!window.Pi) {
      setStatus("Pi SDK not available. Use Pi Browser.");
      setBusy(false);
      return;
    }
    try {
      setStatus("Authenticating with Pi Network...");
      const authResult = await window.Pi.authenticate(
        ["username", "payments"],
        () => setStatus("Incomplete payment found — you can try again.")
      );
      if (!authResult || !authResult.accessToken) {
        setStatus("Authentication failed.");
        setBusy(false);
        return;
      }
      setStatus("Authenticated! Initializing payment...");
      window.Pi.createPayment(
        {
          amount: nft.price,
          memo: `Purchase of ${nft.name}`,
          metadata: { evmAddress }
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            setStatus("Payment created. Awaiting server approval...");
            try {
              const res = await fetch("/api/pi/approve-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, evmAddress }),
              });
              if (!res.ok) {
                setStatus("Server failed to approve payment.");
                setBusy(false);
              }
            } catch {
              setStatus("Could not contact backend.");
              setBusy(false);
            }
          },
          onReadyForServerCompletion: () => {
            setStatus("Payment completed! NFT will be sent to your wallet soon.");
            setBusy(false);
          },
          onCancel: () => {
            setStatus("Payment cancelled.");
            setBusy(false);
          },
          onError: (error) => {
            setStatus("Payment failed: " + error);
            setBusy(false);
          }
        }
      );
    } catch (err) {
      setStatus("Auth error: " + err.message);
      setBusy(false);
    }
  };

  return (
    <div className="App" style={{ minHeight: "100vh", background: "#f6e9c7" }}>
      <div className="content-card" style={{ marginTop: "5vh" }}>
        {/* LOGO */}
        <img
          src="/Logo02.png"
          alt="PI Edition Badge Portal"
          className="logo"
          style={{
            maxWidth: "200px",
            borderRadius: "16px",
            marginBottom: "1em",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        />
        {/* WELCOME TEXT */}
        <h2
          style={{
            color: "#533771",
            fontWeight: 700,
            fontSize: "2em",
            textAlign: "center",
            margin: "0 0 1.2em 0",
            letterSpacing: "2px",
            textShadow: "0 2px 16px #bfa14b"
          }}
        >
          Welcome
        </h2>
        {stage === 1 && (
          <>
            {/* NFT Info */}
            <div style={{
              background: "#533771",
              borderRadius: "12px",
              padding: "0.6em 1.1em",
              maxWidth: "320px",
              margin: "0 auto 1.2em auto",
              textAlign: "center",
              boxShadow: "0 0 12px #533771"
            }}>
              <h3 style={{ color: "#e5c81a", fontSize: "1.4em", marginBottom: "0.1em", fontWeight: 700 }}>
                {nft.name}
              </h3>
              <p style={{ color: "#e5c81a" }}>
                Owner: <a href={nft.ownerLink} target="_blank" rel="noopener noreferrer" style={{ color: "#e5c81a", textDecoration: "underline", fontWeight: "bold" }}>{nft.ownerShort}</a>
              </p>
              {/* Price REMOVED from here */}
            </div>
            {/* EVM input and confirmation */}
            <div style={{ margin: "1em auto", maxWidth: 340, textAlign: "center" }}>
              <input
                type="text"
                placeholder="Your EVM Wallet Address"
                value={evmAddress}
                onChange={e => setEvmAddress(e.target.value)}
                style={{
                  width: "90%",
                  marginBottom: "1em",
                  padding: "0.7em",
                  borderRadius: "8px",
                  border: "1px solid #533771",
                  fontSize: "1em"
                }}
                autoFocus
                disabled={busy}
              />
              {/* Confirmation only if address looks valid */}
              {isValidEvmAddress(evmAddress) && (
                <div style={{ fontSize: "0.97em", color: "#533771", marginBottom: 8 }}>
                  <b>Confirm NFT:</b> {nft.name}<br />
                  <b>Your Wallet:</b> {evmAddress}
                </div>
              )}
              <button
                onClick={handleContinue}
                style={{
                  padding: "0.7em 2em",
                  fontSize: "1.1em",
                  background: "#533771",
                  color: "#e5c81a",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #0004",
                  fontWeight: "bold"
                }}
                disabled={busy}
              >
                Continue
              </button>
            </div>
            {status && <div style={{ color: "#bfa14b", textAlign: "center" }}>{status}</div>}
          </>
        )}
        {stage === 2 && (
          <div style={{ margin: "2em auto", maxWidth: 340, textAlign: "center" }}>
            {/* Price added here */}
            <div style={{
              background: "#533771",
              color: "#e5c81a",
              borderRadius: "10px",
              padding: "0.8em",
              marginBottom: "1.5em",
              fontWeight: "bold",
              fontSize: "1.12em",
              boxShadow: "0 0 8px #533771"
            }}>
              Price: {nft.price} PI
            </div>
            <button
              onClick={handleLoginAndPurchase}
              style={{
                padding: "0.7em 2em",
                fontSize: "1.1em",
                background: "#533771",
                color: "#e5c81a",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                boxShadow: "0 2px 8px #0004",
                fontWeight: "bold"
              }}
              disabled={busy}
            >
              {busy ? "Processing..." : "Login & Purchase with Pi Network"}
            </button>
            {status && <div style={{ color: "#bfa14b", textAlign: "center", marginTop: 16 }}>{status}</div>}
          </div>
        )}
        <p className="note" style={{ color: "#8d7b5a", marginTop: "2em", textAlign: "center" }}>
          <strong>Note:</strong> This app only works inside the Pi Browser with the Pi SDK loaded.
        </p>
      </div>
    </div>
  );
}

export default App;