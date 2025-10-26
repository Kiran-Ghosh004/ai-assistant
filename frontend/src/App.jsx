import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/signup'

const App = () => {
  return (
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/signin' element={<Signin/>}/>

    </Routes>
  )
}

export default App