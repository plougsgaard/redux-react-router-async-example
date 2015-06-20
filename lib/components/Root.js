import React, { PropTypes } from 'react'
import { Redirect, Router, Route } from 'react-router'
import { Provider } from 'redux/react'
import { createDispatcher, createRedux, composeStores } from 'redux'
import { loggerMiddleware, thunkMiddleware } from '../middleware'
import { About, Application, Github, GithubRepo, GithubUser } from './'
import * as stores from '../stores'

const dispatcher = createDispatcher(
  composeStores(stores),
  getState => [ thunkMiddleware(getState), loggerMiddleware ]
)
const redux = createRedux(dispatcher)

export default class Root extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render () {
    const { history } = this.props
    return (
      <Provider redux={redux}>
        {() =>
          <Router history={history}>
            <Route component={Application}>
              <Route path="about" component={About} />
              <Route path="stargazers" component={Github}>
                <Route name='repo' path=':username/:repo'
                  component={GithubRepo} />
                <Route name='user' path=':username' component={GithubUser} />
              </Route>
              <Redirect from="/" to="/stargazers/emmenko" />
            </Route>
          </Router>
        }
      </Provider>
    )
  }
}