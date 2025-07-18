import React, { useState } from "react";

function CollectWalletsForm({ onSubmit }) {
  const [evmAddress, setEvmAddress] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ evmAddress });
      }}
    >
      <label>
        Polygon (MetaMask) Address:
        <input
          value={evmAddress}
          onChange={(e) => setEvmAddress(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Submit Address</button>
    </form>
  );
}

export default CollectWalletsForm;