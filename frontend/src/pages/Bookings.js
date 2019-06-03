import React, { Component } from 'react'

import Spinner from '../components/Spinner/Spinner'

import AuthContext from '../context/auth-context'

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  }

  static contextType = AuthContext

  componentDidMount () {
    this.fetchBookings()
  }

  fetchBookings = () => {
    this.setState({
      isLoading: true
    })

    const requestBody = {
      query: `
        query{
          bookings{
            _id
            createdAt
            event{
              title
              description
              price
              date
              creator{
                _id
                email
              }
            }
          }
        }
      `
    }

    window.fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      },
      body: JSON.stringify({ query: requestBody.query })
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed')
        }
        return response.json()
      })
      .then((response) => {
        const bookings = response.data.bookings
        this.setState({
          bookings: bookings,
          isLoading: false
        })
        console.log(this.state.bookings)
      })
      .catch(e => {
        console.log(e)
        this.setState({ isLoading: false })
      })
  }

  render () {
    return (
      <React.Fragment>
        {this.state.isLoading && <Spinner />}
        <ul>
          {this.state.bookings.map(booking => (
            <li key={booking._id}>
              {booking.event.title} - {' '}
              {new Date(booking.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </React.Fragment>
    )
  }
}

export default BookingsPage
