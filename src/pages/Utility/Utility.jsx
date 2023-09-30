import React, { useState } from "react";
import classnames from "classnames";
import { Table, Container, Row, Col, Button, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { Spotify } from "react-spotify-embed";

import { request } from "../../api";

import { Layout } from "../../components";

const GenPlaylist = () => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    selectedOption: 0,
    options: [],
    loadedOptions: false
  });

  if (!state.loadedOptions && !state.loading && state.loadedOptions == []) {
    setState({...state, loading: true });

    request('/spotify/playlist', null, "GET")
    .then(res => setState({ ...state, loading: false, loadedOptions: true, options: res.data }))
    .catch(err => {
      console.log(err);
      setState({ ...state, loading: false, loadedOptions: true });
    });
  }

  const generatePlaylist = e => {
    e.preventDefault();

    setState({ ...state, loading: true });
    
    request('/spotify/playlist', { playlistOption: (state.selectedOption - 1) }, "POST", true)
    .then(res => setState({ ...state, loading: false, data: res.data }))
    .catch(err => setState({ ...state, loading: false, error: err }));
  }

  console.log(state);

  return (
    <>
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="12" className="d-flex">
            <h4 className="w-100"><em>Generate Playlists</em></h4>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          <Col md="8">
            <Form>
              <FormGroup>
                <Label for="selectedOption">
                  Generatable Playlists
                </Label>
                <Input
                  type="select"
                  name="selectedOption"
                  value={state.selectedOption}
                  onChange={e => setState({ ...state, selectedOption: e.target.value })}
                >
                    <option value={0}></option>
                    {state.options.map((v, i) => 
                      <option value={i+1}>{v}</option>
                    )}
                </Input>
              </FormGroup>
            </Form>
          </Col>
          <Col className="d-flex">
            <Button
              onClick={generatePlaylist}
              disabled={state.selectedOption == 0 || state.loading}
              color="success"
              className="ml-auto mr-0 mt-auto mb-auto"
            >
              Generate
            </Button>
          </Col>
        </Row>
        {state.data != null &&
          <Row className="d-flex">
            <Col md="8" className="ml-auto mr-auto d-flex flex-column">
              <p className="text-success text-center w-100">Successfully generated playlist!</p>
              <Spotify className="ml-auto mr-auto" width="100%" height="500" link={`https://open.spotify.com/playlist/${state.data.uri.split(":")[2]}`}></Spotify>
            </Col>
          </Row>
        }
      </Container>
    </>
  );
};

const Utility = () => {
  const [state, setState] = useState({
    activeTab: 'util-0'
  });

  const setTab = tab => {
    setState({ ...state, activeTab: tab })
  }

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <Col md="10" className="ml-auto mr-auto mt-3">
            <h1 className="w-100 text-center">Spotify Utility</h1>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'util-0' })}
                  onClick={() => { setTab('util-0') }}
                >
                  Playlists
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={state.activeTab}>
              <TabPane tabId="util-0">
                <GenPlaylist />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export { Utility }

export default Utility