import React, { useState } from "react";

function NFTPurchaseForm() {
  const [evmAddress, setEvmAddress] = useState("");
  const [status, setStatus] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const NFT_PRICE = 4; // 4 PI per NFT

  const handleEvmChange = (e) => setEvmAddress(e.target.value);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsPurchasing(true);
    setStatus("Processing your NFT purchase…");

    // Simulate network call (replace with real Pi Network logic as needed)
    setTimeout(() => {
      setStatus("NFT purchase successful! Check your wallet soon.");
      setIsPurchasing(false);
    }, 1800);
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
      <div className="nft-price" style={{margin: "1em 0", fontWeight: "bold", fontSize: "1.2em"}}>
        NFT Price: {NFT_PRICE} PI
      </div>
      <form onSubmit={handlePurchase}>
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
            border: "1px solid #555",
            fontSize: "1em",
          }}
          disabled={isPurchasing}
        />
        <br />
        <button
          className="pi-button"
          type="submit"
          disabled={!evmAddress || isPurchasing}
        >
          {isPurchasing ? "Processing…" : "Purchase NFT"}
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