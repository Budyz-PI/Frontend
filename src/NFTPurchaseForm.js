import React, { useState } from "react";

const NFT_PRICE_PI = 4;
const MAX_PER_TX = 10;

export default function NFTPurchaseForm() {
  const [recipientEvmAddress, setRecipientEvmAddress] = useState("");
  const [recipientSolAddress, setRecipientSolAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Basic validation
    if (!recipientEvmAddress || !recipientSolAddress) {
      setError("Both addresses are required.");
      return;
    }
    if (quantity < 1 || quantity > MAX_PER_TX) {
      setError(`Quantity must be between 1 and ${MAX_PER_TX}.`);
      return;
    }

    setLoading(true);

    try {
      // Replace with actual paymentId after Pi payment successful!
      // For now, we'll just use a placeholder
      const paymentId = window.prompt("Enter your Pi paymentId after payment:");

      if (!paymentId) {
        setError("PaymentId is required to proceed.");
        setLoading(false);
        return;
      }

      const res = await fetch("/verify-and-deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          recipientEvmAddress,
          recipientSolAddress,
          quantity,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: "2rem auto", padding: 24, border: "1px solid #eaeaea", borderRadius: 8 }}>
      <h2>Buy Budyz NFT</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Polygon (EVM) Address:
            <input
              type="text"
              value={recipientEvmAddress}
              onChange={(e) => setRecipientEvmAddress(e.target.value)}
              required
              style={{ width: "100%" }}
              placeholder="0x..."
              autoComplete="off"
            />
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>
            Solana Address:
            <input
              type="text"
              value={recipientSolAddress}
              onChange={(e) => setRecipientSolAddress(e.target.value)}
              required
              style={{ width: "100%" }}
              placeholder="Solana address"
              autoComplete="off"
            />
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              min={1}
              max={MAX_PER_TX}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: 80 }}
            />{" "}
            (Max {MAX_PER_TX})
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <b>Total:</b> {quantity * NFT_PRICE_PI} Pi
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 18,
            width: "100%",
            padding: "10px",
            background: "#4bb543",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: 18,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Buy NFT(s)"}
        </button>
        {error && (
          <div style={{ color: "red", marginTop: 10 }}>
            {error}
          </div>
        )}
        {result && (
          <div style={{ color: "green", marginTop: 10 }}>
            Success! <br />
            {result.message}
            <br />
            Tx Hash: {result.txHash}
            <br />
            Solana Address stored: {result.solanaAddressStored}
          </div>
        )}
      </form>
    </div>
  );
}