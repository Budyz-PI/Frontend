import CollectWalletsForm from "./components/CollectWalletsForm";

function App() {
  const handleSubmit = ({ evmAddress }) => {
    // You can send this address to your backend here
    console.log("EVM Address:", evmAddress);
  };

  return (
    <div>
      <h1>Enter Your Wallet Address</h1>
      <CollectWalletsForm onSubmit={handleSubmit} />
    </div>
  );
}

export default App;