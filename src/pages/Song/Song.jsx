import React, { useState } from "react"
import { Container, Row, Col, Card } from "reactstrap"

import { request } from "../../api"
import { Layout, SongCard } from "../../components"
import { history } from "../../helpers/history"

const Song = props => {
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

    request(`/spotify/data/song/${id}`, null, "GET", true)
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
          <Col md="8" className="ml-auto mr-auto mt-3">
            {!state.loading && state.data ?
              <SongCard cardTitle="Song Info" song={state.data} />
            :
              <h1 className="w-100">Loading...</h1>
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { Song }

export default Song