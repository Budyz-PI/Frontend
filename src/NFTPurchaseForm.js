import React, { useState } from "react";

function NFTPurchaseForm() {
  const [evmAddress, setEvmAddress] = useState("");
  const [status, setStatus] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState("");

  const NFT_PRICE = 4; // 4 PI per NFT

  // Validate EVM address (must start with 0x and be 42 chars)
  const isValidEvmAddress = (address) =>
    /^0x[a-fA-F0-9]{40}$/.test(address);

  const handleEvmChange = (e) => {
    setEvmAddress(e.target.value);
    setError(""); // Clear error when user types
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!isValidEvmAddress(evmAddress)) {
      setError("Please enter a valid EVM wallet address (starts with 0x, 42 characters).");
      return;
    }

    if (!window.Pi) {
      setError("Pi Network SDK not found. Please open this app in the Pi Browser.");
      return;
    }

    setIsPurchasing(true);
    setStatus("Initializing Pi payment…");

    try {
      window.Pi.createPayment(
        {
          amount: NFT_PRICE,
          memo: "PI Edition NFT Purchase",
          metadata: { evmAddress }
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            setStatus("Payment created. Awaiting server approval…");
            try {
              const res = await fetch("/api/pi/approve-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, evmAddress }),
              });
              if (!res.ok) {
                setError("Server failed to approve payment.");
                setIsPurchasing(false);
              }
            } catch (err) {
              setError("Could not contact backend for payment approval.");
              setIsPurchasing(false);
            }
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            setStatus("Payment completed! NFT will be sent to your wallet soon.");
            setIsPurchasing(false);
          },
          onCancel: (paymentId) => {
            setError("Payment was cancelled.");
            setIsPurchasing(false);
          },
          onError: (error, payment) => {
            setError("Payment failed: " + error);
            setIsPurchasing(false);
          }
        }
      );
    } catch (err) {
      setError("Something went wrong during the purchase. Please try again.");
      setIsPurchasing(false);
    }
  };

  return (
    <div className="content-card">
      <img
        src="/Logo02.png"
        alt="PI Edition Badge Portal"
        className="logo"
        draggable={false}
      />
      <h1>PI Edition NFT Purchase</h1>
      <div className="subtitle">
        Enter your EVM wallet address to purchase your exclusive PI NFT on testnet.
      </div>
      <div className="nft-price" style={{ margin: "1em 0", fontWeight: "bold", fontSize: "1.2em" }}>
        NFT Price: {NFT_PRICE} PI
      </div>
      <form onSubmit={handlePurchase} autoComplete="off">
        <input
          type="text"
          placeholder="EVM (ETH) Wallet Address"
          value={evmAddress}
          onChange={handleEvmChange}
          required
          style={{
            width: "90%",
            marginBottom: "1.2em",
            padding: "0.7em",
            borderRadius: "8px",
            border: error ? "2px solid #e24c4b" : "1px solid #555",
            fontSize: "1em",
            outline: error ? "none" : undefined,
            background: isPurchasing ? "#f6e9c7" : "white",
          }}
          disabled={isPurchasing}
          autoFocus
        />
        {error && (
          <div className="input-error" style={{ color: "#e24c4b", marginBottom: "1em", fontWeight: 500 }}>
            {error}
          </div>
        )}
        <br />
        <button
          className="pi-button"
          type="submit"
          disabled={!isValidEvmAddress(evmAddress) || isPurchasing}
        >
          {isPurchasing ? (
            <>
              <span className="spinner" /> Processing…
            </>
          ) : (
            "Purchase NFT"
          )}
        </button>
      </form>
      {status && <div className="status">{status}</div>}
      <div className="note">
        <strong>Note:</strong> This portal is currently in <span style={{ color: "#bfa14b" }}>sandbox mode</span> for Pi Network testing. Mainnet support will be announced soon.
      </div>
    </div>
  );
}

export default NFTPurchaseForm;