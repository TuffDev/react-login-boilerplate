import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './index.css';
import SignIn from './components/SignIn'
import * as ROUTES from './constants/routes';
import {withAuthentication} from './components/Session';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Navigation from './components/DemoScreen';
import SignUp from './components/SignUp';

const customTheme = createMuiTheme({
  // todo: make a wrapper component so you don't clutter up App
  palette: {
    primary: {
      main: '#101820'
    },
    secondary: {
      main: '#5e5e5e',
      contrastText: '#101820',
    },
  },
});

const App = () => (
    <Router>
      <ThemeProvider theme={customTheme}>
        <div>
            <Route exact path={ROUTES.SIGN_IN} component={SignIn}/>
            <Route exact path={ROUTES.DEMO} component={Navigation}/>
            <Route exact path={ROUTES.SIGN_UP} component={SignUp}/>
        </div>
        </ThemeProvider>
    </Router>
);

export default withAuthentication(App);
