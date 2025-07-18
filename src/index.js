import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();