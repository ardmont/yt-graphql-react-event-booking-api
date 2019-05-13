import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import './App.css'

function App () {
  return (
    <BrowserRouter>
      <h1>TESTE</h1>
      <Route path='/' exact component={null} />
      <Route path='/auth' exact component={null} />
      <Route path='/events' exact component={null} />
      <Route path='/bookings' exact component={null} />
    </BrowserRouter>
  )
}

export default App
