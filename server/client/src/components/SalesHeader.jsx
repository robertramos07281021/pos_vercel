/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGetAllTransactionsQuery, useSalesRangeMutation, useSalesYearMutation } from "../redux/api/pos";
import { useDispatch } from "react-redux";
import { setMonthlySales, setSales, setYearlySales } from "../redux/features/pos/salesSlice";



const SalesHeader = ({today, year, range, product}) => {
  const {data} = useGetAllTransactionsQuery()
  const [salesRange] = useSalesRangeMutation()
  const dispatch = useDispatch()


  const years = [];
  
  data?.map((element) => {
    if(!years.includes(new Date(element.createdAt).getFullYear())) {
      years.push(new Date(element.createdAt).getFullYear())
    }
  })

  const [dataForm , setDataForm] = useState({
    dateTo: "",
    dateFrom: ""
  })

  const [rangeError, setRangeError] = useState(false)

  const handleSubmit = async(e)=> {
    e.preventDefault()
    if(dataForm.dateFrom || dataForm.dateTo) {
      const res = await salesRange(dataForm)
      dispatch(setSales(res.data))
      range()
      setSalesYearQuery("")
      setRangeError(false)
    } else {
      setRangeError(true)
    }
  }

  const [salesYearQuery, setSalesYearQuery] = useState("")
  const [salesYear] = useSalesYearMutation()

  const handleYear = async(e)=> {
    setSalesYearQuery(e.target.value)
    const res = await salesYear({year: e.target.value})
    dispatch(setMonthlySales(res.data.monthTransaction))
    dispatch(setYearlySales(res.data.yearTransaction[0]))
    year()
    
    setDataForm({dateTo: "", dateFrom: ""})
    setRangeError(false)
    if(salesYearQuery !== "") {
    today()
    }
  }
  const handleToday = ()=> {
    today()
    setSalesYearQuery("")
    setDataForm({dateTo: "", dateFrom: ""})
    setRangeError(false)
  }
  const handleProduct = () => {
    product()
    setSalesYearQuery("")
    setDataForm({dateTo: "", dateFrom: ""})
    setRangeError(false)

  }


  return (
    <div className="flex lg:gap-5 xl:gap-10 lg:text-sm xl:text-base">
      <button onClick={handleToday} className="border-2 bg-green-600 border-green-600 text-white font-bold shadow-md shadow-black/40 px-5 rounded-md hover:text-green-600 hover:bg-green-200 duration-200 ease-in-out ">Today</button>
      <form className={` p-1 items-center pl-3 flex md:gap-1 xl:gap-4 border-2 rounded-md ${rangeError && "border-red-300"} shadow-md shadow-black/40`} onSubmit={handleSubmit}>
        <label  >
          <span className="font-bold pr-1">From :</span> 
          <input type="date" value={dataForm.dateFrom} onChange={(e)=> setDataForm({...dataForm, dateFrom: e.target.value})} className="border-b-2"/>
        </label>
        <p>/</p>
        <label >
          <span className="font-bold pr-1">To :</span> 
          <input type="date" value={dataForm.dateTo} onChange={(e)=> setDataForm({...dataForm, dateTo: e.target.value})} className="border-b-2"/>
        </label>
        <button className="px-3 border-2 border-blue-500 p-2 rounded bg-blue-500 text-white font-semibold hover:text-blue-600 hover:bg-blue-100 duration-200 ease-in-out">Submit</button>
      </form>
      <select value={salesYearQuery} onChange={handleYear} className="xl:w-52 border-2 border-slate-300 rounded shadow-md shadow-black/40 px-2">
        <option value="">Select</option>
        {years?.map((year,index) => 
          <option key={index} value={year}>{year}</option>
        )}
      </select>
      <button className="border-2 bg-blue-500 px-4 rounded border-blue-500 text-white font-semibold shadow-md shadow-black/40 hover:text-blue-600 hover:bg-blue-200 duration-200 ease-in-out" onClick={handleProduct}>Product Sales</button>
  </div>
  )
}

export default SalesHeader
