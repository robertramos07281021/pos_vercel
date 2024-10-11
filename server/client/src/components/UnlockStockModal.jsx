/* eslint-disable react/prop-types */
import { useState } from "react"
import { useUnlockedStockMutation } from "../redux/api/pos"
import { useSelector } from "react-redux"



const UnlockStockModal = ({close, refetch, success}) => {
  
  const [unlockStock] = useUnlockedStockMutation() 
  const {stock} = useSelector(state => state.stock)
  

  const [passcode, setPasscode] = useState({
    firstCode: "",
    secondCode: "",
    thirdCode: "",
    fourthCode: "",
    fifthCode: "",
    sixthCode: "" 
  })

  const [wrongCode, setWrongCode] = useState(false) 
  
  const handleSubmit = async(e)=> {
    e.preventDefault()
    const res = await unlockStock({id: stock._id, data: passcode})
    if(res?.error?.data.message === "Wrong passcode.") {
      setWrongCode(true)
    } else {
      close()
      success()
      refetch()
      setWrongCode(false)
    }

  }



  return (
    <div className="w-full h-full bg-black/20 top-0 left-0 absolute flex items-center justify-center">
      <div className="w-96 h-64 bg-white flex flex-col rounded-md shadow-md shadow-black/40 overflow-hidden">
        <div className="justify-between flex py-2 px-3 text-white bg-red-500 font-bold text-lg"><div>Unlock</div> <div className=" cursor-pointer" onClick={close}>X</div></div>
        <form className="flex items-center justify-center h-full flex-col gap-3" onSubmit={handleSubmit}>
          {!wrongCode && 
            <h1 className="font-bold">Please enter passcode.</h1>
          }
          {wrongCode && 
            <h1 className="font-bold text-red-500">Please enter correct passcode.</h1>
          }

          <div className="flex gap-1">
            <input type="text" pattern="[0-9]{1}" className="border-2 border-slate-300 rounded-md  w-10 px-2.5 py-1 text-3xl" maxLength={1} value={passcode.firstCode} onChange={(e)=> setPasscode({...passcode, firstCode: e.target.value})}/>
            <input type="text" pattern="[0-9]{1}" className="border-2 border-slate-300 rounded-md  w-10 px-2.5 py-1 text-3xl" maxLength={1} value={passcode.secondCode} onChange={(e)=> setPasscode({...passcode, secondCode: e.target.value})}/>
            <input type="text" pattern="[0-9]{1}" className="border-2 border-slate-300 rounded-md  w-10 px-2.5 py-1 text-3xl" maxLength={1} value={passcode.thirdCode} onChange={(e)=> setPasscode({...passcode, thirdCode: e.target.value})}/>
            <input type="text" pattern="[0-9]{1}" className="border-2 border-slate-300 rounded-md  w-10 px-2.5 py-1 text-3xl" maxLength={1} value={passcode.fourthCode} onChange={(e)=> setPasscode({...passcode, fourthCode: e.target.value})}/>
            <input type="text" pattern="[0-9]{1}" className="border-2 border-slate-300 rounded-md  w-10 px-2.5 py-1 text-3xl" maxLength={1} value={passcode.fifthCode} onChange={(e)=> setPasscode({...passcode, fifthCode: e.target.value})}/>
            <input type="text" pattern="[0-9]{1}" className="border-2 border-slate-300 rounded-md  w-10 px-2.5 py-1 text-3xl" maxLength={1} value={passcode.sixthCode} onChange={(e)=> setPasscode({...passcode, sixthCode: e.target.value})}/>
          </div>
          <div className="mt">
            <button className="px-5 border-2 border-red-500 rounded-md bg-red-500 text-white font-bold hover:text-red-500 hover:bg-red-200 duration-200 ease-in-out py-2">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UnlockStockModal
