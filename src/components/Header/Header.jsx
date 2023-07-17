import React from "react"
import { connect } from "react-redux"
import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { Avatar } from "@material-ui/core"

class HeaderComp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  render() {
    const { loggedIn, user } = this.props

    return (
      <Navbar color="light" dark expand="light">
        <Container>
          <NavbarBrand href="/"><h2 className="text-dark">The Dashboard</h2></NavbarBrand>
            <Nav className="ml-auto mr-0" navbar>
              {loggedIn ?
                <>
                  {!user ?
                    <p>Loading...</p>
                    :
                    <Dropdown isOpen={this.state.isOpen} toggle={e => this.setState({ isOpen: !this.state.isOpen })}>
                      <DropdownToggle tag="div" carat>
                        <Avatar 
                          src={user.avatar_url ? `${user.avatar_url}` : ""}
                        >
                          {`${user.username.charAt(0)}`}
                        </Avatar>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>{user.username}</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem><NavLink className="text-dark" href="/dashboard">Dashboard</NavLink></DropdownItem>
                        <DropdownItem><NavLink className="text-dark" href="/songs">Songs</NavLink></DropdownItem>
                        <DropdownItem><NavLink className="text-dark" href="/sessions">Sessions</NavLink></DropdownItem>
                        <DropdownItem><NavLink className="text-dark" href="/stats">Statistics</NavLink></DropdownItem>
                        <DropdownItem><NavLink className="text-dark" href="/edit-portfolio">Edit Portfolio</NavLink></DropdownItem>
                        <DropdownItem><NavLink className="text-dark" href="/links">Edit Linktree</NavLink></DropdownItem>
                        <DropdownItem><NavLink className="text-dark" href="/settings">Settings</NavLink></DropdownItem>
                        <DropdownItem><NavLink className="text-dark" href="/logout">Logout</NavLink></DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  }
                </>
              :
              <NavItem>
                <NavLink className="text-dark" href="/login">Login</NavLink>
              </NavItem>
            }
          </Nav>
        </Container>
      </Navbar>
    )
  }
}

const mapStateToProps = state => {
  const { loggedIn, user } = state.auth

  return { loggedIn, user }
}

const Header = connect(mapStateToProps)(HeaderComp)

export { Header }

export default Header