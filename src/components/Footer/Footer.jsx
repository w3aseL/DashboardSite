import React from "react"
import { connect } from "react-redux"

import { Navbar, Container, Row, Col } from "reactstrap"
 
class FooterComp extends React.Component { 
  render() {
    return (
      <Navbar color="light" light>
        <Container className="mt-2 mb-2">
          <Row className="d-flex w-100 ml-auto mr-auto">
            <Col xs="12" md="6" className="d-flex justify-content-center justify-content-md-start">

            </Col>
            <Col xs="12" md="6" className="mt-3 mt-md-auto mb-auto">
              <p className="mt-auto mb-auto text-center text-md-right">The Dashboard</p>
            </Col>
          </Row>
        </Container>
      </Navbar>
    )
  }
}

const mapStateToProps = state => ({

})

const Footer = connect(mapStateToProps)(FooterComp)

export { Footer }

export default Footer