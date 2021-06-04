import React, { useState } from "react"
import { Container, Row, Col, Card, Table } from "reactstrap"

import { convertSecToHMS } from "../../helpers"

import { request } from "../../api"
import { Layout } from "../../components"
import { history } from "../../helpers/history"

const Session = props => {
  const { id } = props.match.params

  if(!id)
    history.push('/404')

  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/data/session/${id}`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  console.log(state)

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <Col md="10" className="ml-auto mr-auto mt-3">
            
            {!state.loading && state.data ?
              <Card className="w-100 mb-3">
                <Container>
                  <Row className="d-flex w-100">
                    <h3 className="w-100 text-center">Session Info</h3>
                    <Col md="5" className="ml-auto mr-2 d-flex flex-column">
                      <p>{`Start Time: ${new Date(state.data.start_time).toLocaleString()}`}</p>
                      <p>{`End Time: ${new Date(state.data.end_time).toLocaleString()}`}</p>
                    </Col>
                    <Col md="5" className="ml-2 mr-auto d-flex flex-column">
                      <p>{`Songs Played: ${state.data.song_count}`}</p>
                      <p>{`Total Time: ${convertSecToHMS(state.data.time_listening)}`}</p>
                    </Col>
                  </Row>
                  <Row className="d-flex">
                    <Table>
                      <thead>
                        <th>#</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Album</th>
                      </thead>
                      <tbody>
                        {state.data.tracks.map((song, i) => (
                          <tr>
                            <th scope="row">{i+1}</th>
                            <td><a href={`/song/${song.id}`}><em>{song.title}</em></a></td>
                            <td>{song.artists.map((artist, i) => (artist.name + (song.artists.length-1 > i ? ", " : "")))}</td>
                            {song.albums && song.albums.length > 0 ?
                              <td>{song.albums[0].title}</td>
                              : 
                              <td>N/A</td>
                            }
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Row>
                </Container>
              </Card>
            :
              <h1 className="w-100">Loading...</h1>
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { Session }

export default Session