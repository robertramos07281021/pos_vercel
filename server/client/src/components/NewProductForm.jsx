/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react"
import { useCreateProductMutation, useGetAllStocksQuery, useNewStockMutation } from "../redux/api/pos"
import { useDispatch } from "react-redux"
import { logout } from "../redux/features/auth/authSlice"
import { setFilteredStock } from "../redux/features/pos/stockSlice"


const NewProductForm = ({modalToggle}) => {
  const [createProduct] = useCreateProductMutation()
  const [newStock] = useNewStockMutation()
  const {data, refetch} = useGetAllStocksQuery()

  const [newProductInfo, setNewProductInfo] = useState({
    product_name: '',
    barcode: '',
    description: '',
    price: 0,
    qty: 0
  })
  const [productExistsError, setProductExistsError] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = async(e) => {
    e.preventDefault()
    const res = await createProduct(newProductInfo)
    if(!res?.error) {
      await newStock({productId: res?.data?._id, qty: newProductInfo.qty})
      setNewProductInfo({
        product_name: '',
        barcode: '',
        description: '',
        price: 0,
        qty: 0
      })
      setProductExistsError(false)
      modalToggle()

    } else {
      if(res?.error?.data?.message === "Product is already exists") {
        setProductExistsError(true)
      }
      if(res?.error?.data?.message === "Not authorize, no token") {
        dispatch(logout())
        window.location.assign('/')
      }
 
    }

  }

  useEffect(()=> {
    refetch()
    dispatch(setFilteredStock(data))
  },[newProductInfo])

  document.addEventListener('keydown', function(event) {
    if(event.code === "Escape") {
      modalToggle()
    }
  })

  return (
    <div className="absolute w-full h-full bg-black/10 top-0 left-0 flex items-center justify-center">
      <form className="w-96 min-h-96 bg-white rounded overflow-hidden shadow-md shadow-black/30" onSubmit={handleSubmit}>
        <div className="py-2 px-5 text-2xl bg-yellow-500 text-white font-bold ">New Products</div>
        <div className="p-5 flex flex-col gap-2">
          <label >
            <span className={`text-lg font-semibold ${productExistsError && "after:content-['Product_already_exists.'] after:text-xs after:pl-20 after:text-red-500"}`}>Product Name :</span>
            <input type="text" className="border-2 border-slate-300 w-full p-1 rounded placeholder:text-xs" value={newProductInfo.product_name} onChange={(e)=> 
              setNewProductInfo({...newProductInfo, product_name: e.target.value})
            } placeholder="Enter Product Name"/>
          </label>
          <label >
            <span className="text-lg font-semibold">Barcode :</span>
            <input type="text" className="border-2 border-slate-300 w-full p-1 rounded placeholder:text-xs" value={newProductInfo.barcode} onChange={(e)=> 
              setNewProductInfo({...newProductInfo, barcode: e.target.value})
            } placeholder="Enter Barcode"/>
          </label>
          <label >
            <span className="text-lg font-semibold">Description :</span>
            <textarea className="border-2 border-slate-300 w-full p-1 rounded  resize-none placeholder:text-xs" value={newProductInfo.description} onChange={(e)=> 
              setNewProductInfo({...newProductInfo, description: e.target.value})
            } rows={3} placeholder="Add Descriptions(Option)"></textarea>
          </label>
          <label >
            <span className="text-lg font-semibold">Price :</span>
            <input type="number" className="border-2 border-slate-300 w-full p-1 rounded placeholder:text-xs" value={newProductInfo.price} onChange={(e)=> 
              setNewProductInfo({...newProductInfo, price: e.target.value})
            } placeholder="Enter Price"/>
          </label>
          <label >
            <span className="text-lg font-semibold">Quantity :</span>
            <input type="number" className="border-2 border-slate-300 w-full p-1 rounded placeholder:text-xs" value={newProductInfo.qty} onChange={(e)=> 
              setNewProductInfo({...newProductInfo, qty: e.target.value})
            } placeholder="Enter Quantity"/>
          </label>
          <div className="mt-5 flex justify-center gap-10">
            <button className="py-1 w-24 border-2 text-lg font-bold text-white bg-yellow-500 rounded border-yellow-500 hover:text-yellow-500 hover:bg-yellow-200 duration-200 ease-in-out">Add</button>
            <div accessKey="27" className="py-1 w-24 border-2 text-lg font-bold text-white bg-slate-500 rounded border-slate-500 hover:text-slate-500 hover:bg-slate-200 duration-200 ease-in-out text-center cursor-pointer" onClick={modalToggle}>Cancel</div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewProductForm
