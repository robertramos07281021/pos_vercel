/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux"
import CustomerForm from "../../components/CustomerForm"
import OrderForm from "../../components/OrderForm"
import { useCancelCustomerMutation, useDeleteOrderMutation, useFindTransactionOrderQuery, useTransactionGrandTotalQuery } from "../../redux/api/pos"
import { setUpdatingOrder } from "../../redux/features/pos/orderSlice"
import Payment from "../../components/Payment"
import { useEffect, useState } from "react"
import { logout } from "../../redux/features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { removeCustomerInfo } from "../../redux/features/customer/customerSlice"

const Transaction = () => {
  const [payment, setPayment] = useState(false)
  const {transaction} = useSelector(state => state.transaction)
  const {data: transactionOrders, refetch, isError} = useFindTransactionOrderQuery(transaction?._id)
  const {updatingOrder} = useSelector(state => state.orders)
  const [cancelCustomer ] = useCancelCustomerMutation()
  const {data: transaactionGrandTotal, refetch: grandTotalRefetch, isError: transactionGrandTotalError} = useTransactionGrandTotalQuery(transaction?._id)
  const dispatch = useDispatch()
  const [deleteOrder] = useDeleteOrderMutation();
  const handleUpdateOrder = async(barcode, qty, order_id)=> {
    dispatch(setUpdatingOrder({barcode, qty}))
    await deleteOrder(order_id)
  }
  const handleDeleteOrder = async(order_id) => {
    await deleteOrder(order_id)
    refetch()
    grandTotalRefetch()
  }

  useEffect(()=> {
    refetch()
    grandTotalRefetch()
  },[])

  const navigate = useNavigate()

  const customer = JSON.parse(localStorage.getItem('customer'))

  if(isError && transactionGrandTotalError && Boolean(transaction)){
    setTimeout(async()=> {
      await cancelCustomer(customer?._id)
      dispatch(removeCustomerInfo())
      dispatch(logout())
      navigate('/')
    })
  }

  return (
    <div className="min-h-full p-4 relative">
      <div className="grid grid-cols-2 mb-4">
        <CustomerForm/>
        <OrderForm/>
      </div>
      <hr  className="border border-black"/>
        <div className="w-full my-2 grid grid-cols-6 text-center items-center divide-solid divide-x py-1 px-5 lg:text-base 2xl:text-lg font-bold">
            <div>Barcode</div>
            <div>Name</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total Price</div>
            <div>Actions</div>
          </div>
      <div className="h-[400px] my-2 border-2 border-slate-300 rounded overflow-y-auto px-5">
    
        {transactionOrders?.map((transactionOrder) => 
        <div key={transactionOrder._id} className={`w-full  my-2 grid grid-cols-6 text-center items-center divide-solid divide-x odd:bg-slate-100 py-1 hover:bg-blue-500 hover:text-white ${transactionOrder.product_id.barcode === updatingOrder.barcode && "bg-red-500 text-white"}`}>
          <div>{transactionOrder.product_id.barcode}</div>
          <div>{transactionOrder.product_id.product_name}</div>
          <div>&#x20B1; {transactionOrder.product_id.price.$numberDecimal}</div>
          <div>{transactionOrder.qty}</div>
          <div>&#x20B1; {transactionOrder.total.$numberDecimal}</div>
          <div className="flex gap-5 justify-center">
            <button onClick={() => handleUpdateOrder(transactionOrder.product_id.barcode, transactionOrder.qty, transactionOrder._id)}><i className="bi bi-pencil-square text-2xl text-green-500"></i></button>
            <button onClick={()=> (handleDeleteOrder(transactionOrder._id))}><i className="bi bi-trash-fill text-2xl text-red-500"></i></button>
          </div>
        </div>
        )}
       
      </div>
      <div className="flex  justify-between px-5 font-black mb-4">
        <div>
          Grand Total :
        </div>
        <div >&#x20B1; {transaactionGrandTotal?.sum_val.$numberDecimal ? transaactionGrandTotal?.sum_val.$numberDecimal : (0).toFixed(2)}</div>
      </div>

      {(transaction && transactionOrders?.length > 0) &&
        <div className="flex justify-end w-full">
          <button className="h-10 px-5 border border-blue-500 bg-blue-500 text-white font-black rounded shadow shadow-black hover:bg-blue-300 hover:text-blue-500 duration-200 ease-in-out" onClick={()=> setPayment(true)}>Payment</button>

        </div>
      }
      {payment && 
        <Payment cancel={()=> setPayment(false)}/>
      }
    </div>
  )
}

export default Transaction
