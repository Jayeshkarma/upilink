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
    const resultLink = `upi://pay/?pn=withUpilink.in&pa=${upiId}&cu=INR&am=${parseFloat(amount)?.toFixed(2)}`;
    setResultLink(resultLink);
    setShowForm(false);
  };

  const handleCopyLink = () => {
    const linkElement = document.createElement('textarea');
    linkElement.value = resultLink;
    linkElement.setAttribute('readonly', '');
    linkElement.style.position = 'absolute';
    linkElement.style.left = '-9999px';
    document.body.appendChild(linkElement);
    linkElement.select();
    document.execCommand('copy');
    document.body.removeChild(linkElement);
    alert('Link copied to clipboard!');
  };

 const handleShareLink = () => {
  const shareText = `Please make payent of ammount ${parseFloat(amount)?.toFixed(2)} using UPI payment link: ${resultLink}`;
  const encodedResultLink = encodeURIComponent(resultLink);
  const shareUrl = `${encodedResultLink}`;

  if (navigator.share) {
    navigator.share({
      title: 'UPI Payment Link',
      text: shareText,
      // url: resultLink
    })
      .then(() => {
        console.log('Link shared successfully!');
      })
      .catch((error) => {
        console.error('Error sharing link:', error);
      });
  } else {
    console.warn('Sharing is not supported in this browser.');
  }
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
             <span> </span>
              <button className="copy-btn" onClick={handleShareLink}>
                Share Link
              </button>
            </div>
            <button className="new-link-btn" onClick={handleCreateNewLink}>
              Create New Link
            </button>
          </div>
        )}
      </div>
      <h5>Made with ❤️ in India for you</h5>
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
      <p style={{fontSize:'8px'}}>Version 1.02</p>
    </div>
  );
};

export default UpiLinkGenerator;
