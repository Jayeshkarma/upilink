import React, { useRef, useState } from "react";
import "./styles.css";
import { QRCode } from "react-qrcode-logo";
import hrLogo from "./upi.png";
import toast, { Toaster } from 'react-hot-toast';

const UpiLinkGenerator = () => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [resultLink, setResultLink] = useState("");
  const canvasRef = useRef(null);
  const notify = (m) => toast(m);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // UPI ID format validation
    const upiIdRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+$/;
    if (!upiId.match(upiIdRegex)) {
      notify("Invalid UPI ID format. Please enter a valid UPI ID.");
      return;
    }

    // Amount validation
    if (isNaN(amount) || amount <= 0) {
      notify("Invalid amount. Please enter a valid positive number.");
      return;
    }

    // Generate result link
    const resultLink = `upi://pay/?pn=withUpilink.in&pa=${upiId}&cu=INR&am=${parseFloat(
      amount
    )?.toFixed(1)}`;
    setResultLink(resultLink);
    setShowForm(false);
  };

  const handleDownload = () => {
    const qrCodeContainer = canvasRef.current;
    const qrCodeCanvas = qrCodeContainer.querySelector("canvas");
    const link = document.createElement("a");

    // Convert canvas to data URL
    const dataURL = qrCodeCanvas.toDataURL("image/png");

    // Set the link's href and download attributes
    link.href = dataURL;
    link.download = `${upiId}-${amount}.png`;

    // Simulate a click on the link to trigger the download
    link.click();
  };

  const handleShare = () => {
    const qrCodeContainer = canvasRef.current;
    const qrCodeCanvas = qrCodeContainer.querySelector("canvas");
    const link = document.createElement("a");

    // Convert canvas to data URL
    const dataURL = qrCodeCanvas.toDataURL("image/png");
    const blob = dataURLToBlob(dataURL);
    const file = new File([blob], "qrcode.png", { type: "image/png" });
    const shareText = `Please make a payment of amount ${parseFloat(
      amount
    )?.toFixed(
      1
    )} using this UPI payment link:\n${resultLink}\n\nCreated with the secure UPI payment link generator:\nhttps://upi-payment-free-link-genrator.vercel.app/`;
    const encodedResultLink = encodeURIComponent(resultLink);
    if (navigator.share) {
      navigator
        .share({
          files: [file],
          title: shareText,
          // text: shareText,
          // url: dataURL,
        })
        .then(() => console.log("Shared successfully."))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      console.log("Web Share API not supported.");
    }
  };
  const dataURLToBlob = (dataURL) => {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const byteCharacters = atob(parts[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const handleCopyLink = () => {
    const linkElement = document.createElement("textarea");
    linkElement.value = resultLink;
    linkElement.setAttribute("readonly", "");
    linkElement.style.position = "absolute";
    linkElement.style.left = "-9999px";
    document.body.appendChild(linkElement);
    linkElement.select();
    document.execCommand("copy");
    document.body.removeChild(linkElement);
    notify("Link copied to clipboard!");
  };

  const handleShareLink = () => {
    const shareText = `Please make a payment of amount ${parseFloat(
      amount
    )?.toFixed(
      1
    )} using this UPI payment link:\n${resultLink}\n\nCreated with the secure UPI payment link generator:\nhttps://upi-payment-free-link-genrator.vercel.app/`;
    const encodedResultLink = encodeURIComponent(resultLink);
    const shareUrl = `${encodedResultLink}`;

    if (navigator.share) {
      navigator
        .share({
          title: "UPI Payment Link",
          text: shareText,
          // url: resultLink
        })
        .then(() => {
          console.log("Link shared successfully!");
        })
        .catch((error) => {
          console.error("Error sharing link:", error);
        });
    } else {
      console.warn("Sharing is not supported in this browser.");
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
      <Toaster />
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
            <div ref={canvasRef}>
              <QRCode
                value={`upi://pay?pn=with Upilink.in &pa=${upiId}&cu=INR&am=${parseFloat(
                  amount
                )?.toFixed(1)}`}
                logoImage={hrLogo}
                padding={10}
                size={250}
                logoOpacity={0.8}
                logoWidth={80}
              />
            </div>
            <div className="result-link">
              <button className="copy-btn" onClick={handleDownload}>
                Download
              </button>
              <span> </span>
              <button className="copy-btn" onClick={handleShare}>
                Share QR Code
              </button>
            </div>
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
      <p style={{ fontSize: "8px", marginTop: "15px" }}>Version 1.02</p>
    </div>
  );
};

export default UpiLinkGenerator;
