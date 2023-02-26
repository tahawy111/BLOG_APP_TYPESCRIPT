import React from "react";

const Footer = () => {
  return (
    <div className="text-center bg-light d-flex align-items-center flex-column">
      <h6 className="fw-bold pt-4">Welcome to my channel "عامر لووب"</h6>
      <a
        href="https://www.youtube.com/@Amer_Loop"
        target="_blank"
        rel="noopener noreferrer"
        className="text-info"
      >
        https://www.youtube.com/@Amer_Loop
      </a>
      <p className="mt-2">Copyright &copy; {new Date().getFullYear()}</p>
      <a
        href="https://www.termsfeed.com/live/18cf91a2-8c28-49f1-953c-ab6c92e52c73"
        target="_blank"
        rel="noopener noreferrer"
        className="text-info"
      >
        Privacy Policy
      </a>
    </div>
  );
};

export default Footer;
