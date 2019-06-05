import React from 'react'

import './BookingsList.sass'

const BookingsList = props => (
  <ul className='bookings__list'>
    {props.bookings.map(booking => (
      <li className='bookings__item' key={booking._id}>
        <div className='bookings__item_data'>
          {booking.event.title} - {' '}
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
        <div className='bookings__item-action'>
          <button className='btn' onClick={() => props.onDelete(booking._id)}>Cancel</button>
        </div>
      </li>
    ))}
  </ul>
)

export default BookingsList
