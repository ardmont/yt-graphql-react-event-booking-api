import React, { Component } from 'react'
import Message from '../components/Alert/Message'

import './Auth.css'

class AuthPage extends Component {
  constructor (props) {
    super(props)
    this.emailEl = React.createRef()
    this.passwordEl = React.createRef()

    this.state = {
      showMessage: false,
      message: '',
      userCreated: false,
      isLogin: true
    }

    this.submitHandler = this.submitHandler.bind(this)
    this.switchModeHandler = this.switchModeHandler.bind(this)
  }

  switchModeHandler () {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin }
    })
  }

  submitHandler (event) {
    event.preventDefault()
    const email = this.emailEl.current.value
    const password = this.passwordEl.current.value

    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }

    let query

    if (this.state.isLogin) {
      query = `
      query{
        login(email:"${email}", password:"${password}"){
          userId
          token
          tokenExpiration
        }
      }`
    } else {
      query = `
      mutation { 
        createUser(userInput:{
          email:"${email}", 
          password:"${password}"
        })
        { email } 
      }`
    }

    window.fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query: query })
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed')
        }
        return response.json()
      })
      .then((response) => {
        if (response.errors) {
          this.setState({
            showMessage: true,
            message: response.errors[0].message,
            userCreated: false
          })
        } else {
          this.setState({
            showMessage: true,
            message: 'User created successifuly!',
            userCreated: true
          })
          setTimeout(() => this.setState({ showMessage: false }), 3000)
        }
        console.log('data returned:', response)
      })
      .catch(e => console.log(e))
  }

  render () {
    const form =
      <form className='auth-form' onSubmit={this.submitHandler}>
        { this.state.showMessage &&
          <Message message={this.state.message} success={this.state.userCreated} />
        }
        <div className='form-control'>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' ref={this.emailEl} />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' ref={this.passwordEl} />
        </div>
        <div className='form-actions'>
          <button type='submit'>Submit</button>
          <button type='button' onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
        </div>
      </form>
    return form
  }
}

export default AuthPage
