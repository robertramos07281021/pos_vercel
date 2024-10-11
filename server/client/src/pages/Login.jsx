/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux"
import { useLoginMutation } from "../redux/api/user"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { setCredentials } from "../redux/features/auth/authSlice"



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation()

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(()=> {
    if(userInfo) {
      navigate("/dashboard")
    }
  },[navigate, userInfo])

  const [required, setRequired] = useState(false)
  const [incorrect, setIncorrect] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(!username || !password) {
      setRequired(true)
      setIncorrect(false)   
    } else {
      try {
        const res = await login({username, password}).unwrap()
        setRequired(false)
        dispatch(setCredentials({...res}))
        navigate("/dashboard")
      } catch (error) {
        setRequired(false)
        setIncorrect(true)      
      }
    }
  }
  
  const [passShow, setPassShow] = useState(false)

  const handleShowPass = () => {
    setPassShow(!passShow)
  }

  return (
    <div className="w-full min-h-screen bg-fixed bg-cover flex items-center justify-center" style={{backgroundImage: `url(/retail-pos-software.jpg)`}}>
      {!isLoading ? (
        <form onSubmit={handleSubmit} className="bg-white/20 backdrop-blur-md h-96 w-96 rounded-xl shadow-md shadow-black/50 flex flex-col gap-5 items-center justify-center p-10 ">
          
          <h1 className="text-3xl font-black">Login</h1>
          <div className="w-full">
            <div className="h-6 text-red-600 font-bold text-center">
              {required &&
              "All fields are required"
              }
              {
                incorrect && "Incorrect username or password"
              }
            </div>
            <label >
              <span className="text-xl font-bold">Username</span>
              <input type="text" className="w-full rounded p-2" value={username} onChange={e => setUsername(e.target.value)}/>
            </label>
            <label className="relative">
              <span className="text-xl font-bold">Password:</span>
              <input type={passShow ? "text" : "password"} className="w-full rounded p-2" value={password} onChange={(e)=> setPassword(e.target.value)}/>
              {
                passShow ? (
                  <i className="bi bi-eye-slash-fill absolute text-xl top-7 right-2" onClick={handleShowPass}></i>
                ) : ( 
                  <i className="bi bi-eye-fill absolute text-xl top-7 right-2" onClick={handleShowPass}></i>
                )
              }
            </label>
          </div>
            <button className="border-2 border-blue-500 hover:bg-blue-200 hover:text-blue-500 py-1 px-10 rounded bg-blue-500 text-white font-bold text-lg transition duration-300 ease-in-out shadow-md">Login</button>
        </form>
      ) : (
        <div className="border-8 rounded-full border-black w-16 h-16 border-dotted animate-spin-slow"></div>
      )}
    
    </div>
  )
}

export default Login
