import { Outlet } from "react-router"
import {  useNavigate } from "react-router-dom"
import { useLogoutMutation } from "./redux/api/user"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "./redux/features/auth/authSlice"



function App() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutUser] = useLogoutMutation()
  const { userInfo } = useSelector((state) => state.auth)

  const handleLogout = async() => {
    try {
      await logoutUser().unwrap()
      dispatch(logout())
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
    <div className="h-screen flex flex-col w-screen m-0">
      {userInfo && (
        <div className="bg-black text-white p-3 flex justify-between">
        <span className="text-5xl font-bold">POS System</span> <span className="text-md mr-5 cursor-pointer p-2 font-bold hover:scale-110 duration-200 ease-in-out" onClick={handleLogout}>Logout</span>
      </div>
      )}
      <div className="flex h-full ">
      {userInfo && (
        <div className="h-full flex flex-col bg-black text-white p-5 gap-5">
          <a href="/transaction"><button className="text-3xl px-2 py-5 bg-blue-500 w-full rounded-md ">Transaction</button></a>
          <a href="/products"><button className="text-3xl px-2 py-5 w-full bg-yellow-500 rounded-md">Products</button></a>
          <a href="/transactions"><button className="text-3xl px-2 py-5 w-full bg-red-500 rounded-md">Transactions</button></a>
          <a href="sales"><button className="text-3xl px-2 py-5 w-full bg-green-500 rounded-md">Sales</button></a>
        </div>
      )}
        <div className="w-full h-full grid shadow-[1px_1px_10px_0px_#ff0000_inset] shadow-black">
          <Outlet/>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
