import React, { useState } from "react"
import { Table, Container, Row, Col, Button } from "reactstrap"

import { request } from "../../api"

import { Layout } from "../../components"

const Songs = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    limit: 50,
    offset: 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/data/songs`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
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
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  console.log(state)

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <h1 className="w-100 text-center">Songs</h1>
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
                  <th>Artist</th>
                  <th>Album</th>
                </thead>
                <tbody>
                  {state.data.songs.map((song, i) => (
                    <tr>
                      <th scope="row">{state.offset+i+1}</th>
                      <td><a href={`/song/${song.id}`}><em>{song.title}</em></a></td>
                      <td>{song.artists.map((artist, i) => (artist.name + (song.artists.length-1 > i ? ", " : "")))}</td>
                      <td>{song.albums.length > 0 ? song.albums[0].title : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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