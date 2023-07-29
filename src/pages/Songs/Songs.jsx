import React, { useState } from "react"
import { Container, Row, Col, Button } from "reactstrap"

import { request } from "../../api"

import { Layout, Table } from "../../components"

const url = new URL(window.location);

const updateSearchParam = (key, value) => {
  url.searchParams.set(key, value);
  window.history.pushState({ path: url.toString() },'', url.toString());
}

const getSearchParam = (key) => {
  return url.searchParams.get(key);
}

const Songs = () => {
  if (getSearchParam("limit") == null) updateSearchParam("limit", 50)

  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    limit: Number(getSearchParam("limit")) ?? 50,
    offset: Number(getSearchParam("offset")) ?? 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/data/songs?limit=${state.limit}&offset=${state.offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const refreshSongs = limit => {
    setState({ ...state, loading: true, data: null })

    request(`/spotify/data/songs?limit=${limit}&offset=${state.offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, limit })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const refreshSongsByOffset = offset => {
    setState({ ...state, loading: true, data: null })

    request(`/spotify/data/songs?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const nextSongs = event => {
    event.preventDefault()

    const offset = state.offset + state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/data/songs?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
      updateSearchParam("offset", offset)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const prevSongs = event => {
    event.preventDefault()

    const offset = state.offset - state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/data/songs?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
      updateSearchParam("offset", offset)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const updateLimit = event => {
    var limit = Number(event.target.value)

    updateSearchParam("limit", limit)

    refreshSongs(limit)
  }

  const updateOffset = (event, offset) => {
    event.preventDefault()

    updateSearchParam("offset", offset)

    refreshSongsByOffset(offset)
  }

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <h1 className="w-100 text-center">Songs</h1>
          <Col md="10" className="ml-auto mr-auto d-flex">
            {!state.loading && state.data ?
              <Table
                data={state.data.songs}
                headers={[ '#', 'Title', 'Artist', 'Album' ]}
                rowRender={(song, i) => (
                  <tr>
                    <th scope="row">{state.offset+i+1}</th>
                    <td><a href={`/song/${song.id}`}><em>{song.name}</em></a></td>
                    <td>{song.artists.map((artist, i) => (artist.name + (song.artists.length-1 > i ? ", " : "")))}</td>
                    <td>{song.albums.length > 0 ? song.albums[0].name : "N/A"}</td>
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
        </Row>
      </Container>
    </Layout>
  )
}

export { Songs }

export default Songs