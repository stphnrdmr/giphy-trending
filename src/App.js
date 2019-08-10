/* global fetch:false */

import React from 'react'
import giphyLogo from './PoweredBy_200px-Black_HorizText.png'
import './App.css'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.limit = 25
    this.apiUrl = `https://api.giphy.com/v1/gifs/trending?api_key=fGKVZU4xldHmqXQlQIXgAVcw3pquWxA4&limit=${this.limit}`
    this.state = {
      isFetching: false,
      data: [],
      pagination: {}
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    fetch(this.apiUrl)
      .then(resp => resp.json())
      .then(resp => {
        this.setState(
          {
            data: resp.data,
            pagination: resp.pagination
          }
        )
      })
  }

  handleClick () {
    if (this.state.isFetching) {
      return
    }
    this.setState({isFetching: true})

    const offset = this.state.pagination.offset + this.limit
    fetch(this.apiUrl + `&offset=${offset}`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState(
          {
            isFetching: false,
            data: [...this.state.data, ...resp.data],
            pagination: resp.pagination
          }
        )
      })
  }

  render () {
    const giphies = this.state.data.map(giphy => {
      const version = giphy.images.fixed_height
      const { height, width, webp, url } = version
      const { id, title } = giphy
      return (
        <picture key={id}>
          <source alt={title} srcSet={webp} type='image/webp' width={width} height={height} />
          <source alt={title} srcSet={url} type='image/gif' width={width} height={height} />
          <img alt={title} src={url} width={width} height={height} />
        </picture>
      )
    })
    return (
      <div className='App'>
        <div className='photos'>
          {giphies}
        </div>
        <button disabled={this.state.isFetching} className='load-more' onClick={this.handleClick}>Load more</button>
        <img alt='powered by giphy' src={giphyLogo} />
      </div>
    )
  }
}

export default App
