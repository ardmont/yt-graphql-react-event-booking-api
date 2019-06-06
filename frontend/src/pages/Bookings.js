import React, { Component } from 'react'

import Spinner from '../components/Spinner/Spinner'

import BookingsList from '../components/Bookings/BookingsList/BookingsList'
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls'
import Charts from '../components/Bookings/BookingsCharts/Charts'

import AuthContext from '../context/auth-context'

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: 'list'
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

  deleteBookingHandler = bookingId => {
    this.setState({
      isLoading: true
    })

    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) { 
          cancelBooking(bookingId: $id) { 
            _id
            title 
          } 
        }
      `,
      variables: {
        id: bookingId
      }
    }

    window.fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed')
        }
        return response.json()
      })
      .then((response) => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => {
            return booking._id !== bookingId
          })
          return { bookings: updatedBookings, isLoading: false }
        })
        console.log(`Deleted: ${bookingId}`)
      })
      .catch(e => {
        console.log(e)
        this.setState({ isLoading: false })
      })
  }

  changeOutputTypeHandler = outputType => {
    console.log('outputType: ' + outputType)
    // if (outputType === 'list') {
    this.setState({ outputType: outputType })
    // }
  }

  render () {
    let content = <Spinner />

    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingsControls activeOutputType={this.state.outputType} changeOutput={this.changeOutputTypeHandler} />
          <div>
            {this.state.outputType === 'list' ? (
              <BookingsList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
            ) : (
              <Charts bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      )
    }

    return content
  }
}

export default BookingsPage
