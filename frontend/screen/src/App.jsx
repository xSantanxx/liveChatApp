import { useState } from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router'
import './App.css'
import Login from './Login'

function App() {

  const [cLogin, setCLogin] = useState(false);


  const bAnimation = () => {
    console.log('done')
    setCLogin(!cLogin)

    setTimeout(() => {
      setCLogin(false)
    }, 1000)
  }

  return (
    <div className='w-screen h-screen bg-violet-300 flex justify-center items-center'>
      <BrowserRouter>
      <Link to='/login'>
      <div className='border-2 border-red-400 flex relative w-screen justify-center
      h-12'>
        <button onClick={bAnimation} className={`${cLogin ? "animate-ping w-30 h-30" : ""} w-12 p-2 rounded-full bg-green-400 outline-2 hover:outline-green-300
        duration-300 hover:bg-green-400/80 cursor-pointer`}><p className='text-2xl'>!</p></button>
      </div>
      </Link> 
      <Routes>
        <Route path='/' element={''}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
