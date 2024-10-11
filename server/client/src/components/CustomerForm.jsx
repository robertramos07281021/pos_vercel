/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeCustomerInfo, setCustomerInfo } from "../redux/features/customer/customerSlice"
import { useCancelCustomerMutation, useCreateCustomerMutation, useNewTransactionMutation } from "../redux/api/pos"
import { removeTransaction, setTransaction } from "../redux/features/pos/transactionSlice"
import { logout } from "../redux/features/auth/authSlice"
import { useNavigate } from "react-router-dom"


const CustomerForm = () => {

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const dispatch = useDispatch()
  const [createCustomer, ] = useCreateCustomerMutation()
  const [newTransaction, ] = useNewTransactionMutation()
  const [customerDetailError, setCustomerDetailError] = useState(false)
  const {customerInfo} = useSelector(state => state.customer)

  useEffect(()=> {
    if(customerInfo) {
      setFirstname(customerInfo.firstname)
      setLastname(customerInfo.lastname)
    } else {
      setFirstname("")
      setLastname("")
    }

  },[])


  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(!firstname || !lastname) {
      setCustomerDetailError(true)
    } else {
      try {
        setCustomerDetailError(false)
        const res = await createCustomer({firstname, lastname}).unwrap()
        const payload = dispatch(setCustomerInfo({...res}))
        const transaction = await newTransaction(payload.payload._id).unwrap()
        dispatch(setTransaction({...transaction}))
      } catch (error) {
        console.log(error)
        dispatch(logout())
        navigate('/')
      } 
    }

  }

  const [cancelCustomer, setCancelCustomer] = useState(false)

  const handleCancelCustomer = ()=> {
    setCancelCustomer(!cancelCustomer)
  }

  const [deleteCustomer] = useCancelCustomerMutation()


  const handleDeleteCustomer = async()=> {
    dispatch(removeCustomerInfo())
    dispatch(removeTransaction())
    await deleteCustomer(customerInfo?._id)
    location.reload()
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <h1 className={customerDetailError ? "after:content-['*'] after:text-red-500 after:pl-2 after:text-base after:font-black font-bold" : "font-bold"}>Customer Details</h1 >
      <div className="flex lg:gap-2 2xl:gap-5">
        <label>
          <input type="text" className="border-2 lg:w-36 2xl:w-auto border-slate-300 lg:text-sm 2xl:text-base rounded p-1" disabled={customerInfo} placeholder="Enter Firstname" value={firstname} onChange={e=> setFirstname(e.target.value.toUpperCase())}/>
        </label>
        <label>
          <input type="text" className="border-2 lg:w-36 2xl:w-auto border-slate-300 lg:text-sm 2xl:text-base rounded p-1" disabled={customerInfo} placeholder="Enter Lastname" value={lastname} onChange={e=> setLastname(e.target.value.toUpperCase())} />
        </label>
        {customerInfo && 
          <div className="border lg:px-2 lg:text-sm 2xl:text-base 2xl:px-5 2xl:py-1 border-slate-500 rounded bg-slate-500 text-white hover:text-slate-500 hover:bg-slate-200 font-bold transition duration-200 ease-in-out flex items-center justify-center shadow-md shadow-black/40 cursor-pointer" onClick={handleCancelCustomer}>Cancel</div>
        }
        {!customerInfo && 
          <button className="border lg:px-2 lg:text-sm 2xl:text-base 2xl:px-5 2xl:py-1 border-blue-500 rounded bg-blue-500 text-white hover:text-blue-500 hover:bg-blue-200 font-bold transition duration-200 ease-in-out shadow-md shadow-black/30">Submit</button>
        }
      </div>
      {
        cancelCustomer && 
        <div className="absolute w-full h-full bg-black/10 top-0 left-0 flex items-center justify-center">
          <div className="w-96 h-56 bg-white rounded-md overflow-hidden flex flex-col shadow-md shadow-black/30">
            <div className="bg-blue-500 text-2xl py-2 px-5 text-white font-semibold">Confirmation</div>
            <div className="w-full h-full flex flex-col items-center justify-center gap-5">
              <p className="font-semibold">Do you want to cancel this customer?</p>
              <div className="flex gap-5">
                <div className="w-24 py-2 text-white bg-blue-500 border-2 border-blue-500 font-bold tracking-widest rounded-md shadow shadow-black/40 hover:text-blue-500 hover:bg-blue-200 duration-200 ease-in-out flex justify-center cursor-pointer" onClick={handleDeleteCustomer}>Yes</div>
                <div className="w-24 py-2 text-white bg-slate-500 border-2 border-slate-500 font-bold tracking-widest rounded-md shadow shadow-black/40 hover:text-slate-500 hover:bg-slate-200 duration-200 ease-in-out flex justify-center cursor-pointer" onClick={handleCancelCustomer}>No</div>
              </div>
            </div>
          </div>
        </div>
      }
    </form>
  )
}

export default CustomerForm
