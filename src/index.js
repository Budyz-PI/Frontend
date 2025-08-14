import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Pi SDK mock: must come AFTER imports
if (process.env.NODE_ENV === "development" && !window.Pi) {
  window.Pi = {
    authenticate: (callback) => {
      setTimeout(() => {
        callback({ user: "devUser" });
      }, 500);
    },
    createPayment: (config, callbacks) => {
      setTimeout(() => {
        if (callbacks.onReadyForServerApproval) {
          callbacks.onReadyForServerApproval({ paymentId: "mockPaymentId" });
        }
        if (callbacks.onReadyForServerCompletion) {
          callbacks.onReadyForServerCompletion({ txid: "mockTxId" });
        }
      }, 1000);
    }
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);