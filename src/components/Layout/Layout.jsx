import React from "react"

import "./Layout.scss"

import { ROUTES } from "../../routes"
import { Header } from "../Header"
import { Footer } from "../Footer"

class Layout extends React.Component {
  render() {
    const { children, noHeader, noFooter } = this.props

    return (
      <div className="content d-flex flex-column">
        {!noHeader && <Header routes={ROUTES} style={{ flex: "0 1 auto" }} />}
        <div style={{ flex: "1 1 auto" }}>
          {children}
        </div>
        {!noFooter && <Footer style={{ flex: "0 1 auto" }} />}
      </div>
    )
  }
}

Layout.defaultProps = {
  noHeader: false,
  noFooter: false
}

export { Layout }

export default Layout