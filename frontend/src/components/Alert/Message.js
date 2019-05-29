import React from 'react'

import './Message.sass'

const message = (props) => {
  const type = props.success ? 'success' : 'failure'
  const className = `alert-message ${type}`
  return <div className={className}>{props.message}</div>
}

export default message
