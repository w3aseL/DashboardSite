import React, { useState } from "react"
import classnames from "classnames"
import { Container, Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane, Input, Label } from "reactstrap"

import { convertSecToHMS } from "../../helpers"

import { request } from "../../api"

import { Layout, Table } from "../../components"

const SongTab = () => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    startDate: null,
    endDate: null,
    limit: 50,
    offset: 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/stats/songs?limit=${state.limit}&offset=${state.offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const manualRefresh = (newState=state) => {
    setState({ ...newState, loading: true })

    request(`/spotify/stats/songs?limit=${newState.limit}&offset=${newState.offset}${newState.startDate ? `&startDate=${newState.startDate}` : ""}${newState.endDate ? `&endDate=${newState.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...newState, loading: false, data: res.data })
    })
    .catch(err => setState({ ...newState, loading: false, error: err }))
  }

  const refreshSongsByLimit = limit => {
    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/songs?limit=${limit}&offset=${state.offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, limit })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const refreshSongsByOffset = offset => {
    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/songs?limit=${state.limit}&offset=${offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const nextSongs = event => {
    event.preventDefault()

    const offset = state.offset + state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/songs?limit=${state.limit}&offset=${offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const prevSongs = event => {
    event.preventDefault()

    const offset = state.offset - state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/songs?limit=${state.limit}&offset=${offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const updateLimit = event => {
    var limit = Number(event.target.value)

    // updateSearchParam("limit", limit)

    refreshSongsByLimit(limit)
  }

  const updateOffset = (event, offset) => {
    event.preventDefault()

    // updateSearchParam("offset", offset)

    refreshSongsByOffset(offset)
  }

  const updateField = (e, fieldName) => {
    var newState = { ...state }

    newState[fieldName] = e.target.value

    setState(newState)
  }

  const refreshStats = e => {
    e.preventDefault()

    manualRefresh()
  }

  console.log(state)

  return (
    <div className="d-flex flex-column">
      <h3 className="w-100 text-center">Songs</h3>
      <h6 className="w-100 text-left mb-1"><em>Date Range</em></h6>
      <div className="w-100 d-flex mt-2 mb-4">
        <div className="d-flex flex-row ml-0 mr-2">
          <Input type="date" name="songStartDate" value={state.startDate} onChange={e => updateField(e, 'startDate')}></Input>
        </div>
        <div className="d-flex flex-row ml-2 mr-auto">
          <Input type="date" name="songEndDate" onChange={e => updateField(e, 'endDate')}></Input>
        </div>
        <Button outline onClick={refreshStats} className="ml-auto mr-0 mt-auto mb-auto">Refresh</Button>
      </div>
      <Col md="10" className="ml-auto mr-auto d-flex">
        {!state.loading && state.data ?
          <Table
            data={state.data.statistics}
            headers={[ '#', 'Title', 'Artist(s)', 'Times Listened', 'Total Time Played' ]}
            rowRender={(data, i) => (
              <tr>
                <th scope="row">{state.offset+i+1}</th>
                <td><a href={`/song/${data.song.id}`}><em>{data.song.name}</em></a></td>
                <td>{data.song.artists.map((artist, i) => (artist.name + (data.song.artists.length-1 > i ? ", " : "")))}</td>
                <td>{data.timesPlayed}</td>
                <td>{convertSecToHMS(data.timeListening, true)}</td>
              </tr>
            )}
            offset={state.offset}
            limit={state.limit}
            limitOptions={[ 25, 50, 100 ]}
            total={state.data.totalCount}
            updateLimit={updateLimit}
            updateOffset={updateOffset}
            previous={prevSongs}
            next={nextSongs}
          />
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
    startDate: null,
    endDate: null,
    limit: 25,
    offset: 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/stats/artists?limit=${state.limit}&offset=${state.offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const manualRefresh = (newState=state) => {
    setState({ ...newState, loading: true })

    request(`/spotify/stats/artists?limit=${newState.limit}&offset=${newState.offset}${newState.startDate ? `&startDate=${newState.startDate}` : ""}${newState.endDate ? `&endDate=${newState.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...newState, loading: false, data: res.data })
    })
    .catch(err => setState({ ...newState, loading: false, error: err }))
  }

  const refreshArtistsByLimit = limit => {
    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/artists?limit=${limit}&offset=${state.offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, limit })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const refreshArtistsByOffset = offset => {
    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/artists?limit=${state.limit}&offset=${offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const nextArtists = event => {
    event.preventDefault()

    const offset = state.offset + state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/artists?limit=${state.limit}&offset=${offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const prevArtists = event => {
    event.preventDefault()

    const offset = state.offset - state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/stats/artists?limit=${state.limit}&offset=${offset}${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const updateLimit = event => {
    var limit = Number(event.target.value)

    // updateSearchParam("limit", limit)

    refreshArtistsByLimit(limit)
  }

  const updateOffset = (event, offset) => {
    event.preventDefault()

    // updateSearchParam("offset", offset)

    refreshArtistsByOffset(offset)
  }

  const updateField = (e, fieldName) => {
    var newState = { ...state }

    newState[fieldName] = e.target.value

    setState(newState)
  }

  const refreshStats = e => {
    e.preventDefault()

    manualRefresh()
  }

  console.log(state)

  return (
    <div className="d-flex flex-column">
      <h3 className="w-100 text-center">Artists</h3>
      <h6 className="w-100 text-left mb-1"><em>Date Range</em></h6>
      <div className="w-100 d-flex mt-2 mb-4">
        <div className="d-flex flex-row ml-0 mr-2">
          <Input type="date" name="songStartDate" value={state.startDate} onChange={e => updateField(e, 'startDate')}></Input>
        </div>
        <div className="d-flex flex-row ml-2 mr-auto">
          <Input type="date" name="songEndDate" onChange={e => updateField(e, 'endDate')}></Input>
        </div>
        <Button outline onClick={refreshStats} className="ml-auto mr-0 mt-auto mb-auto">Refresh</Button>
      </div>
      <Col md="10" className="ml-auto mr-auto d-flex">
        {!state.loading && state.data ?
          <Table
            data={state.data.statistics}
            headers={[ '#', 'Artist', 'Songs Played', 'Total Time Listened' ]}
            rowRender={(data, i) => (
              <tr>
                <th scope="row">{state.offset+i+1}</th>
                <td><a href={data.artist.url} target="_blank"><em>{data.artist.name}</em></a></td>
                <td>{data.timesPlayed}</td>
                <td>{convertSecToHMS(data.timeListening, true)}</td>
              </tr>
            )}
            offset={state.offset}
            limit={state.limit}
            limitOptions={[ 15, 25, 50 ]}
            total={state.data.totalCount}
            updateLimit={updateLimit}
            updateOffset={updateOffset}
            previous={prevArtists}
            next={nextArtists}
          />
        :
          <h3 className="w-100">Loading...</h3>
        }
      </Col>
    </div>
  )
}

const OverallTab = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    startDate: null,
    endDate: null
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/stats/summary?${state.startDate ? `&startDate=${state.startDate}` : ""}${state.endDate ? `&endDate=${state.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const manualRefresh = (newState=state) => {
    setState({ ...newState, loading: true })

    request(`/spotify/stats/summary?${newState.startDate ? `&startDate=${newState.startDate}` : ""}${newState.endDate ? `&endDate=${newState.endDate}` : ""}`, null, "GET", true)
    .then(res => {  
      setState({ ...newState, loading: false, data: res.data })
    })
    .catch(err => setState({ ...newState, loading: false, error: err }))
  }

  const updateField = (e, fieldName) => {
    var newState = { ...state }

    newState[fieldName] = e.target.value

    setState(newState)
  }

  const refreshStats = e => {
    e.preventDefault()

    manualRefresh()
  }

  console.log(state)

  return (
    <div className="d-flex flex-column">
      <h3 className="w-100 text-center">Overall</h3>
      <h6 className="w-100 text-left mb-1"><em>Date Range</em></h6>
      <div className="w-100 d-flex mt-2 mb-4">
        <div className="d-flex flex-row ml-0 mr-2">
          <Input type="date" name="songStartDate" value={state.startDate} onChange={e => updateField(e, 'startDate')}></Input>
        </div>
        <div className="d-flex flex-row ml-2 mr-auto">
          <Input type="date" name="songEndDate" onChange={e => updateField(e, 'endDate')}></Input>
        </div>
        <Button outline onClick={refreshStats} className="ml-auto mr-0 mt-auto mb-auto">Refresh</Button>
      </div>
      <Col md="10" className="ml-auto mr-auto d-flex">
        {!state.loading && state.data ?
        <div className="w-100 flex-column">
          <h3 className="w-100 text-center">Overall Statistics</h3>
          <p className="text-center mb-1"><em>Time Listened:</em> {convertSecToHMS(state.data.timeListening, true, true)}</p>
          <p className="text-center mb-1"><em>Songs Played:</em> {state.data.songsPlayed}</p>
          <p className="text-center mb-1"><em>Unique Songs:</em> {state.data.uniqueSongs}</p>
          <p className="text-center mb-1"><em># of Sessions:</em> {state.data.sessionCount}</p>
          <p className="text-center"><em># Times Skipped:</em> {state.data.skipCount}</p>
        </div>          
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
          <Col md="10" className="ml-auto mr-auto mt-3 mb-5">
            <h1 className="w-100 text-center">Statistics</h1>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'statistics-0' })}
                  onClick={() => { setTab('statistics-0') }}
                >
                  Songs
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'statistics-1' })}
                  onClick={() => { setTab('statistics-1') }}
                >
                  Artists
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'statistics-2' })}
                  onClick={() => { setTab('statistics-2') }}
                >
                  Overall
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
              <TabPane tabId="statistics-2">
                <OverallTab />
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