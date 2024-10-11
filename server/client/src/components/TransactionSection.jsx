
/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux"
import { useCancelCustomerMutation, useGetAllTransactionsQuery, useTransactionPagesQuery } from "../redux/api/pos"
import { useEffect, useState } from "react"
import { setAllTransaction, setQueryTransaction } from "../redux/features/pos/transactionSlice"
import { logout } from "../redux/features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { removeCustomerInfo } from "../redux/features/customer/customerSlice"
import Pagination from "./Pagination"


const TransactionSection = () => {
  const {data, isError} = useGetAllTransactionsQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {allTransaction, queryTransaction} = useSelector(state => state.transaction)
  const [cancelCustomer] = useCancelCustomerMutation()
  const [transaction , setTransaction ] = useState("")
  const {data: pageQuery } = useTransactionPagesQuery(1)


  useEffect(()=> {
    dispatch(setAllTransaction(pageQuery))  
  },[data])


  if(isError){
    setTimeout(async() => {
      const customer = JSON.parse(localStorage.getItem('customer'))
      await cancelCustomer(customer?._id)
      dispatch(removeCustomerInfo())
      dispatch(logout())
      navigate('/')
    })
  }
  const [isSearching, setIsSearching] = useState(false)

  const findTransaction = (e) => {
    const getTransaction = data.filter(t => t.receipt_no.includes(e.target.value))
    dispatch(setAllTransaction(getTransaction))
    setTransaction(e.target.value)
    if(data.length === getTransaction.length) {
      setIsSearching(false)
    } else {
      setIsSearching(true)
    }
  }
  const handleResetFilter = () => {
    dispatch(setAllTransaction(pageQuery))
    setIsSearching(false)
    setTransaction("")
  }

  const handleTransactionInfo = (e) => {
    const query = data.filter(t => t._id === e)
    dispatch(setQueryTransaction(query[0]))
  }




  return (
    <div className=" border-r flex max-h-full min-h-full flex-col text-xs">
      <div className="p-2 flex justify-between">
        <div className="relative">
          {isSearching && 
            <div className="absolute right-10 cursor-pointer lg:top-1 2xl:top-1 text-slate-300 lg:text-base 2xl:text-xl" onClick={handleResetFilter}>X</div>
          }
          <input type="text" list="transaction" value={transaction} onChange={findTransaction} className="p-2 border-b-2 border-slate-300 focus:outline-none"  placeholder="Enter Receipt no." />
          <datalist id="transaction">
            {data?.map(t => 
              <option key={t._id} value={t.receipt_no}>{t.customer_id.firstname + " " + t.customer_id.lastname.charAt(0)}</option>
            )}
          </datalist>
        </div>
      
      </div>
      <div className=" h-[500px] w-full overflow-hidden overflow-y-auto pr-5 lg:text-xs xl:text-base">
        <div className="w-full grid grid-cols-3 text-center my-2 2xl:text-lg font-bold"> 
          <div>Receipt No.</div>
          <div>Customers</div>
          <div>Date</div>
        </div>
        {allTransaction?.map(t => <div key={t._id} onClick={()=> handleTransactionInfo(t._id)} className={`w-full grid grid-cols-3 text-center py-2 ${queryTransaction._id !== t._id && "even:bg-slate-100"} cursor-pointer  ${queryTransaction._id !== t._id && "hover:bg-green-100" } ${queryTransaction._id === t._id && "bg-green-100" }`}>
          <div>{t.receipt_no}</div>
          <div>{t.customer_id.firstname + " " + t.customer_id.lastname.charAt(0) + "."}</div>
          <div>{(new Date(t.createdAt).getMonth() + 1)}-{new Date(t.createdAt).getDate()}-{new Date(t.createdAt).getFullYear()} </div>
        </div>)}
      </div>
      <Pagination/>
    </div>
  )
}

export default TransactionSection
