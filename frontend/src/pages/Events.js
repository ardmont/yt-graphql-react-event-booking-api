import React, { Component } from 'react'

import Backdrop from '../components/Backdrop/Backdrop'
import Modal from '../components/Modal/Modal'

import './Events.sass'
import AuthContext from '../context/auth-context'

class EventsPage extends Component {
  state = {
    creating: false
  }

  static contextType = AuthContext

  constructor (props) {
    super(props)
    this.titleElRef = React.createRef()
    this.priceElRef = React.createRef()
    this.dateElRef = React.createRef()
    this.descriptionElRef = React.createRef()
  }

  startCreateEventHandler = () => {
    this.setState({
      creating: true
    })
  }

  modalConfirmHandler = () => {
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
        mutation{
          createEvent(eventInput: {
            title: "${title}"
            price: ${price}
            date: "${date}"
            description: "${description}"
          }){
            _id
            title
            description
            creator{
              createdEvents{
                title
              }
            }
          }
        }
      `
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
      body: JSON.stringify({ query: requestBody.query })
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed')
        }
        return response.json()
      })
      .then((response) => {
        console.log('data returned:', response)
      })
      .catch(e => console.log(e))
  }

  modalCancelHandler = () => {
    this.setState({
      creating: false
    })
  }

  render () {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && <Modal title='Add Event' canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
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
        </Modal>}
        {this.context.token && 
          <div className='events-control'>
            <p>Share your own Events!</p>
            <button className='btn' onClick={this.startCreateEventHandler}>Create Event</button>
          </div>
        }
      </React.Fragment>
    )
  }
}

export default EventsPage
