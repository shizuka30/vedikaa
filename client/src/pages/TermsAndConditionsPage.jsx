// client/src/pages/TermsAndConditionsPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TermsAndConditionsPage = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (agreed) {
      navigate('/register/manager');
    } else {
      alert('You must agree to the terms and conditions to proceed.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-24">
      <div className="container mx-auto p-8 max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Manager Terms & Conditions</h1>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>Welcome to Vedika! By registering as a manager on our platform, you agree to the following terms:</p>
            <h2 className="text-xl font-bold">1. Registration Fee</h2>
            <p>A one-time, non-refundable registration fee of **₹2000** is required to activate your manager profile. This fee covers the cost of verification and platform listing.</p>
            <h2 className="text-xl font-bold">2. Booking Commission</h2>
            <p>For every event booked and completed through the Vedika platform, you agree to a **20% commission** on the total package price. This commission will be automatically deducted from the client's final payment.</p>
            <h2 className="text-xl font-bold">3. Profile Management</h2>
            <p>You are responsible for keeping your profile, event packages, pricing, and portfolio up-to-date and accurate. Misleading information may result in suspension of your account.</p>
            {/* Add more terms as needed */}
          </div>
          <div className="mt-8 border-t pt-6">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="ml-3 text-gray-700">I have read and agree to the terms and conditions.</span>
            </label>
            <button 
              onClick={handleProceed}
              disabled={!agreed}
              className="w-full mt-6 bg-primary text-white font-bold py-3 px-6 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-primary-dark"
            >
              Agree & Proceed to Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;