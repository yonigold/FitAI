

function Header() {

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('We are working on this feature. Please check back later.')
      }
  return (
    <>
    <>
    <header className="flex flex-wrap items-center justify-between bg-white px-6 py-4 md:px-10 md:py-6">
  <h1 className="text-3xl md:text-5xl text-transparent font-bold bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800 bg-clip-text pb-1">MyFit-AI</h1>
  <div className="flex flex-wrap items-center justify-end">
    <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 md:py-3 md:px-5 rounded-full">Login</button>
    <button onClick={handleSubmit} className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 md:py-3 md:px-5 rounded-full ml-3">Sign Up</button>
  </div>
</header>


</>

 {/* <header className="flex items-center justify-between bg-white px-10 py-6">
      <h1 className="text-5xl text-transparent font-bold bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800 bg-clip-text pb-1 ">MyFit-AI</h1>
      <div className="flex items-center">
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-5 rounded-full mr-4">Login</button>
        <button onClick={handleSubmit} className="bg-gray-700 hover:bg-gray-800 text-white py-3 px-5 rounded-full">Sign Up</button>
      </div>
    </header> */}
    </>
  )
}

export default Header