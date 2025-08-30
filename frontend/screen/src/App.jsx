import {useState, useEffect} from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router'
import './App.css'
import Login from './Login'
import Registration from './Registration';
import Chat from "./Chat.jsx";

function App() {

  const [cLogin, setCLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [serverName, setServerName] = useState('');
  const [fade, setFade] = useState(false);

    useEffect( () => {
        if (userName === ''){
            fetchServers();
            setFade(!fade);
        }

        async function fetchServers(){
            const server = await fetch(import.meta.env.VITE_BACKEND_SERVERS);
            try {
                const response = await server.json()
                const eventNames = Object.values(response.rooms)

                const listOfRoom = eventNames.map((names,id) => <Link key={names} to={`/${names}`}>{id} {names}</Link>)
                setServerName(listOfRoom)
                console.log(server)
            } catch (err) {
                console.error(err)
            }
        }
    }, [userName])


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
        <div className={`${fade ? "opacity-100 visible" : "opacity-0 invisible"} duration-300 w-2/3 h-auto min-h-14  flex flex-col overflow-x-scroll rounded-2xl transition-all bg-red-50 absolute top-[16%]`}>
            <div className={`flex flex-col items-center w-full font-bold font-stretch-extra-expanded bg-black text-green-500 text-lg`}>{serverName}</div>
        </div>

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
          <Route path={`/${serverName}`} element={<Chat></Chat>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
