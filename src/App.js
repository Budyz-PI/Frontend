import React, { useState, useEffect } from "react";
import logo from "./Logo02.png";
import "./App.css";
import NFTPurchaseForm from "./NFTPurchaseForm";

function App() {
  const [piUser, setPiUser] = useState(null);
  const [error, setError] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  // Dynamically load Pi SDK
  useEffect(() => {
    const loadPiSdk = () => {
      const script = document.createElement("script");
      script.src = "https://sdk.minepi.com/pi-sdk.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ Pi SDK dynamically loaded");
        if (window.Pi) {
          setSdkReady(true);
          console.log("✅ Pi SDK initialized:", window.Pi);
        } else {
          console.warn("❌ Pi SDK script loaded, but window.Pi is still undefined");
        }
      };
      script.onerror = () => {
        console.error("❌ Failed to load Pi SDK");
        setError("Failed to load Pi SDK");
      };
      document.body.appendChild(script);
    };

    loadPiSdk();
  }, []);

  const handlePiLogin = () => {
    console.log("🧪 Attempting Pi login...");
    if (!window.Pi) {
      console.error("❌ Pi Network SDK not loaded.");
      setError("Pi Network SDK not loaded. Try opening in Pi Browser or refresh the page.");
      return;
    }

    window.Pi.authenticate(
      ["username"],
      function (authResult) {
        console.log("✅ Auth success:", authResult);
        setPiUser(authResult.user);
        setError(null);

        fetch("/api/verify-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jwt: authResult.accessToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              console.error("❌ Backend verification failed.");
              setError("Backend verification failed.");
            }
          })
          .catch((err) => {
            console.error("❌ Backend error:", err);
            setError("Backend verification error: " + err.message);
          });
      },
      function (error) {
        console.error("❌ Pi authentication failed:", error);
        setError("Pi authentication failed: " + error);
      }
    );
  };

  useEffect(() => {
    if (piUser) {
      setLoading(true);
      fetch("/api/hello")
        .then((res) => res.json())
        .then((data) => setBackendMessage(data.message))
        .catch((err) => setError("Backend error: " + err.message))
        .finally(() => setLoading(false));
    }
  }, [piUser]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="BUDYZ logo" />
        {!piUser ? (
          <>
            <h1>Welcome to BUDYZ NFT Portal!</h1>
            <p>NFTs with seamless Pi Network integration.</p>
            <button
              onClick={handlePiLogin}
              disabled={!sdkReady}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                marginTop: "1em",
                opacity: sdkReady ? 1 : 0.5,
              }}
            >
              {sdkReady ? "Login with Pi Network" : "Waiting for Pi SDK..."}
            </button>
            {error && <p style={{ color: "salmon", marginTop: "1em" }}>{error}</p>}
          </>
        ) : (
          <>
            <p>
              Hello, <b>{piUser.username}</b>!<br />
              You are now logged in with Pi Network.
            </p>
            {loading ? (
              <p style={{ color: "#61dafb" }}>Loading your personalized greeting...</p>
            ) : (
              backendMessage && (
                <p>
                  Backend says: <b>{backendMessage}</b>
                </p>
              )
            )}
            {error && <p style={{ color: "salmon", marginTop: "1em" }}>{error}</p>}

            <div style={{ marginTop: "2rem" }}>
              <NFTPurchaseForm />
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
