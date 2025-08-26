import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'


function Login(){

    const [color, setColor] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fade, setFade] = useState(false)
    const [popFade, setPopFade] = useState(false)
    const [err, setErr] = useState('');

    useEffect(() => {
        if(username.length > 0 && password.length > 0){
            setColor(true)
        } else {
            setColor(false)
        }
    }, [username,password])

    const submitForm = async (e) => {
        e.preventDefault();
        const server = import.meta.env.VITE_BACKEND_SERVER_LOGIN
        try{
            const response = await fetch(server, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username:username, password:password})
            })
            const result = await response.json();
            const validCheck = result.success
            if(validCheck){
                const saveName = result.user.username;
            } else {
                const errMsg = result.error
                const popUpSt = errMsg.includes("Your password is incorrect")
                if(popUpSt){
                    setErr(errMsg)
                    setPopFade(true)
                    
                    setTimeout(() => {
                        setPopFade(false)
                        setErr('')
                    }, 3000)
                } else {
                    
                }
            }
            
        } catch(err){
            console.log(err)
        }
        
        // setUsername('')
        // setPassword('')
    }

    const resetPassword = (e) => {
        e.preventDefault()

    }

    const navigate = useNavigate();

    const homeScreen = () => {
        navigate('/')
    }


    return(
        <div className='p-4 rounded-2xl flex justify-center items-center absolute w-[45%] h-[40%] bg-red-500 border-2 border-solid
        '>
            <div className='bg-zinc-200 h-full w-full rounded-2xl p-2 flex flex-col [&_button]:justify-center'>
                <div className='flex justify-center'>
                    <button onClick={homeScreen} className='relative flex justify-center items-center right-[34%] outline-2 rounded-full w-5 h-5 hover:bg-red-500 hover:outline-red-300 duration-350'>
                        <p className='text-lg hover:text-zinc-300'>x</p></button>
                    <p className='text-xl font-bold'>Login Page</p>
                    </div>
            <form action="" onSubmit={submitForm} className=''>
                <label className='flex mx-5 relative top-[34%]' htmlFor="">Name</label>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder='John Doe' className='rounded-2xl mx-5 relative border-2 top-[35%]'></input>
                <label className='flex mx-5 relative top-[45%]' htmlFor="">Password</label>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='password' className='rounded-2xl mx-5 relative top-[50%] border-2'></input>
                <button className={`${color ? "hover:bg-green-500 hover:outline-green-300" : "hover:bg-red-500 hover:outline-red-300"} duration-300 flex mx-5 relative top-[80%] left-[30%] outline-2 p-2 rounded-2xl`} type='submit'>Login</button>
            </form>
            </div>
            {/* reset password */}
            <div className={` ${fade ? "" : "" } p-2 absolute w-[65%] h-[65%] bg-blue-300 rounded-lg bottom-[45%] left-[55%]
            `}>
                <div className='border-2 w-full h-8 flex justify-center mb-2'>
                    <p>Reset Password</p>
                </div>
                <div className='border-2 w-full h-55 flex'>
                    <form action="" onSubmit={''}>
                        <label className='flex my-2 ml-2' htmlFor="">Enter New Password</label>
                        <input type='password' className='border-2 ml-2 rounded-lg'></input>
                        <label className='flex my-2 ml-2' htmlFor="">Re-Enter New Password</label>
                        <input type='password' className='border-2 ml-2 rounded-lg'></input>
                        <button type='submit' className={`cursor-pointer hover:bg-green-500 hover:outline-green-300 duration-300 flex relative left-[40%] top-[5%] outline-2 p-2 rounded-2xl`}>Send</button>
                    </form>
                </div>
            </div>
            <div className={` ${popFade ? "opacity-100 visible" : "" } opacity-0 invisible duration-300 transition-all absolute w-55 h-24 bg-zinc-300 rounded-lg bottom-[85%] right-[75%]
            `}> <p className='text-base font-bold text-center'>{err}</p>
            </div>
        </div>
    )
}

export default Login