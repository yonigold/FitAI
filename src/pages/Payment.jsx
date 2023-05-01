import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalButton } from "react-paypal-button-v2";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { getAuth } from "firebase/auth";
import { setDoc, doc, addDoc, getFirestore } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router";
import { Link } from "react-router-dom";

function Payment() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        setUserId(user.uid);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  const createOrder = (data, actions) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      fetch("https://us-central1-myfit-ai.cloudfunctions.net/createOrder")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          resolve(data.orderID);
        })

        .catch((err) => {
          // console.error('Error in createOrder:', err);
          setLoading(false);
          reject(err);
        });
    });
  };

  const onApprove = (data, actions) => {
    setLoading(true);
    fetch("https://us-central1-myfit-ai.cloudfunctions.net/captureOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    })
      .then((res) => res.json())
      .then((details) => {
        setLoading(false);
        // console.log(details)

        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);

        const db = getFirestore();
        const auth = getAuth();

        if (auth.currentUser) {
          const userId = auth.currentUser.uid;
          const useRef = doc(db, "users", userId);

          setDoc(useRef, { hasPaid: true }, { merge: true })
            .then(() => {
              // console.log("Document successfully written!");
            })
            .catch((error) => {
              // console.error("Error writing document: ", error);
            });
        }
      })
      .catch((err) => {
        // console.log('payment error' + err)
        setPaymentError("Payment failed. Please try again.");
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Link to="/">
          <h1 className="text-3xl md:text-5xl text-transparent font-bold bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800 bg-clip-text pb-1 mb-8">
            MyFit-AI
          </h1>
        </Link>

        {loading && <p className="text-center text-lg">Loading...</p>}
        {success && (
          <p className="text-green-500 text-center text-lg">
            Payment successful! Redirecting to home page
          </p>
        )}

        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Complete Your Payment
          </h2>
          <div className="text-center mb-4">
            <p className="text-gray-600 text-lg">
              Lifetime Subscription for first Access to new features and
              Unlimited Training Programs Generation!
            </p>
            <p className="text-3xl font-bold text-gray-800">$9.99</p>
            <p className="text-gray-600">(one-time payment)</p>
          </div>
          <PayPalScriptProvider
            options={{
              "client-id":
                "AUtycYbhB4B7ehS63nSGt6-1kdgWT1js4TcYTCnH9Ssxu1E5VRYifhm4t-KQXCX-chHlQLZoGSttAUa6",
            }}
          >
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
          </PayPalScriptProvider>

          <p className="text-red-500">{paymentError}</p>
        </div>
      </div>
    </>
  );
}

export default Payment;
