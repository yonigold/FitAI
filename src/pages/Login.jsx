import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase/config';
import {useNavigate} from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate('/');
            
            
            
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage;
            switch (errorCode) {
                case 'auth/invalid-email':
                    errorMessage = 'Email address is invalid.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Password is invalid.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'User not found.';
                    break;
                default:
                    errorMessage = 'Something went wrong.';
                    break;
            }
            setError(errorMessage);

        });
       

  };


    return (
        <>
    
    <div className="relative min-h-screen flex flex-col justify-center items-center">
    <Link to="/">
  <h1 className="text-3xl md:text-5xl text-transparent font-bold bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800 bg-clip-text pb-1 mb-8">
    MyFit-AI
  </h1></Link>
  <div className="w-full p-6 mx-auto bg-white rounded-md shadow-md max-w-sm">
    <h2 className="text-3xl font-semibold text-center text-black-700 mb-6">
      Sign in to your account
    </h2>
    {error && (
        <div className="text-red-500">{error}</div>
      )}
    <form className="mt-6 flex-col space-y-4" onSubmit={handleSubmit}>
      <div className="mb-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-black-800"
          style={{ color: "black" }}
        >
          Email
        </label>
        <input
          type="email"
          className="block w-full px-4 py-2 mt-2 bg-white border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
         
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-white-800"
          style={{ color: "black" }}
        >
          Password
        </label>
        <input
          type="password"
          className="block w-full px-4 py-2 mt-2 bg-white border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-800">
          Login
        </button>
      </div>
    </form>
    <p className="mt-8 text-xs font-light text-center text-gray-700">
      {" "}
      Don't have an account?{" "}
      <Link to='/signup' className="font-medium text-purple-600 hover:underline">
        Sign up
      </Link>
    </p>
  </div>
</div>

      
</>
/* <div className="relative min-h-screen flex justify-center items-center">
  <div className="w-full p-6 mx-auto bg-white rounded-md shadow-md lg:max-w-xl">
    <h1 className="text-3xl font-semibold text-center text-black-700">
      Sign in to your account
    </h1>
    <form className="mt-6 flex-col space-y-4" onSubmit={handleSubmit}>
      <div className="mb-2 max-w-xs mx-auto">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-white-800"
        >
          Email
        </label>
        <input
          type="email"
          className="block w-full px-4 py-2 mt-2 bg-white border rounded-md"
          value={email}
            onChange={(e) => setEmail(e.target.value)}

/>
      </div>
      <div className="mb-2 max-w-xs mx-auto">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-white-800"
        >
          Password
        </label>
        <input
          type="password"
          className="block w-full px-4 py-2 mt-2 bg-white border rounded-md"
            value={password}   
            onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-6 max-w-xs mx-auto">
        <div className="w-full">
          <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-800">
            Login
          </button>
        </div>
      </div>
    </form>
    <p className="mt-8 text-xs font-light text-center text-gray-700">
      {" "}
      Don't have an account?{" "}
      <a href="#" className="font-medium text-purple-600 hover:underline">
        Sign up
      </a>
    </p>
  </div>
</div> */


    );
  };

export default Login;
