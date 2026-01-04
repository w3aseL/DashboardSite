import React, { useState } from "react"
import classnames from "classnames"
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"

import { Layout } from "../../components"
import { TagTab } from "./TagTab"
import { PostTab } from "./PostTab"
import { AlbumTab } from "./AlbumTab"
import { PhotoTab } from "./PhotoTab"

const Photography = props => {
  const [state, setState] = useState({
    activeTab: 'photo-0'
  })
  const [tags, setTags] = useState([])
  const [posts, setPosts] = useState([])
  const [albums, setAlbums] = useState([])

  const setTab = tab => {
    setState({ ...state, activeTab: tab })
  }

  console.log({ tags, posts, albums, state })

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <Col md="10" className="ml-auto mr-auto mt-3">
            <h1 className="w-100 text-center">Photography Suite</h1>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'photo-0' })}
                  onClick={() => { setTab('photo-0') }}
                >
                  Tags
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'photo-1' })}
                  onClick={() => { setTab('photo-1') }}
                >
                  Posts
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'photo-2' })}
                  onClick={() => { setTab('photo-2') }}
                >
                  Albums
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'photo-3' })}
                  onClick={() => { setTab('photo-3') }}
                >
                  Photos
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={state.activeTab}>
              <TabPane tabId="photo-0">
                <TagTab updateTags={setTags} />
              </TabPane>
              <TabPane tabId="photo-1">
                <PostTab updatePosts={setPosts} />
              </TabPane>
              <TabPane tabId="photo-2">
                <AlbumTab updateAlbums={setAlbums} tags={tags} />
              </TabPane>
              <TabPane tabId="photo-3">
                <PhotoTab albums={albums} tags={tags} posts={posts} />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { Photography }

export default Photography