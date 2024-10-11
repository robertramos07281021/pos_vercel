import { useSelector } from "react-redux"
import TransactionSection from "../../components/TransactionSection"


const Transactions = () => {
  const {queryTransaction} = useSelector(state => state.transaction)
  
  return (
    <div className="grid grid-cols-3 h-full w-full p-5">
      <TransactionSection/>

      <div className="col-span-2 flex flex-col ps-5 gap-3 lg:text-sm xl:text-base">
        <div className="lg:text-sm 2xl:text-lg flex justify-between">
          <p><span className="font-bold">Reciept No. :</span>  {queryTransaction?.receipt_no}</p>
          <p className="lg:w-52 2xl:w-96"><span className="font-bold">Date : </span>
          { queryTransaction.length != 0 && 
            <span> {queryTransaction?.createdAt}</span>
          }
        </p>

        
        </div>
        <div className="text-lg ">
          <p><span className="font-bold">Customer :</span> {queryTransaction.length != 0 && queryTransaction?.customer_id?.firstname + " " + queryTransaction?.customer_id?.lastname} </p>
        </div>
        <div className="lg:h-[380px] 2xl:h-[400px] w-full overflow-hidden overflow-y-auto border-2 rounded-md border-slate-300 px-2 py-2 relative">
          <div className="sticky top-0 left-0">
            <div className="grid grid-cols-9 font-bold text-center bg-white pb-2 border-b-2 border-black mb-5">
              <div className="col-span-2">Barcode</div>
              <div className="col-span-2">Product Name</div>
              <div className="col-span-2">Product Price</div>
              <div >Qty</div>
              <div className="col-span-2">Total</div>
            </div>
          </div>
          {queryTransaction?.orders?.map(o => 
            <div key={o._id} className="grid grid-cols-9 even:bg-slate-100 text-center py-2">
              <div className="col-span-2">{o.product_id.barcode}</div>
              <div className="col-span-2">{o.product_id.product_name}</div>
              <div className="col-span-2">&#x20B1; {o.product_id.price.$numberDecimal}</div>
              <div>{o.qty} pc/s</div>
              <div className="col-span-2">&#x20B1; {o.total.$numberDecimal}</div>
            </div>
          )}
        </div>
        <div className="px-4">
          <div className="flex justify-between text-lg font-bold">
            <div>Grand Total :</div>
            <div>&#x20B1; {queryTransaction.length !=0 ? queryTransaction?.amount?.$numberDecimal : "0.00"}</div>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <div>Payment Bill :</div>
            <div>&#x20B1; {queryTransaction.length !=0 ? queryTransaction?.cash?.$numberDecimal : "0.00"}</div>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <div>Change :</div>
            <div>&#x20B1; {queryTransaction.length !=0 ? queryTransaction?.change?.$numberDecimal : "0.00"}</div>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <div>Vat Sales :</div>
            <div>&#x20B1; {queryTransaction.length !=0 ? queryTransaction?.vat_sales?.$numberDecimal : "0.00"}</div>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <div>Vat Amount :</div>
            <div>&#x20B1; {queryTransaction.length !=0 ? queryTransaction?.vat_amount?.$numberDecimal : "0.00"}</div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Transactions
