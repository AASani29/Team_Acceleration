import React from "react";

const Footer = () => {
  return (
    <footer style={{ textAlign: "center", padding: "10px 0", background: "#f1f1f1" }}>
      <p>&copy; {new Date().getFullYear()} Banglish-to-Bangla App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
