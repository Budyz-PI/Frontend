import { useEffect, useMemo, useState } from "react";
import "./App.css";
import NFTPurchaseForm from "./NFTPurchaseForm";

// NFT info — update for each new NFT!
const nft = {
  name: "PI Edition Badge",
  ownerShort: "0x51a8...4865",
  ownerLink: "https://opensea.io/0x51a83F6c75C4309433ba6DA2B1c075aE26254865"
};

function App() {
  const [piReady, setPiReady] = useState(false);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const sandbox = useMemo(() => {
    const raw = process.env.REACT_APP_PI_SANDBOX;
    return raw ? raw.toLowerCase() === "true" : true;
  }, []);

  useEffect(() => {
    if (!window.Pi) {
      setStatus("Pi SDK not detected. Please open in Pi Browser.");
      setPiReady(false);
      console.log("Pi SDK not detected (window.Pi is undefined)");
      return;
    }
    try {
      window.Pi.init({ version: "2.0", sandbox });
      setPiReady(true);
      console.log("Pi SDK initialized, sandbox:", sandbox);
    } catch (e) {
      setStatus(`Pi SDK init error: ${e.message}`);
      setPiReady(false);
      console.log("Pi SDK init error:", e);
    }
  }, [sandbox]);

  const handlePiLogin = async () => {
    if (!window.Pi) {
      setStatus("Pi SDK not available. Use Pi Browser.");
      console.log("Pi SDK not available at login.");
      return;
    }
    setBusy(true);
    setStatus("Authenticating…");
    try {
      console.log("Starting Pi.authenticate");
      const authResult = await window.Pi.authenticate(
        ["username", "payments"],
        (payment) => {
          setStatus("Incomplete payment found — you can try again.");
          console.log("Incomplete payment callback fired");
        }
      );
      console.log("Got authResult:", authResult);
      if (!authResult || !authResult.accessToken) {
        setStatus("Authentication failed: No access token returned.");
        console.log("Authentication failed: No access token in authResult.");
        setBusy(false);
        return;
      }
      // Send JWT to backend for verification
      const jwt = authResult.accessToken;
      console.log("Sending JWT to backend");
      const backendResponse = await fetch("https://budyz-pi-backend.onrender.com/api/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jwt })
      });
      console.log("Got backend response:", backendResponse);
      const data = await backendResponse.json();
      console.log("Backend response JSON:", data);
      if (data.success) {
        setUser(data.user);
        setStatus("Login successful! Backend verified.");
        console.log("Login successful!");
      } else {
        setStatus("Backend verification failed: " + (data.error || "Unknown error"));
        console.log("Backend verification failed:", data.error);
      }
    } catch (error) {
      setStatus(`Auth error: ${error.message}`);
      console.log("Auth error:", error);
    }
    setBusy(false);
  };

  // Helper: is login successful?
  const isLoginSuccess = status.startsWith("Login successful!");

  return (
    <div className="App dark-bg" style={{ minHeight: "100vh", background: "#f6e9c7" }}>
      <div className="content-card" style={{ marginTop: "5vh" }}>
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
        <h2
          style={{
            marginBottom: "1.2em",
            color: "#533771",
            fontWeight: 700,
            fontSize: "2.4em",
            letterSpacing: "2px",
            textAlign: "center",
            textShadow: "0 2px 16px #bfa14b"
          }}
        >
          Welcome
        </h2>
        <div
          className="nft-info"
          style={{
            background: "#533771",
            borderRadius: "12px",
            padding: "0.6em 1.1em",
            maxWidth: "320px",
            margin: "0 auto 1.2em auto",
            textAlign: "center",
            boxShadow: "0 0 12px #533771"
          }}
        >
          <h3 style={{
            color: "#e5c81a",
            fontSize: "1.4em",
            marginBottom: "0.1em",
            fontWeight: 700,
            textShadow: "0 2px 8px #533771"
          }}>
            {nft.name}
          </h3>
          <p style={{ color: "#e5c81a", fontSize: "1em", margin: "0.4em 0 0 0" }}>
            Owner:{" "}
            <a
              href={nft.ownerLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#e5c81a",
                fontSize: "1em",
                textDecoration: "underline",
                fontWeight: "bold",
                wordBreak: "break-all",
                textShadow: "0 2px 8px #533771"
              }}
            >
              {nft.ownerShort}
            </a>
          </p>
        </div>
        {!user ? (
          <button
            onClick={handlePiLogin}
            className="pi-button blue"
            disabled={!piReady || busy}
            style={{
              padding: "0.8em 2em",
              fontSize: "1.1em",
              background: "#533771",
              color: "#e5c81a",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 2px 8px #0004",
              fontWeight: "bold"
            }}
          >
            {busy ? "Authenticating…" : "Login with Pi Network"}
          </button>
        ) : (
          <>
            <p
              style={{
                color: "#533771",
                fontWeight: "bold",
                fontSize: "1.1em",
                textAlign: "center",
                marginBottom: "0.5em",
              }}
            >
              Welcome, {user.username}!
            </p>
            <NFTPurchaseForm />
          </>
        )}
        {status && (
          <p
            className="status"
            style={{
              color: isLoginSuccess ? "#533771" : "#bfa14b",
              marginTop: "1em",
              fontWeight: isLoginSuccess ? "bold" : "normal",
              textAlign: "center"
            }}
          >
            {status}
          </p>
        )}
        <p className="note" style={{ color: "#8d7b5a", marginTop: "2em" }}>
          <strong>Note:</strong> This app only works inside the Pi Browser with the Pi SDK loaded.
        </p>
      </div>
    </div>
  );
}

export default App;