/* eslint-disable react/prop-types */
import {  useState } from "react"
import { useSelector } from "react-redux"
import { useUpdateProductMutation, useUpdateStockMutation } from "../redux/api/pos"


const UpdateProductForm = ({closeUpdateModal,refetchStocks}) => {
  const {stock} = useSelector(state=> state.stock)
  const [newProductInfo, setNewProductInfo] = useState({
    product_name: stock?.product_id.product_name,
    barcode: stock?.product_id.barcode,
    description: stock?.product_id.description,
    price: stock?.product_id.price?.$numberDecimal,
    qty: stock?.qty
  })
  const [updateProduct] = useUpdateProductMutation()
  const [updateStock] = useUpdateStockMutation()

  const [productExistsError, setProductExistsError] = useState(false)
  const handleSubmit = async(e) => {
    e.preventDefault()
    const res = await updateProduct({data: newProductInfo, productId: stock?.product_id?._id})
    if(!res?.error) {
      await updateStock({stockId: stock?._id, qty: newProductInfo.qty})
      refetchStocks()
      closeUpdateModal()
    } else { 
      if(res?.error.data.message === "This barcode is already in used.") {
        setProductExistsError(true)
      }
    }
  }
  document.addEventListener('keydown', function(event) {
    if(event.code === "Escape") {
      closeUpdateModal()
    }
  })


  return (
    <div className="absolute h-full w-full top-0 left-0 bg-black/20 flex items-center justify-center">
      <form className="w-96 min-h-96 bg-white rounded overflow-hidden shadow-md shadow-black/30" onSubmit={handleSubmit}>
        <div className="py-2 px-5 text-2xl bg-green-500 text-white font-bold ">Update Products</div>
        <div className="p-5 flex flex-col gap-2">
          <label >
            <span className="text-lg font-semibold">Barcode :</span>
            <input type="text" className="border-2 border-slate-300 w-full p-1 rounded placeholder:text-xs" value={newProductInfo.barcode} onChange={(e)=> 
              setNewProductInfo({...newProductInfo, barcode: e.target.value})
            } placeholder="Enter Barcode"/>
          </label>
          <label >
            <span className={`text-lg font-semibold ${productExistsError && "after:content-['Product_already_exists.'] after:text-xs after:pl-20 after:text-red-500"}`}>Product Name :</span>
            <input type="text" className="border-2 border-slate-300 w-full p-1 rounded placeholder:text-xs" value={newProductInfo.product_name} onChange={(e)=> 
              setNewProductInfo({...newProductInfo, product_name: e.target.value})
            } placeholder="Enter Product Name"/>
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
            <span className="text-lg font-semibold">Price :</span>
            <input type="number" className="border-2 border-slate-300 w-full p-1 rounded placeholder:text-xs" value={newProductInfo.qty} onChange={(e)=> 
              setNewProductInfo({...newProductInfo, qty: e.target.value})
            } placeholder="Enter Price"/>
          </label>
          <div className="mt-5 flex justify-center gap-10">
            <button className="py-1 w-24 border-2 text-lg font-bold text-white bg-green-500 rounded border-green-500 hover:text-green-500 hover:bg-green-200 duration-200 ease-in-out">Update</button>
            <div className="py-1 w-24 border-2 text-lg font-bold text-white bg-slate-500 rounded border-slate-500 hover:text-slate-500 hover:bg-slate-200 duration-200 ease-in-out text-center cursor-pointer" onClick={closeUpdateModal}>Cancel</div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UpdateProductForm
