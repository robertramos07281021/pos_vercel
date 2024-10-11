/* eslint-disable react/prop-types */



const ConfirmationModal = ({ bgColor,borderColor,hoverBg,hoverText, message , submitButton, cancelButton}) => {

  
  return (
    <div className="absolute w-full h-full bg-black/10 top-0 left-0 flex items-center justify-center">
      <div className="w-96 h-60 bg-white rounded-md overflow-hidden flex flex-col shadow-md shadow-black/30">
        <div className={`${bgColor} text-2xl py-2 px-5 text-white font-semibold`}>Confirmation</div>
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <p className="font-semibold text-center px-11">{message}</p>
          <div className="flex gap-5">
            <div className={`w-24 py-2 text-white ${bgColor} border-2 ${borderColor} font-bold tracking-widest rounded-md shadow shadow-black/40  ${hoverBg} ${hoverText} duration-200 ease-in-out flex justify-center cursor-pointer`} onClick={submitButton}>Yes</div>
            <div className="w-24 py-2 text-white bg-slate-500 border-2 border-slate-500 font-bold tracking-widest rounded-md shadow shadow-black/40 hover:text-slate-500 hover:bg-slate-200 duration-200 ease-in-out flex justify-center cursor-pointer" onClick={cancelButton}>No</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
