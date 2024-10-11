/* eslint-disable react-hooks/exhaustive-deps */
import { useGetAllTransactionsQuery, useTransactionPagesQuery } from "../redux/api/pos"
import { useDispatch, useSelector } from "react-redux"
import { pageCountDecrement, pageCountIncrement, setAllTransaction, setPageCount } from "../redux/features/pos/transactionSlice"
import { useEffect } from "react"


const Pagination = () => {
  const {data} = useGetAllTransactionsQuery()
  const {pageCount} = useSelector(state => state.transaction)
  const dispatch = useDispatch()
  const pageSetup = Math.ceil(data?.length/10)

  const {data: pageData, refetch} = useTransactionPagesQuery(pageCount)

  useEffect(()=> {
    dispatch(setAllTransaction(pageData))
    refetch()
  },[pageData])
  

  const handlePrevPage = () => {
    if((pageCount -1 ) > 0) {
      dispatch(pageCountDecrement())
    }
  }
  const handleNextPage = () => {
    if((pageCount +1 ) <= pageSetup) {
      dispatch(pageCountIncrement())
    }
  }


  return (
    <div className=" flex justify-center text-center mr-5 gap-2 text-base items-center">
      <i className="bi bi-caret-left-square text-2xl" onClick={handlePrevPage}></i>
      {
        (pageCount === pageSetup && pageCount - 4 > 0) &&
          <div className="w-10 border-2 border-slate-300" onClick={()=> {dispatch(setPageCount(pageCount - 4)); refetch()}}>
            {pageCount - 4}
          </div>
      }
      {
        (((pageCount === (pageSetup - 1)) || (pageCount === pageSetup)) && pageCount - 3 > 0)  &&
          <div className="w-10 border-2 border-slate-300" onClick={()=> {dispatch(setPageCount(pageCount - 3)); refetch()}}>
            {pageCount - 3}
          </div>
      }
      {
        ((pageCount - 2  > pageSetup) || (pageCount - 2 > 0))  &&
          <div className="w-10 border-2 border-slate-300" onClick={()=> {dispatch(setPageCount(pageCount - 2)); refetch()}}>
            {pageCount - 2}
          </div>
      }
      {
        (pageCount - 1 ) > 0 &&
          <div className="w-10 border-2 border-slate-300 cursor-pointer" onClick={()=> {dispatch(setPageCount(pageCount - 1)); refetch()}}>
            {pageCount - 1}
          </div>
      }
      <div className={`bg-blue-300 w-10 border-2 border-slate-300`}>
        {pageCount}
      </div>
      {
        (pageCount + 1 ) <= pageSetup &&
          <div className="w-10 border-2 border-slate-300" onClick={()=> {dispatch(setPageCount(pageCount + 1)); refetch()}}>
            {pageCount + 1}
          </div>
      }
      {
        (pageCount + 2 ) <= pageSetup  &&
          <div className="w-10 border-2 border-slate-300" onClick={()=> {dispatch(setPageCount(pageCount + 2)); refetch()}}>
            {pageCount + 2}
          </div>
      }
      {
        (((pageCount + 3  > pageCount + 2) && (pageCount + 3 < pageCount + 2)) || (pageCount - 3 < 0 && pageCount + 3 < pageSetup ) )  &&
          <div className="w-10 border-2 border-slate-300" onClick={()=> {dispatch(setPageCount(pageCount + 3)); refetch()}}>
            {pageCount + 3}
          </div>
      }
      {
        ((pageCount - 1 ) === 0 && (pageCount + 4 ) <= pageSetup) &&
          <div className="w-10 border-2 border-slate-300" onClick={()=> {dispatch(setPageCount(pageCount + 4)); refetch()}}>
            {pageCount + 4}
          </div>
      }
      <i className="bi bi-caret-right-square text-2xl" onClick={handleNextPage}></i>
    </div>
  )
}

export default Pagination
