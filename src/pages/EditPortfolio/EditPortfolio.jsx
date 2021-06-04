import React, { useState } from "react"
import classnames from "classnames"
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"

import { request } from "../../api"
import { Layout } from "../../components"
import { history } from "../../helpers/history"

import { EducationTab } from "./EducationTab"
import { ImageTab } from "./ImageTab"
import { ResumeTab } from "./ResumeTab"
import { ToolTab } from "./ToolTab"

const EditPortfolio = props => {
  const [state, setState] = useState({
    activeTab: 'editPortfolio-0'
  })

  const setTab = tab => {
    setState({ ...state, activeTab: tab })
  }

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <Col md="10" className="ml-auto mr-auto mt-3">
            <h1 className="w-100 text-center">Edit Portfolio</h1>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'editPortfolio-0' })}
                  onClick={() => { setTab('editPortfolio-0') }}
                >
                  Education
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'editPortfolio-1' })}
                  onClick={() => { setTab('editPortfolio-1') }}
                >
                  Tools
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'editPortfolio-2' })}
                  onClick={() => { setTab('editPortfolio-2') }}
                >
                  Projects
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'editPortfolio-3' })}
                  onClick={() => { setTab('editPortfolio-3') }}
                >
                  Positions
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'editPortfolio-4' })}
                  onClick={() => { setTab('editPortfolio-4') }}
                >
                  Resumes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'editPortfolio-5' })}
                  onClick={() => { setTab('editPortfolio-5') }}
                >
                  Images
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={state.activeTab}>
              <TabPane tabId="editPortfolio-0">
                <EducationTab />
              </TabPane>
              <TabPane tabId="editPortfolio-1">
                <Row>
                  <ToolTab />
                </Row>
              </TabPane>
              <TabPane tabId="editPortfolio-2">
                <Row>
                  <Col sm="12">
                    <h4>TBD</h4>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="editPortfolio-3">
                <Row>
                  <Col sm="12">
                    <h4>TBD</h4>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="editPortfolio-4">
                <Row>
                  <Col sm="12">
                    <ResumeTab />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="editPortfolio-5">
                <Row>
                  <Col sm="12">
                    <ImageTab />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { EditPortfolio }

export default EditPortfolio