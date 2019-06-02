import React from 'react'

import './Spinner.sass'

const Spinner = () => (
  <div className='spinner'>
    <div className='lds-ellipsis'>
      <div>{}</div><div>{}</div>
      <div>{}</div><div>{}</div>
    </div>
  </div>
)

export default Spinner
