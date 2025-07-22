import React, { useState, useEffect } from "react";
import logo from "./Logo02.png";
import "./App.css";
import NFTPurchaseForm from "./NFTPurchaseForm";

function App() {
  const [piUser, setPiUser] = useState(null);
  const [error, setError] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePiLogin = () => {
    alert("✅ Login button clicked!");
    console.log("✅ Login button clicked!");

    if (!window.Pi) {
      alert("❌ Pi Network SDK not loaded. Please refresh the page.");
      console.error("❌ Pi Network SDK not loaded.");
      setError("Pi Network SDK not loaded. Please refresh the page.");
      return;
    }

    alert("✅ Pi SDK found. Starting authentication...");
    console.log("✅ Pi SDK found. Starting authentication...");

    window.Pi.authenticate(
      ["username"],
      function (authResult) {
        alert("✅ Authentication succeeded: " + JSON.stringify(authResult));
        console.log("✅ Authentication succeeded:", authResult);

        setPiUser(authResult.user);
        setError(null);

        fetch("/api/verify-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jwt: authResult.accessToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              console.log("✅ User verified on backend:", data.user);
            } else {
              setError("Backend verification failed.");
              console.error("❌ Backend verification failed.");
            }
          })
          .catch((err) => {
            setError("Backend verification error: " + err.message);
            console.error("❌ Backend verification error:", err);
          });
      },
      function (error) {
        alert("❌ Pi authentication failed: " + error);
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
              style={{ padding: "10px 20px", fontSize: "1rem", marginTop: "1em" }}
            >
              Login with Pi Network
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
