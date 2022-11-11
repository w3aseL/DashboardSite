import React from "react"
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { connect } from "react-redux"

import { Home, Error, Login, Dashboard, Song, Songs, Sessions, Session, Settings, Register, EditPortfolio, TestRoute, Stats, Metrics } from "./pages"
import { history } from "./helpers/history"
import { logoutUser } from "./redux/auth/actions"

/* Logout Component */
const LogoutComp = props => {
  const { loggedIn, dispatch } = props

  if(!loggedIn)
    history.push("/login")
  else
    dispatch(logoutUser())

  return (
    <>
      <h1 className="ml-auto mr-auto">Logging out...</h1>
    </>
  )
}

const mapStateToProps = state => ({ loggedIn: state.auth.loggedIn })

const Logout = connect(mapStateToProps)(LogoutComp)

const AuthRoute = ({ component: Component, loggedIn, ...rest }) => {
  return(
    <Route {...rest} render={props => 
      loggedIn ?
        <Component {...props} />
      :
        <Redirect to='/login' />
    } />
  )
}

const AuthorizedRoute = connect(mapStateToProps)(AuthRoute);

export const ROUTES = [
  {
    name: "Home",
    path: "/",
    exact: true,
    component: Home,
  },
  {
    name: "Home Redirect",
    path: "/home",
    component: () => <Redirect to="/" />
  },
  {
    name: "Login",
    path: "/login",
    component: Login,
  },
  {
    name: "Register",
    path: "/register",
    component: Register,
  },
  {
    name: "Logout",
    path: "/logout",
    component: Logout,
    auth: true
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    auth: true,
    component: Dashboard,
  },
  {
    name: "Songs",
    path: "/songs",
    auth: true,
    component: Songs
  },
  {
    name: "Song",
    path: "/song/:id",
    auth: true,
    component: Song
  },
  {
    name: "Sessions",
    path: "/sessions",
    auth: true,
    component: Sessions
  },
  {
    name: "Session",
    path: "/session/:id",
    auth: true,
    component: Session
  },
  {
    name: "Settings",
    path: "/settings",
    auth: true,
    component: Settings
  },
  {
    name: "EditPortfolio",
    path: "/edit-portfolio",
    auth: true,
    component: EditPortfolio
  },
  {
    name: "TestRoute",
    path: "/test",
    auth: true,
    component: TestRoute
  },
  {
    name: "Statistics",
    path: "/stats",
    auth: true,
    component: Stats
  },
  {
    name: "Metrics",
    path: "/metrics",
    auth: true,
    component: Metrics
  },
  {
    name: "Error",
    path: "**",
    component: Error
  }
]

export const Routing = (props) => {
  return (
    <Router history={history}>
      <Switch>
        {ROUTES.map(({name, path, exact, component, auth}, i) => 
          auth ?
            <AuthorizedRoute key={name} path={path} exact={exact} component={component} />
          :
            <Route key={name} path={path} exact={exact} component={component} />
        )}
      </Switch>
    </Router>
  )
}