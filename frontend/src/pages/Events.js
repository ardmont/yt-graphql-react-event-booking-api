import React, { Component } from 'react'

import Backdrop from '../components/Backdrop/Backdrop'
import Modal from '../components/Modal/Modal'
import EventList from '../components/Events/EventList/EventList'
import Spinner from '../components/Spinner/Spinner'

import './Events.sass'
import AuthContext from '../context/auth-context'

class EventsPage extends Component {
  state = {
    isLoading: false,
    creating: false,
    events: [],
    selectedEvent: null
  }
  isActive = true

  static contextType = AuthContext

  constructor (props) {
    super(props)
    this.titleElRef = React.createRef()
    this.priceElRef = React.createRef()
    this.dateElRef = React.createRef()
    this.descriptionElRef = React.createRef()
  }

  componentDidMount () {
    this.fetchEvents()
  }

  startCreateEventHandler = () => {
    this.setState({
      creating: true
    })
  }

  modalConfirmHandler = () => {
    this.setState({
      creating: false
    })
    const title = this.titleElRef.current.value
    const price = +this.priceElRef.current.value
    const date = this.dateElRef.current.value
    const description = this.descriptionElRef.current.value

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return
    }

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
    }

    const token = this.context.token
    console.log(token)

    window.fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
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
          const updatedEvents = [...prevState.events]
          updatedEvents.push({
            _id: response.data.createEvent._id,
            title: response.data.createEvent.title,
            description: response.data.createEvent.description,
            price: response.data.createEvent.price,
            date: response.data.createEvent.date,
            creator: {
              _id: this.context.userId
            }
          })
          return {
            events: updatedEvents
          }
        })
      })
      .catch(e => console.log(e))
  }

  modalCancelHandler = () => {
    this.setState({
      creating: false,
      selectedEvent: null
    })
  }

  fetchEvents () {
    this.setState({
      isLoading: true
    })

    const requestBody = {
      query: `
        query{
          events{
            _id
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
      `
    }

    window.fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
        const events = response.data.events
        /* if (this.isActive) {
          this.setState({
            events: events,
            isLoading: false
          })
        } */
        this.setState({
          events: events,
          isLoading: false
        })
      })
      .catch(e => {
        console.log(e)
        /* if (this.isActive) {
          this.setState({ isLoading: false })
        } */
        this.setState({ isLoading: false })
      })
  }

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId)
      return { selectedEvent: selectedEvent }
    })
  }

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null })
      return
    }

    const requestBody = {
      query: `
        mutation BookEvent($eventId: ID!){ 
          bookEvent(eventId: $eventId) { 
            _id
            createdAt
            updatedAt
          } 
        }`,
      variables: {
        eventId: this.state.selectedEvent._id
      }
    }

    const token = this.context.token

    window.fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
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
        console.log(response)
      })
      .catch(e => {
        console.log(e)
      })
  }

  componentWillMount () {
    this.isActive = false
  }

  render () {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title='Add Event'
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText='Confirm'
          >
            <form>
              <div className='form-control'>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' ref={this.titleElRef} />
              </div>
              <div className='form-control'>
                <label htmlFor='price'>Price</label>
                <input type='number' id='price' ref={this.priceElRef} />
              </div>
              <div className='form-control'>
                <label htmlFor='date'>Date</label>
                <input type='date' id='date' ref={this.dateElRef} />
              </div>
              <div className='form-control'>
                <label htmlFor='description'>Description</label>
                <textarea
                  type='text'
                  id='description'
                  rows='4'
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>)}
        {this.state.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? 'Book' : 'Confirm'}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token &&
          <div className='events-control'>
            <p>Share your own Events!</p>
            <button className='btn' onClick={this.startCreateEventHandler}>Create Event</button>
          </div>
        }
        {this.state.isLoading && <Spinner />}
        <EventList
          events={this.state.events}
          authUserId={this.context.userId}
          onViewDetail={this.showDetailHandler}
        />
      </React.Fragment>
    )
  }
}

export default EventsPage
