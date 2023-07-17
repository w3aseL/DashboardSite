import React, { useState } from "react"
import { Container, Row, Col, Table } from "reactstrap"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { request } from "../../api"
import { Layout } from "../../components"

const Links = () => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const refreshData = () => {
    setState({ ...state, loading: true })

    request(`/link`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  if(!state.loading && !state.data && !state.error) {
    refreshData()
  }

  console.log(state)

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <Col md="8" className="ml-auto mr-auto mt-4">
            <h2 className="text-center mt-2">Linktree Links</h2>
            {!state.loading && state.data ?
              <Table>
                <thead>
                  <th>#</th>
                  <th>Link Name</th>
                  <th>Link URL</th>
                  <th>Logo URL</th>
                  <th>Logo Alt</th>
                  <th>Alt Icon</th>
                </thead>
                <tbody>
                  {state.data.map((link, i) => (
                    <tr>
                      <th scope="row">{i+1}</th>
                      <td>{link.linkName}</td>
                      <td>{link.linkUrl}</td>
                      <td>{link.logoUrl}</td>
                      <td>{link.logoAlt}</td>
                      <td><FontAwesomeIcon icon={["fab", link.logoAlt]} /></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            :
              <h1 className="w-100">Loading...</h1>
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { Links }

export default Links