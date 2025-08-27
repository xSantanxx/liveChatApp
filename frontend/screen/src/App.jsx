import { useState } from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router'
import './App.css'
import Login from './Login'
import Registration from './Registration';

function App() {

  const [cLogin, setCLogin] = useState(false);
  const [userName, setUserName] = useState('')


  const bAnimation = () => {
    setCLogin(!cLogin)

    setTimeout(() => {
      setCLogin(false)
    }, 1000)
  }

  return (
    <div className='w-screen h-screen bg-violet-300 flex justify-center items-center'>
      <div className='flex absolute top-[10%] left-[5%] outline-2 w-36 h-8 px-2 transition-all rounded-lg justify-center items-center bg-neutral-200'>{userName}</div>
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
        <Route path='/login' element={<Login userName={userName} setUserName={setUserName}></Login>}></Route>
        <Route path='/register' element={<Registration></Registration>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
