import React from 'react'

import './EventItem.sass'

const eventItem = props => (
  <li className='event__list-item'>
    <div>
      <h1>{props.title}</h1>
      <h2>{props.price} - {new Date(props.date).toLocaleDateString() }</h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>You are the owner of the event</p>
      ) : (
        <button className='btn' onClick={() => props.onDetail(props.eventId)}>View details</button>
      )}
    </div>
  </li>
)

export default eventItem
