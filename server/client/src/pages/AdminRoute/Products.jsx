import {   useState } from "react"
import NewProductForm from "../../components/NewProductForm"
import { useAllProductQuery, useCancelCustomerMutation, useGetAllStocksQuery } from "../../redux/api/pos"
import StockSection from "../../components/StockSection"
import { useDispatch } from "react-redux"
import { setFilteredStock } from "../../redux/features/pos/stockSlice"
import { logout } from "../../redux/features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { removeCustomerInfo } from "../../redux/features/customer/customerSlice"
import UnlockStockModal from "../../components/UnlockStockModal"

const Products = () => {

  const [newProductModal, setNewProductModal] = useState(false)
  const {data:products, isError: allProductError, refetch} = useAllProductQuery()
  const {data: stocks, isError } = useGetAllStocksQuery()
  const [cancelCustomer] = useCancelCustomerMutation()

  const [unlockConfirmation, setunlockConfirmation] = useState(false)
  
  const addProduct = () => {
    setunlockConfirmation(true)
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [haveSearch, setHaveSearch] = useState(false)

  const handleSearchStock = (e)=> {
    const filterStocks = stocks.filter((stock)=> stock.product_id.barcode.includes(e.target.value))
    if(filterStocks.length == stocks.length) {
      setHaveSearch(false)
    } else {
      setHaveSearch(true)
    }
    dispatch(setFilteredStock(filterStocks))
    setSearch(e.target.value)
  }

  const handleResetFilter = ()=> {
    dispatch(setFilteredStock(stocks))
    setSearch("")
    setHaveSearch(false)
  }

  if(isError && allProductError) {
    setTimeout(async()=> {
      const customer = JSON.parse(localStorage.getItem('customer'))
      await cancelCustomer(customer?._id)
      dispatch(removeCustomerInfo())
      dispatch(logout())
      navigate('/')
    })
  }


  return (
    <div className=" h-full p-4 relative flex flex-col">
      <div className="flex justify-between">
        <div className="flex gap-5">
          <button accessKey="j" className="bg-yellow-500 rounded text-white font-bold py-2 px-4 border-2 border-yellow-500 hover:text-yellow-500 hover:bg-yellow-100 duration-200 ease-in-out shadow-md shadow-black/30" onClick={addProduct}>Add Product</button>
        </div>

        <div className="flex gap-10 relative">
          {haveSearch && 
          <div className="absolute right-10 cursor-pointer top-2 text-slate-300 text-xl" onClick={handleResetFilter}>X</div>
          }
          <input type="text" list="barcode" value={search} onChange={handleSearchStock} className="p-2 w-96 border-2 border-slate-300 rounded shadow-sm shadow-black/20" placeholder="Search Barcode"/>
          <datalist id="barcode">
            {products?.map((product) => (
              <option key={product._id} value={product.barcode}>{product.product_name}</option>
            ))} 
          </datalist>
        </div>
      </div>
      <hr className="border my-5 border-black/50"/>

      <StockSection closeProductModal={()=> setNewProductModal(false)} resetFilter={handleResetFilter} searchFilter={search}/> 

      { newProductModal &&
        <NewProductForm modalToggle={()=> {setNewProductModal(false); refetch()}}/>
      }  

      {unlockConfirmation &&
        <UnlockStockModal close={()=> {setunlockConfirmation(false)} } success={()=> setNewProductModal(true)} refetch={()=> setNewProductModal(true)}/>
      }


    </div>
  )
}

export default Products
