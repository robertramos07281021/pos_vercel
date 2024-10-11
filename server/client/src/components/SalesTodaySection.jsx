import { useDispatch } from "react-redux"
import { useSalesTodayQuery } from "../redux/api/pos"
import { useNavigate } from "react-router-dom"
import { logout } from "../redux/features/auth/authSlice"


const SalesTodaySection = () => {
  const {data, isError} = useSalesTodayQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  console.log(data)

  console.log(isError)
  if(isError) {
    setTimeout(async()=> {
      dispatch(logout())
      navigate('/')
    })
  }


  const month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept","Oct","Nov","Dec"]
  return (
    <div className="h-full w-full flex flex-col p-3 ">
      <div className="text-xl px-2"><span className="font-bold ">Date :</span> {month[new Date().getMonth()]} {new Date().getDate()}, {new Date().getFullYear()}</div>
        <div className="flex justify-between text-lg font-semibold w-full px-5 bg-white ">
          <div>Receipt No.</div>
          <div className="grid grid-cols-3  gap-16 text-end">
            <div>Vat Amount</div>
            <div>Vat Sales</div>
            <div>Amount</div>
          </div>
        </div>
      <div className="h-[450px] w-full border-2 relative border-slate-300 rounded-md py-2 px-5 overflow-hidden overflow-y-auto">
        {data?.todaySales?.map((ts)=> 
        <div key={ts._id} className="flex justify-between py-2 px-2 odd:bg-slate-100">
          <div>
            {ts.receipt_no}
          </div>
          <div className="grid grid-cols-3 w-96 gap-20 text-end">
            <div>
              &#x20B1; {ts.vat_amount.$numberDecimal}
            </div>
            <div>
              &#x20B1; {ts.vat_sales.$numberDecimal}
            </div>
            <div className="font-semibold">
              &#x20B1; {ts.amount.$numberDecimal}
            </div>
          </div>
        </div>)}
        
      </div>
      <div className="flex justify-between text-xl px-2">
        <div className="font-black">Today Sales:</div>
        <div className="grid grid-cols-3 gap-16 text-end">

          <div className="font-semibold">&#x20B1; {data?.todaySalesTotal[0]?.totalVatAmount.$numberDecimal}</div>
          <div className="font-semibold">&#x20B1; {data?.todaySalesTotal[0]?.totalVatSales.$numberDecimal}</div>
          <div className="font-black">&#x20B1; {data?.todaySalesTotal[0]?.totalSum.$numberDecimal}</div>
        </div>
      </div>
    </div>
  )
}

export default SalesTodaySection
