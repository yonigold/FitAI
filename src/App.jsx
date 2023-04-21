import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TrainingProgramForm from './TrainingProgramForm'
import './App.css'
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { createBrowserRouter, RouterProvider, Routes, Route, BrowserRouter } from 'react-router-dom';
import { useNavigate, Navigate } from 'react-router';

import './index.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPrograms from './pages/MyPrograms';


const router = createBrowserRouter([
  {
    path: '/',
    element: <TrainingProgramForm />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/myprograms',
    element: <MyPrograms />,
    canActivate: ({ user }) => !!user,
    redirect: '/login',
  },
]);

function App() {
  const [authIsReady, setAuthIsReady] = useState(false)
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuthentication = (user) => {
    if (user) {
      return (
        <Routes>
          <Route path="/" element={<TrainingProgramForm />} />
          <Route path="/myprograms" element={<MyPrograms />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<TrainingProgramForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthIsReady(true);
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  




  return (
    <div className="App">
      {authIsReady && checkAuthentication(user)}
    </div>
    // <div className="App">
    //   {authIsReady && (
 
    //       <Routes>
    //         <Route path="/" element={<TrainingProgramForm />} />
    //         <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
    //         <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
    //         <Route path="/myprograms" element={user ? <MyPrograms /> : <Navigate to="/login" />} />
    //       </Routes>
  
    //   )}
    // </div>
/* <div className="App">
      {authIsReady && (
        
          <Routes>
            <Route path="/" element={<TrainingProgramForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/myprograms" element={<MyPrograms />} />
          </Routes>
        
      )}
    </div> */
    // <div className="App">
    //   {authIsReady && (
    //     <TrainingProgramForm />
    //     )}
      
        
   
    // </div>
  )
}

export default App
