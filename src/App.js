import React, { useState, useEffect } from "react";
import logo from "./Logo02.png";
import "./App.css";
import NFTPurchaseForm from "./NFTPurchaseForm"; // Import the form!

function App() {
  const [piUser, setPiUser] = useState(null);
  const [error, setError] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Pi Network login
  const handlePiLogin = () => {
    if (!window.Pi) {
      setError("Pi Network SDK not loaded. Please refresh the page.");
      return;
    }
    window.Pi.authenticate(
      ["username"],
      function (authResult) {
        setPiUser(authResult.user);
        setError(null);
      },
      function (error) {
        setError("Pi authentication failed: " + error);
      },
    );
  };

  // Fetch backend message after login
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
            {error && <p style={{ color: "salmon" }}>{error}</p>}
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
            {error && <p style={{ color: "salmon" }}>{error}</p>}

            {/* NFT Purchase Form goes here */}
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