import React, { useState } from "react";
import "./styles.css";

const UpiLinkGenerator = () => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [resultLink, setResultLink] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // UPI ID format validation
    const upiIdRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+$/;
    if (!upiId.match(upiIdRegex)) {
      alert("Invalid UPI ID format. Please enter a valid UPI ID.");
      return;
    }

    // Amount validation
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount. Please enter a valid positive number.");
      return;
    }

    // Generate result link
    const resultLink = `https://pay.upilink.in/pay/${upiId}?am=${amount}`;
    setResultLink(resultLink);
    setShowForm(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resultLink);
    alert("Link copied to clipboard!");
  };

  const handleCreateNewLink = () => {
    setShowForm(true);
    setResultLink("");
    setUpiId("");
    setAmount("");
  };

  return (
    <div className="container">
      <div className="card">
        {showForm ? (
          <form onSubmit={handleFormSubmit}>
            <h2 className="title">Free UPI link Genrator</h2>
            <p className="message">
              Create Free Links and get payments in your own account safely with
              no charges.
            </p>
            <div className="form-group">
              <label htmlFor="upiId">UPI ID:</label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Generate Link
            </button>
          </form>
        ) : (
          <div className="result-card">
            <h2 className="title">Copy and Share</h2>
            <p className="instruction">
              Copy and share this link with your customers to receive payments
              securely in your account.
            </p>
            <div className="result-link">
              <a href={resultLink} target="_blank" rel="noopener noreferrer">
                {resultLink}
              </a>
              <button className="copy-btn" onClick={handleCopyLink}>
                Copy Link
              </button>
            </div>
            <button className="new-link-btn" onClick={handleCreateNewLink}>
              Create New Link
            </button>
          </div>
        )}
      </div>
      <h5>Made with ❤ in India for you</h5>
      <div className="payment-apps">
        <h3>Supported UPI Payment Apps:</h3>
        <ul>
          <li>PhonePe</li>
          <li>GooglePay</li>
          <li>Paytm</li>
          <li>CRED</li>
          <li>BHIM</li>
          <li>Amazon Pay</li>
          <li>Mobikwik</li>
          <li>Freecharge</li>
          <li>Airtel Thanks App</li>
          <li>iMobile App</li>
        </ul>
      </div>
    </div>
  );
};

export default UpiLinkGenerator;
