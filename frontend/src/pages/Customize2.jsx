import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.AssistantName || "")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      let formData = new FormData()
      formData.append("assistantName", assistantName)
      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else {
        formData.append("imageUrl", selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
      setLoading(false)
      console.log(result.data)
      setUserData(result.data)
      navigate("/")
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <div className='relative w-full h-screen bg-linear-to-t from-black via-[#030353] to-[#090979] flex flex-col items-center justify-center px-5 transition-all duration-500'>
      
      {/* Back Button */}
      <MdKeyboardBackspace
        className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[30px] h-[30px] hover:scale-110 transition-transform duration-300'
        onClick={() => navigate("/customize")}
      />

      {/* Title */}
      <h1 className='text-white mb-10 text-[30px] text-center font-semibold tracking-wide animate-fadeIn'>
        Enter Your <span className='text-blue-200'>Assistant Name</span>
      </h1>

      {/* Input */}
      <input
        type="text"
        placeholder='e.g. Shifra'
        className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-400 px-6 py-3 rounded-full text-[18px] shadow-md focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300'
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {/* Button */}
      {assistantName && (
        <button
          className={`min-w-[300px] h-[60px] mt-10 font-semibold rounded-full text-[19px] 
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-white hover:bg-blue-100 hover:scale-105'} 
          text-black transition-all duration-300 shadow-lg hover:shadow-blue-700/40`}
          disabled={loading}
          onClick={() => handleUpdateAssistant()}
        >
          {!loading ? "Finally Create Your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  )
}

export default Customize2
