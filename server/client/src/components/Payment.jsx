/* eslint-disable react/prop-types */
import {  useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useCancelCustomerMutation, useGetTransactionQuery, usePaymentMutation, useTransactionGrandTotalQuery } from "../redux/api/pos"
import { removeTransaction } from "../redux/features/pos/transactionSlice"
import { removeCustomerInfo } from "../redux/features/customer/customerSlice"
import { logout } from "../redux/features/auth/authSlice"
import { useNavigate } from "react-router-dom"


const Payment = ({cancel}) => {
  const [amount, setAmount] = useState(0)
  const {transaction } = useSelector(state => state.transaction)
  const [cancelCustomer] = useCancelCustomerMutation()
  const {data: transaactionGrandTotal, isError } = useTransactionGrandTotalQuery(transaction?._id)
  const {data: getTransction , isError: getTransactionError} = useGetTransactionQuery(transaction?._id)
  const [payment] = usePaymentMutation()
  const [errorAmount, setErrorAmount] = useState(false)
  const [completePayment, setCompletePayment] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(parseInt(transaactionGrandTotal?.sum_val?.$numberDecimal) > parseInt(amount)) {
      setErrorAmount(true)
    } else {
      setErrorAmount(false)
      localStorage.setItem("complete", true)
      setCompletePayment(true)
      await payment({id: transaction?._id,cash: amount})
    }
  }
  
  const customer = JSON.parse(localStorage.getItem('customer')) 

  if(isError && getTransactionError && Boolean(transaction)){
    setTimeout(async()=> {
      await cancelCustomer(customer?._id)
      dispatch(removeCustomerInfo())
      dispatch(logout())
      navigate('/')
    })
  }

  const dispatch = useDispatch()
  const handleNewTransaction = async(e) => {
    e.preventDefault()
    localStorage.removeItem('complete')
    dispatch(removeTransaction())
    dispatch(removeCustomerInfo())
    location.reload()
  }



  return (
    <div className="w-full h-full bg-black/20 absolute left-0 top-0 flex items-center justify-center ">
      <form className="w-96 h-96 bg-white rounded-md overflow-hidden shadow-md shadow-black/40" onSubmit={handleSubmit}>
        <h1 className="bg-blue-500 text-white font-black text-3xl py-2 px-5">Payment</h1>
        <div className="px-8 py-5">
          <label>
            <span className={`text-2xl font-bold ${errorAmount && "after:content-['*'] after:text-2xl after:ps-2 after:font-bold after:text-red-500"}`}>Amount :</span>
            <input type="number" placeholder="Enter Amount" min={0} value={amount} disabled={completePayment} onChange={(e)=> setAmount(e.target.value)} className="w-full border-2 border-slate-300 rounded p-2 "/>
          </label>
          <div className="flex justify-between mt-3">
            <span className="font-semibold">Grand Total :</span>
            <div>&#x20B1; {transaactionGrandTotal?.sum_val?.$numberDecimal}</div>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Amount :</span>
            <div>&#x20B1; {parseFloat(amount).toFixed(2)}</div>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Change :</span>
            <div>&#x20B1; {((parseFloat(amount).toFixed(2)) - transaactionGrandTotal?.sum_val?.$numberDecimal).toFixed(2)}</div>
          </div>
          <hr className="my-2 border-2 border-black"/>
          <div className="flex justify-between">
            <span className="font-semibold">Vat Amount :</span>
            <div>&#x20B1; {((transaactionGrandTotal?.sum_val?.$numberDecimal /1.12)* 0.12).toFixed(2)}</div>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Vatable Sales :</span>
      
            <div >&#x20B1; {(transaactionGrandTotal?.sum_val?.$numberDecimal /1.12).toFixed(2)}</div>

          </div>
          {(!completePayment && !getTransction?.amount?.$numberDecimal) &&
            <div className="flex justify-center mt-4 gap-8">
              <button className="w-28 py-2 bg-blue-500 rounded text-white font-bold border border-blue-500 shadow shadow-black hover:bg-blue-300 hover:text-blue-500 duration-200 ease-in-out">PAY</button>
              <div className="w-28 py-2 bg-slate-300 rounded text-black font-bold text-center border border-slate-300 cursor-pointer shadow shadow-black hover:bg-slate-600 hover:text-slate-300 duration-200 ease-in-out" onClick={cancel}>Cancel</div>
            </div>
          }
          { (completePayment &&  localStorage.getItem("complete", true)) &&
            <div className="flex justify-between items-center mt-4 gap-8">
              <p className="text-xl font-bold">Thank You!</p>
              <button onClick={handleNewTransaction} className="py-2 px-3 bg-blue-500 rounded text-white font-bold shadow border border-blue-500 shadow-black hover:bg-blue-300 hover:text-blue-500 duration-200 ease-in-out">New Transaction</button> 
            </div>
           } 
          
        </div>
      </form>
    </div>
  )
}

export default Payment
