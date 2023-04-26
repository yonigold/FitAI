import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import {  signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/config';
import { db } from '../firebase/config';
import {  doc, getDoc } from "firebase/firestore";


function Header() {
  const [authIsReady, setAuthIsReady] = useState(false)
  const [isLogged, setIsLogged] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthIsReady(true);

    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);



  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLogged(user !== null);
      setUser(user);
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('We are working on this feature. Please check back later.')
      }
    useEffect(() => {
    const fetchUserPaymentStatus = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHasPaid(data.hasPaid);
        }
        setLoading(false);
      }
    };
    fetchUserPaymentStatus();
  }, [user]);
  
  return (

    <>
    <>
    {authIsReady &&  (
      <header className="flex flex-wrap items-center justify-between bg-white px-6 py-4 md:px-10 md:py-6">
  <h1 className="text-3xl md:text-5xl text-transparent font-bold bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800 bg-clip-text pb-1">MyFit-AI</h1>
  <div className="flex flex-wrap items-center justify-end flex-col sm:flex-row">
   
    {!isLogged && (
      <>
        <Link to="/login"><button className="bg-gray-700 hover:bg-blue-600 text-white py-2 px-4 md:py-3 md:px-5 rounded-full ">Login</button></Link>
        <Link to="/signup"><button className="bg-blue-500 hover:bg-gray-800 text-white py-2 px-4 md:py-3 md:px-5 rounded-full mt-2 md:mt-0 md:ml-3">Buy Premium</button></Link>
      </>
    )}

    {isLogged && !loading && (
      <>
        <button className='bg-gray-700 hover:bg-blue-600 text-white py-2 px-4 md:py-3 md:px-5 rounded-full ml-3' onClick={handleLogout}>Logout</button>
        <Link to="/myprograms"><button className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 md:py-3 md:px-5 rounded-full mt-2 md:mt-0 md:ml-3">My Programs</button></Link>
        
        {!hasPaid && (
      <>
      
        <Link to="/payment"><button className="bg-blue-500 hover:bg-gray-800 text-white py-2 px-4 md:py-3 md:px-5 rounded-full mt-2 md:mt-0 md:ml-3">Premium</button></Link>
        </>


      )}
      </>
    )}

  </div>
</header>
)}
  

</>
    </>
  )
}

export default Header