import { useSelector } from "react-redux"

const SalesRange = () => {
  const {sales} = useSelector(state => state.sales)
  return (
    <div className=" h-[570px] overflow-hidden overflow-y-auto mt-2">
      {
        sales?.map((sale,index) => 
          <div key={index} className="w-full my-5 border-y-2 border-slate-300">
            <div className="flex justify-between px-10 font-bold bg-blue-300"> 
              <div >
                {sale._id}
              </div>
              <div className="flex gap-5">
                <span >
                  Total transactions : 
                </span>
                {sale.transactions.length}
              </div>
            </div>
            <div className="grid grid-cols-4 text-center font-bold">
              <div>Receipt No</div>
              <div>Vat Sales</div>
              <div>Vat Amount</div>
              <div>Total</div>
            </div>
            <div className="">
              {sale.transactions.map(st => 
                <div key={st._id} className="grid grid-cols-4 text-center odd:bg-slate-100">
                  <div>
                    {st.receipt_no}
                  </div>
                  <div>
                    {st.vat_sales.$numberDecimal}
                  </div>
                  <div>
                    {st.vat_amount.$numberDecimal}
                  </div>
                  <div>
                    {st.amount.$numberDecimal}
                  </div>
                </div>)}
            </div>
            <div className="grid grid-cols-4 font-bold  text-center border">
              <div>
                Total
              </div>
              <div>
                {sale.totalVatSalesThisDay.$numberDecimal}
              </div>
              <div>
                {sale.totalVatAmountThisDay.$numberDecimal}
              </div>
              <div>
                {sale.totalSalesThisDay.$numberDecimal}
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default SalesRange
