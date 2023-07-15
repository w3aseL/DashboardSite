import React, { useState } from "react"
import { connect } from "react-redux"
import { Container, Row, Col, Card, Table } from "reactstrap"

import { convertSecToHMS } from "../../helpers"

import { request } from "../../api"
import { API_HOST } from "../../api/config"

import { Layout, SongCard } from "../../components"

const RecentSessions = () => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request("/spotify/data/sessions/recent", null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <>
      {!state.loading && state.data ?
        <Table>
          <thead>
            <th>#</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Song Count</th>
            <th>Link</th>
          </thead>
          <tbody>
            {state.data.sort((a, b) => a.sessionId - b.sessionId).map((session, i) => (
              <tr>
                <th scope="row">{session.sessionId}</th>
                <td>{new Date(session.startTime).toLocaleString()}</td>
                <td>{new Date(session.endTime).toLocaleString()}</td>
                <td>{convertSecToHMS(session.timeListening)}</td>
                <td>{session.songCount}</td>
                <td><a href={`/session/${session.sessionId}`}><em>{"Click to View"}</em></a></td>
              </tr>
            ))}
          </tbody>
        </Table>
      :
        <h3 className="w-100">Loading...</h3>
      }
    </>
  )
}

const DashboardPage = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request("/spotify/tracking-all", null, "GET", true)
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
        
        {/*<Row className="d-flex mt-3">
          <Col md="8" className="d-flex ml-auto mr-auto">
            <iframe
              title="audio-player"
              className="m-auto"
              src={`${API_HOST}/player.html`}
              frameBorder="0"
              scrolling="no"
              width="600px"
              height="250px"
              style={{ borderRadius: "5px" }}
            />
          </Col>
        </Row>*/}
        <Row className="d-flex mt-3">
          <Col md="5" className="ml-auto mr-auto">
            {!state.loading && state.data ?
              <>
                {state.data.currentSong && state.data.isSessionActive ?
                  <SongCard song={state.data.currentSong} cardTitle={state.data.isPlaying ? "Now Playing" : "Paused..."} />
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
                  {state.data.previousSong && state.data.isSessionActive ?
                    <SongCard song={state.data.previousSong} cardTitle={"Previous Song..."} />
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
                  {state.data.isSessionActive ?
                    <>
                      <Row className="d-flex w-100">
                        <h3 className="w-100 text-center">Session Info</h3>
                        <Col md="5" className="ml-auto mr-2 d-flex flex-column">
                          <p>{`Start Time: ${new Date(state.data.startTime).toLocaleString()}`}</p>
                          <p>{`Songs Played: ${state.data.songList.length}`}</p>
                        </Col>
                        <Col md="5" className="ml-2 mr-auto d-flex flex-column">
                          <p>{`Total Time: ${convertSecToHMS(state.data.sessionLength)}`}</p>
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
                            {state.data.songList.map(({ song }, i) => (
                              <tr>
                                <th scope="row">{i+1}</th>
                                <td>{song.name}</td>
                                <td>{song.artists.map(a => a.name).join(", ")}</td>
                                <td>{song.album.name}</td>
                              </tr>
                            ))}
                            {state.data.songList.length === 0 &&
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
        <Row className="d-flex mt-3 mb-4">
          <Col md="10" className="ml-auto mr-auto">
            <h4 className="text-center mb-2">Recent Sessions</h4>
            <RecentSessions />
          </Col>
        </Row>
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