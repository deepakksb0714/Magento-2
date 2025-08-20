import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/register');
  };
  

  return (
    <div style={{ color: "black", textAlign: "center", marginTop: "20%" }} className="thank-you-message">
      <h4>Thank you for submitting your details. <br />
        we will provide a tenant for you<br />
        within 5 minutes please wait and then<br />
        check your email and login given URL and password.
      </h4>
      

      <div className="mt-2">
      <button className="btn w-50" type="button" onClick={handleNavigate} style={{background:"#363636",color:"white"}}>Back to Register</button>
      </div>
    </div>
  );
}

export default ThankYou;
