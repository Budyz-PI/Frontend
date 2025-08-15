import React, { useState } from "react";

function NFTPurchaseForm() {
  const [evmAddress, setEvmAddress] = useState("");
  const [status, setStatus] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState("");

  const NFT_PRICE = 4; // 4 PI per NFT

  // EVM address must start with 0x and be 42 characters long
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

    setIsPurchasing(true);
    setStatus("Processing your NFT purchase…");

    try {
      // Simulate network call (replace with real Pi Network logic as needed)
      await new Promise((resolve) => setTimeout(resolve, 1800));
      // Simulate random failure (uncomment for testing)
      // if (Math.random() < 0.2) throw new Error("Simulated network or payment error.");

      setStatus("NFT purchase successful! Check your wallet soon.");
    } catch (err) {
      setError("Something went wrong during the purchase. Please try again.");
    } finally {
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
        Note: This portal is currently in sandbox mode for Pi Network testing. Mainnet support will be announced soon.
      </div>
    </div>
  );
}

export default NFTPurchaseForm;