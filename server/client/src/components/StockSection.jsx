/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useAscendingStockQuery, useDescendingStockQuery, useGetAllStocksQuery, useLockedStockMutation } from '../redux/api/pos'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { removeStock, setFilteredStock, setStock } from '../redux/features/pos/stockSlice'
import UpdateProductForm from './UpdateProductForm'
import ConfirmationModal from './ConfirmationModal'
import UnlockStockModal from './UnlockStockModal'
import { logout } from '../redux/features/auth/authSlice'
import { useLocation } from 'react-router-dom'
const StockSection = ({closeProductModal, resetFilter, searchFilter}) => {
 
  const dispatch = useDispatch()
  const location = useLocation()
  const {data: allStocks, refetch, isError} = useGetAllStocksQuery()
  const {stock, filteredStock} = useSelector(state=> state.stock)
  const {data: ascending, isError: ascendingError} = useAscendingStockQuery()
  const {data: descending, isError: descendingError} = useDescendingStockQuery()

  useEffect(()=> {
    refetch()
    dispatch(setFilteredStock(allStocks))
  },[allStocks,stock])


  useEffect(()=> {
    let timer = setTimeout(()=> {
      if(isError && ascendingError && descendingError) {
        console.log(isError,ascendingError,descendingError)
        dispatch(logout())
        window.location.assign('/')
      }
    })
    return ()=> clearTimeout(timer)
  },[allStocks, ascending, descending, location])
  
  const [updateStock, setUpdateStock] = useState(false)

  const handleUpdateStock = (stock) => {
    dispatch(setStock(stock))
    setUpdateStock(true)
  }
  
  const [lockConfirmation, setLockConfirmation] = useState(false)

  const handleLockedModal = (stock)=> {
    setLockConfirmation(true)
    dispatch(setStock(stock))

  } 
  const [lockedStock] = useLockedStockMutation()
  
  const lockedProduct = async() => {
    await lockedStock(stock._id)
    refetch()
    setLockConfirmation(false)
    dispatch(removeStock())
  }

  useEffect(()=> {
    setSort(null)
  },[searchFilter])
  const [sort, setSort] = useState(null)

  const [unlockConfirmation, setUnlockConfirmation] = useState(false)

  const handleUnlockedModal = (stock) => {
    setUnlockConfirmation(true)
    dispatch(setStock(stock))
  }

  const handleAscending = () => {
    setSort(false)
    resetFilter()
    dispatch(setFilteredStock(ascending))
  }
  const handleDescending = () => {
    setSort(true)
    resetFilter()
    dispatch(setFilteredStock(descending))
  }


  return (
    <>
      <div className="grid grid-cols-6  text-center text-lg font-bold border-y border-black/30 bg-blue-100 py-4">
        <div>Barcode</div>
        <div>Name</div>
        <div>Price</div>
        <div>Description</div>
        <div>Quantity
          {sort && sort != null &&
            <i className="bi bi-caret-down-square-fill ml-2 cursor-pointer" onClick={handleAscending}></i>
          }
          {(!sort && sort != null) && 
            <i className="bi bi-caret-up-square-fill ml-2 cursor-pointer" onClick={handleDescending}></i>
          }
          {sort === null &&
            <i className="bi bi-dash-square-fill ml-2 cursor-pointer" onClick={handleAscending}></i>
          } 
        </div>
        <div>Action</div>
      </div>
      <div className="h-[485px] overflow-y-auto">
        {filteredStock?.map((s)=> <div key={s._id} className={`${(s._id === stock?._id && (lockConfirmation || unlockConfirmation)) && 'bg-red-500 text-white' } ${(s._id === stock?._id && updateStock) && 'bg-green-500 text-white' } ${s._id != stock?._id && 'odd:bg-slate-100'} grid grid-cols-6 divide-x text-center text-base  py-2 items-center hover:bg-blue-50`}>
          <div>{s.product_id.barcode}</div>
          <div>{s.product_id.product_name}</div>
          <div>{s.product_id.price?.$numberDecimal}</div>
          <div>{s.product_id.description}</div>
          <div>{s.qty}</div>
          <div className="flex gap-8 justify-center">

            {!s.isLocked && <button accessKey='/' onClick={()=> handleUpdateStock(s)}><i className={`bi bi-pencil-square text-2xl ${(s._id === stock?._id && updateStock) ? 'text-white' : "text-green-500" }`}></i></button>}
            {!s.isLocked && 
            <button onClick={()=>handleLockedModal(s)}><i className={`bi bi-unlock-fill text-2xl ${(s._id === stock?._id && (lockConfirmation || unlockConfirmation)) ? 'text-white' : "text-red-500" }`}></i></button>
            }
            {s.isLocked && 
            <button onClick={()=>handleUnlockedModal(s)}><i className={`bi bi-lock-fill text-2xl ${(s._id === stock?._id && (lockConfirmation || unlockConfirmation)) ? 'text-white' : "text-red-500" }`}></i></button>
            }
          </div>
        </div>)}
      </div>
      {lockConfirmation && 
        <ConfirmationModal bgColor='bg-red-500' borderColor='border-red-500' hoverBg='hover:bg-red-200 hover:text-red-500' message={`Locked ${stock?.product_id?.product_name} with barcode no. ${stock?.product_id?.barcode} ?`} submitButton={lockedProduct} cancelButton={()=> {setLockConfirmation(false); dispatch(removeStock())}}/>
      }

      {unlockConfirmation &&
        <UnlockStockModal close={()=> {setUnlockConfirmation(false); dispatch(removeStock())}} refetch={()=> refetch()} success={()=> refetch()}/>
      }

      {updateStock &&
        <UpdateProductForm closeUpdateModal={()=> {setUpdateStock(false); dispatch(removeStock())}} refetchStocks={()=> refetch()} closeNewProductModal={()=> {closeProductModal(); dispatch(removeStock())}}/>
      }

    </>
  )
}

export default StockSection
