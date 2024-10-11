import { useState } from "react"
import SalesHeader from "../../components/SalesHeader"
import SalesTodaySection from "../../components/SalesTodaySection"
import SalesRange from "../../components/SalesRange"
import SalesYear from "../../components/SalesYear"
import ProductSales from "../../components/ProductSales"



const Sales = () => {
  const [salesToday, setSalesToday] = useState(true)
  const [salesRange, setSalesRange] = useState(false)
  const [salesYear, setSalesYear] = useState(false)
  const [salesProduct, setSalesProduct] = useState(false)

  const handleSalesToday = () => {
    setSalesToday(true)
    setSalesRange(false)
    setSalesYear(false)
    setSalesProduct(false)
  }

  const handleSalesRange = () => {
    setSalesToday(false)
    setSalesRange(true)
    setSalesYear(false)
    setSalesProduct(false)
  }
  const handleSalesYear = () => {
    setSalesToday(false)
    setSalesRange(false)
    setSalesYear(true)
    setSalesProduct(false)
  }
  
  const handleProductSales = ()=> {
    setSalesToday(false)
    setSalesRange(false)
    setSalesYear(false)
    setSalesProduct(true)
  }

  return (
    <div className="p-4 w-full h-full flex flex-col">
      <SalesHeader today={handleSalesToday} range={handleSalesRange} year={handleSalesYear} product={handleProductSales} />
      {
        salesToday &&
      <SalesTodaySection/>
      }
      {
        salesRange &&
      <SalesRange/>
      }
      {
        salesYear &&
        <SalesYear/>
      }
      {
        salesProduct &&
      <ProductSales/>
      }
    </div>
  )
}

export default Sales
