import React, { useState } from "react"
import { connect } from "react-redux"
import { Container, Row, Col, Card, Table } from "reactstrap"

import { convertSecToHMS } from "../../helpers"

import { request } from "../../api"

import { Layout, SongCard } from "../../components"

const DashboardPage = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request("/spotify/track-all", null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  console.log(state)

  return (
    <Layout>
      <Container>
        <Row className="d-flex mt-4">
          <Col md="4" className="ml-auto mr-auto">
            <h1 className="text-center">Dashboard</h1>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          <Col md="5" className="ml-auto mr-auto">
            {!state.loading && state.data ?
              <>
                {state.data.current_song && state.data.session.active ?
                  <SongCard song={state.data.current_song} cardTitle={state.data.is_playing ? "Now Playing" : "Paused..."} />
                :
                  <Card>
                    <>
                      <h3 className="w-100 text-center">Current Song</h3>
                      <p className="w-100 text-center"><em>No song playing...</em></p>
                    </>
                  </Card>
                }
              </>
            :
              <Card>
                <h3 className="w-100 text-center">Loading...</h3>
              </Card>
            }
          </Col>
          {!state.loading && state.data ?
            <Col md="5" className="ml-auto mr-auto">
              {!state.loading && state.data ?
                <>
                  {state.data.previous_song && state.data.session.active ?
                    <SongCard song={state.data.previous_song} cardTitle={"Previous Song..."} />
                  :
                    <Card>
                      <>
                        <h3 className="w-100 text-center">Previous Song</h3>
                        <p className="w-100 text-center"><em>No previous song...</em></p>
                      </>
                    </Card>
                  }
                </>
              :
                <Card>
                  <h3 className="w-100 text-center">Loading...</h3>
                </Card>
              }
            </Col>
          : null}
        </Row>
        {!state.loading && state.data ?
          <Row className="d-flex mt-3 mb-4">
            <Col md="9" className="ml-auto mr-auto d-flex">
              <Card className="w-100">
                <Container>
                  {state.data.session && state.data.session.active ?
                    <>
                      <Row className="d-flex w-100">
                        <h3 className="w-100 text-center">Session Info</h3>
                        <Col md="5" className="ml-auto mr-2 d-flex flex-column">
                          <p>{`Start Time: ${new Date(state.data.session.start_time).toLocaleString()}`}</p>
                          <p>{`Songs Played: ${state.data.session.songs_played}`}</p>
                        </Col>
                        <Col md="5" className="ml-2 mr-auto d-flex flex-column">
                          <p>{`Total Time: ${convertSecToHMS(state.data.session.total_session_time)}`}</p>
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
                            {state.data.session.song_list.map((song, i) => (
                              <tr>
                                <th scope="row">{i+1}</th>
                                <td>{song.name}</td>
                                <td>{song.artists.map((artist, i) => (artist.name + (song.artists.length-1 > i ? ", " : "")))}</td>
                                <td>{song.album.name}</td>
                              </tr>
                            ))}
                            {state.data.session.songs_played == state.data.session.song_list.length + 1 &&
                              <tr>
                                <th scope="row">{state.data.session.songs_played}</th>
                                <td>{state.data.current_song.name}</td>
                                <td>{state.data.current_song.artists.map((artist, i) => (artist.name + (state.data.current_song.artists.length-1 > i ? ", " : "")))}</td>
                                <td>{state.data.current_song.album.name}</td>
                              </tr>
                            }
                            {state.data.session.songs_played == 0 &&
                              <tr>
                                <th scope="row">1</th>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>N/A</td>
                              </tr>
                            }
                          </tbody>
                        </Table>
                      </Row>
                    </>
                  : 
                    <Row className="d-flex">
                      <h3 className="w-100 text-center">Session Info</h3>
                      <p className="w-100 text-center"><em>No session active...</em></p>
                    </Row>
                  }
                </Container>
              </Card>
            </Col>
          </Row>
        : null}
      </Container>
    </Layout>
  )
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
})

const Dashboard = connect(mapStateToProps)(DashboardPage)

export { Dashboard }

export default Dashboard