import { useSelector } from "react-redux"


const SalesYear = () => {
  const months = ['January', 'February', "March", 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novbember', 'December']
  const {monthlySales, yearlySales} = useSelector(state => state.sales)
  return (
    <div className=" mt-8 mx-5 h-full">
      <div className="grid grid-cols-3">
        <div className="text-2xl font-bold">
          {yearlySales?._id}
        </div>
        <div className="col-span-2 grid grid-cols-3 text-center items-center font-bold">
          <div>Vat Amount</div>
          <div>Vat Sales</div>
          <div>Total Monthly</div>
        </div>
      </div>
      {months.map((month, indexMonth) => 
        <div key={month} className="even:bg-slate-100 border-slate-200 grid grid-cols-3 pl-5 py-1.5 hover:bg-green-100"> 
          <div className="font-semibold">{month}: </div>
          {monthlySales?.map((ms,index) =>  
            <div key={index} className={`${(indexMonth === ms._id - 1)? "grid":"hidden"} grid-cols-3 col-span-2 text-center`}>
              <div>
                &#x20B1; {indexMonth === ms._id -1 && ms.totalVatAmountMontly?.$numberDecimal}
              </div>
              <div>
                &#x20B1; {indexMonth === ms._id -1 && ms.totalVatSalesMonthly?.$numberDecimal}
              </div>
              <div>
              &#x20B1; {indexMonth === ms._id -1 && ms.totalSalesMonthly?.$numberDecimal}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="pl-5 grid grid-cols-3 bg-blue-100 ">
        <div className="text-lg font-black py-1">Year Total :</div>
        <div className=" col-span-2 grid grid-cols-3 text-center py-1.5">
          <div className="font-semibold">&#x20B1; {yearlySales?.totalVatAmountThisYear?.$numberDecimal}</div>
          <div className="font-semibold">&#x20B1; {yearlySales?.totalVatSalesThisYear?.$numberDecimal}</div>
          <div className="font-black">&#x20B1; {yearlySales?.totalSalesThisYear?.$numberDecimal}</div>
        </div>
      </div>

    </div>
  )
}

export default SalesYear
