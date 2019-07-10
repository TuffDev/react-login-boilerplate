import React, {Component} from 'react';
import {withFirebase} from '../Firebase';
import {withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {withStyles} from "@material-ui/core";
import {compose} from 'recompose';

import CircularProgress from '@material-ui/core/CircularProgress'
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SignOutButton from '../SignOut';
import logo from './testImg.png'

const classes = theme => {
  return ({
    '@global': {
      body: {
        backgroundColor: theme.palette.secondary
      },
    },
    root: {
      flexGrow: 1,
    },
    toolbar: {
      backgroundColor: theme.palette.secondary
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      marginLeft: theme.spacing(3),
      align: 'center'
    },
    logo: {
      width: 182,
      height: "auto",
    }
  })
};

class DemoPage extends Component {

  constructor(props) {
    super(props);
    this.state =
      {url: "", currentUser: this.props.firebase.auth.currentUser, token: '', groupId: '', reportId: '', type: ''};
  }

  componentDidMount() {
    this.unsubscribe = this.props.firebase.auth.onAuthStateChanged(currentUser => {
      this.setState({currentUser});
      if (!currentUser) {
        this.props.history.push(ROUTES.SIGN_IN);
        return false;
      }
      const userId = currentUser ? currentUser.uid : "na";
      // pull report data from user db
      const getData = (snapshot) => {
        const groupId = (snapshot.val() && snapshot.val().groupId);
        this.setState({groupId});
      };
      this.props.firebase.db.ref('/users/' + userId).once('value').then(getData)
    });
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {classes} = this.props;
    const {ready} = this.state;
    // Load page if content is ready
    if (ready) {
      return (
        <div>
          <AppBar position="static">
            <Toolbar className={classes.toolbar}>
              <img className={classes.logo} src={logo}/>
              <Typography variant="h6" className={classes.title}>
                Header Title
              </Typography>
              <SignOutButton/>
            </Toolbar>
          </AppBar>
        </div>
      )
    } else {
      return (
        <CircularProgress/>
      )
    }
  }
}

export default compose(withRouter, withFirebase, withStyles(classes))(DemoPage);
