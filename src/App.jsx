import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TrainingProgramForm from './TrainingProgramForm'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
   <TrainingProgramForm />
    </div>
  )
}

export default App
