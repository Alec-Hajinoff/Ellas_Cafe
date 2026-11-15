import React from "react";
import "./RegisteredPage.css";
import UserLogin from "./UserLogin";

function RegisteredPage() {
  return (
    <div className="registered-page-wrapper">
      <div className="container text-center">
        <div>
          <UserLogin />
        </div>
      </div>
    </div>
  );
}

export default RegisteredPage;
