import React from "react"
import { Container, Row, Col, Jumbotron, Button } from "reactstrap"

import { Layout } from "../../components"

const HomeComponent = props => {
  return (
    <Layout>
      <Container className="mt-5">
        <Row className="d-flex">
          <Col md="10" className="ml-auto mr-auto">
            <Jumbotron>
              <h4><em>Welcome to...</em></h4>
              <h1 className="display-3">The Dashboard</h1>
              <p className="lead">
                <em>The Dashboard</em> is a site built for monitoring statistics, modifying other
                site information, and other things!
              </p>
              <hr className="my-2" />
              <p>This site was created by Noah Templet. Learn more below!</p>
              <p className="lead">
                <Button href="https://noahtemplet.dev" target="_blank">Learn More</Button>
              </p>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default HomeComponent

export { HomeComponent as Home }