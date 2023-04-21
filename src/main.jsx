import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './App'
import { createBrowserRouter, RouterProvider, BrowserRouter } from 'react-router-dom';
import './index.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPrograms from './pages/MyPrograms';





// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/signup",
//     element: <Signup />,
//   },
//   {
//     path: '/myprograms',
//     element: <MyPrograms />,
//   }
// ]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
      {/* <RouterProvider router={router}> */}
        {/* <AuthIsReady /> */}
    <App />
      </BrowserRouter>
      {/* </RouterProvider> */}
    </HelmetProvider>
  </React.StrictMode>,
)
