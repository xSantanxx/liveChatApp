import './Registration.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


function Registration(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [fade, setFade] = useState(false)

    const navigate = useNavigate()

    const backPage = () => {
        navigate('/')
    }

    const submitForm = async (e) => {
        e.preventDefault()
        const server = import.meta.env.VITE_BACKEND_SERVER_REGISTER
        try{
            const respone = await fetch(server, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, password: password})
            })

            const result = await respone.json()
            // const checkStatus = result.success
            const checkMsg = result.message
            setMsg(checkMsg)
            setFade(true) 

            setTimeout(() => {
            setFade(false)
            setMsg('')
            }, 3000)
            
        } catch (err) {
            console.log(err)
        } finally {
            setUsername('')
            setPassword('')
        }
    }

    return(
        <div className='p-4 w-2/4 h-[35%] transition-all rounded-2xl bg-red-500 border-2 absolute right-[30%] bottom-[30%]'>
            <div className='w-full h-full bg-neutral-300 p-2'>
                <div className='w-full border-2 flex justify-center'>
                    <button onClick={backPage} className='outline-2 px-2 relative right-[24%] w-6 flex justify-center rounded-full hover:outline-red-300 hover:bg-red-500 duration-300 cursor-pointer'>x</button>
                    <p>Registration System</p></div>
                <form action="" onSubmit={submitForm}>
                    <label className='flex mt-5 mb-2 outline-2' htmlFor="">Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)}  placeholder='John Doe' className='outline-2 rounded-lg'></input>
                    <label className='flex mt-5 mb-2 outline-2' htmlFor="">Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} type='password' placeholder='password' className='mb-2 outline-2 rounded-lg'></input>
                    <button type='submit' className='hover:outline-green-300 duration-300 hover:bg-green-400 cursor-pointer flex relative left-[40%] outline-2 p-2 rounded-lg top-[20%]'>Create</button>
                </form>
            </div>
            <div className={`${fade ? "opacity-100 visible" : "opacity-0 invisible"} overflow-x-auto flex duration-300 absolute top-[5%] left-[1%] w-55 h-20 p-2 border-2 bg-blue-300`}><p className='text-center font-bold text-lg'>{msg}</p></div>
        </div>
    )
}

export default Registration