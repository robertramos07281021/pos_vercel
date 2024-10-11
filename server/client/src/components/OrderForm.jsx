/* eslint-disable react-hooks/exhaustive-deps */
import {   useEffect, useState } from "react"
import {  useDispatch, useSelector } from "react-redux"
import { useAllProductQuery, useCancelCustomerMutation, useCreateOrderMutation } from "../redux/api/pos"
import { logout } from "../redux/features/auth/authSlice"
import { useLocation } from "react-router-dom"

const OrderForm = () => {
  const {transaction} = useSelector((state) => state.transaction)
  const {data:products, isError} = useAllProductQuery()
  const {updatingOrder} = useSelector((state) => state.orders)
  const dispatch = useDispatch()
  const setLocation = useLocation()
  const [cancelCustomer] = useCancelCustomerMutation()

  const [barcode, setBarcode] = useState('')
  const [qty, setQty] = useState(0)
  const [error, setError] = useState(false)
 
  const barcodes = products?.map((product)=> product.barcode)

  const [createOrder, {isError: newOrderError}] = useCreateOrderMutation()

  useEffect(()=> {
    setBarcode(updatingOrder.barcode)
    setQty(updatingOrder.qty)
  },[updatingOrder])

  useEffect(()=> {
    let timer = setTimeout(()=> {
      if(isError || newOrderError){
        dispatch(logout())
        window.location.assign('/')
      }
    })
    return ()=> clearTimeout(timer)
  },[products,setLocation.pathname])

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(!barcode || !barcodes.includes(barcode) || qty <= 0 ) {
      setError(true)
    } else {
      setError(false)
      try {
        const res = await createOrder({transaction_id: transaction?._id, barcode: barcode, qty: qty})
        if(res?.error?.data?.message === "Not authorize, no token") {
          const customer = JSON.parse(localStorage.getItem('customer'))
          await cancelCustomer(customer?._id)
          dispatch(logout())
          window.location.assign('/')
        }
        location.reload()
        setBarcode("")
        setQty(0)
      } catch (error) {
        console.log(error)
      }
    }
  }


  
  return transaction && (
    <form className="flex flex-col" onSubmit={handleSubmit}>  
      <h1 className={error ? "after:content-['*'] after:text-red-500 after:pl-2 after:text-base after:font-black font-bold" : "font-bold"}>Orders</h1>
      <div className="flex gap-5">
        <label >
          <input type="text" list="barcode" value={barcode} onChange={e=> setBarcode(e.target.value)} className="border-2 lg:w-36 2xl:w-auto border-slate-300 lg:text-sm 2xl:text-base rounded p-1" placeholder="Barcode"  />
          <datalist id="barcode">
            {products?.map((product) => (
              <option key={product._id} value={product.barcode}>{product.product_name}</option>
            ))}  
          </datalist>
        </label>
        <label >
          <input type="number" className="border-2 lg:w-36 2xl:w-auto border-slate-300 lg:text-sm 2xl:text-base rounded p-1" placeholder="Quantity" min={0} value={qty} onChange={e => setQty(e.target.value)}  />
        </label>
        <button className="border  lg:text-sm 2xl:text-base lg:px-3 2xl:px-5 2xl:py-1 border-orange-500 rounded bg-orange-500 text-white hover:text-orange-500 hover:bg-orange-200 font-bold transition duration-200 ease-in-out shadow-md shadow-black/30" >Order</button>
      </div>
    </form>
  )
}

export default OrderForm
