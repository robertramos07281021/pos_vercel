/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useGetAllStocksQuery, useSalesStockSortMutation } from "../redux/api/pos"
import { useDispatch, useSelector } from "react-redux"
import { setStock } from "../redux/features/pos/stockSlice"


const ProductSales = () => {
  const {data} = useGetAllStocksQuery()
  const [salesStockSort] = useSalesStockSortMutation()
  const dispatch = useDispatch()
  const {stock} = useSelector(state => state.stock)
  console.log(stock)

  useEffect(()=> {
    dispatch(setStock(data))
  },[data])

  const [sortQtySales, setSortQtySales ] = useState(null)

  const sortAscendingSales = async() => {
    setSortQtySales(true)
    const res = await salesStockSort({sort: false})
        dispatch(setStock(res.data))
  }

  const sortDescendingSales = async() => {
    setSortQtySales(false)
    const res = await salesStockSort({sort: true})
    console.log(res)
        dispatch(setStock(res.data))
  }

  return (
    <div className="h-[560px] mt-4  overflow-hidden overflow-y-auto relative"> 
      <div className="w-full bg-blue-100 sticky top-0 grid grid-cols-5 text-center  py-2 font-bold">
        <div>Barcode</div>
        <div>Name</div>
        <div>Price</div>
        <div >Stock</div>
        <div className="cursor-pointer">
          Qty Sales
          {!sortQtySales && sortQtySales != null &&
            <i className="bi bi-caret-down-square-fill ml-2 cursor-pointer" onClick={sortAscendingSales}></i>
          }
          {(sortQtySales && sortQtySales != null) && 
            <i className="bi bi-caret-up-square-fill ml-2 cursor-pointer" onClick={sortDescendingSales}></i>
          }
          {sortQtySales === null &&
            <i className="bi bi-dash-square-fill ml-2 cursor-pointer" onClick={sortAscendingSales}></i>
          } 
        </div>
      </div>
      {stock?.map(s => <div key={s._id} className="grid grid-cols-5 text-center py-2 odd:bg-slate-100 hover:bg-green-100 ">
        <div>{s.product_id.barcode}</div>
        <div>{s.product_id.product_name}</div>
        <div>{s.product_id.price.$numberDecimal}</div>
        <div>{s.qty}</div>
        <div>{s.sales}</div>
      </div>)}
      
    </div>
  )
}

export default ProductSales
