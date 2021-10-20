import React, { useState } from "react"
import classnames from "classnames"
import { Table, Container, Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"

import { convertSecToHMS } from "../../helpers"

import { request } from "../../api"

import { Layout } from "../../components"

const SongTab = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    limit: 50,
    offset: 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/stats/songs`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const nextSongs = event => {
    event.preventDefault()

    const offset = state.offset + state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/songs?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const prevSongs = event => {
    event.preventDefault()

    const offset = state.offset - state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/songs?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <div className="d-flex flex-column">
      <h3 className="w-100 text-center">Songs</h3>
      <div className="w-100 d-flex mb-3">
        <Button outline color="secondary" disabled={!(state.data && state.offset > 0)} className="ml-auto mr-1" onClick={e => prevSongs(e)}>Previous</Button>
        <Button outline color="secondary" disabled={!(state.data && state.data.next)} className="ml-1 mr-auto" onClick={e => nextSongs(e)}>Next</Button>
      </div>
      <Col md="10" className="ml-auto mr-auto d-flex">
        {!state.loading && state.data ?
          <Table>
            <thead>
              <th>#</th>
              <th>Title</th>
              <th>Artist(s)</th>
              <th>Times Listened</th>
              <th>Total Time Played</th>
            </thead>
            <tbody>
              {state.data.records.map((data, i) => (
                <tr>
                  <th scope="row">{state.offset+i+1}</th>
                  <td><a href={`/song/${data.song.id}`}><em>{data.song.title}</em></a></td>
                  <td>{data.song.artists.map((artist, i) => (artist.name + (data.song.artists.length-1 > i ? ", " : "")))}</td>
                  <td>{data.times_listened}</td>
                  <td>{convertSecToHMS(data.total_time_played)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        :
          <h3 className="w-100">Loading...</h3>
        }
      </Col>
    </div>
  )
}

const ArtistTab = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    limit: 20,
    offset: 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/stats/artists`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const nextArtists = event => {
    event.preventDefault()

    const offset = state.offset + state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/artists?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const prevArtists = event => {
    event.preventDefault()

    const offset = state.offset - state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/artists?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  console.log(state)

  return (
    <div className="d-flex flex-column">
      <h3 className="w-100 text-center">Artists</h3>
      <div className="w-100 d-flex mb-3">
        <Button outline color="secondary" disabled={!(state.data && state.offset > 0)} className="ml-auto mr-1" onClick={e => prevArtists(e)}>Previous</Button>
        <Button outline color="secondary" disabled={!(state.data && state.data.next)} className="ml-1 mr-auto" onClick={e => nextArtists(e)}>Next</Button>
      </div>
      <Col md="10" className="ml-auto mr-auto d-flex">
        {!state.loading && state.data ?
          <Table>
            <thead>
              <th>#</th>
              <th>Artist</th>
              <th>Songs Played</th>
              <th>Total Time Listened</th>
            </thead>
            <tbody>
              {state.data.records.map((data, i) => (
                <tr>
                  <th scope="row">{state.offset+i+1}</th>
                  <td><a href={data.artist.url} target="_blank"><em>{data.artist.name}</em></a></td>
                  <td>{data.times_listened}</td>
                  <td>{convertSecToHMS(data.total_time_played)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        :
          <h3 className="w-100">Loading...</h3>
        }
      </Col>
    </div>
  )
}

const Stats = props => {
  const [state, setState] = useState({
    activeTab: 'statistics-0'
  })

  const setTab = tab => {
    setState({ ...state, activeTab: tab })
  }

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <Col md="10" className="ml-auto mr-auto mt-3">
            <h1 className="w-100 text-center">Statistics</h1>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'editPortfolio-0' })}
                  onClick={() => { setTab('statistics-0') }}
                >
                  Songs
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'editPortfolio-1' })}
                  onClick={() => { setTab('statistics-1') }}
                >
                  Artists
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={state.activeTab}>
              <TabPane tabId="statistics-0">
                <SongTab />
              </TabPane>
              <TabPane tabId="statistics-1">
                <ArtistTab />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { Stats }

export default Stats