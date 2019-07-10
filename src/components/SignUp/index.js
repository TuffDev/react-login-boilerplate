import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import {AuthUserContext, withAuthorization} from '../Session';

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Sign up boilerplate for  '}
      <Link color="inherit" href="https://www.google.com/">
        Google
      </Link>
      {' link.'}
    </Typography>
  );
}

const classes = theme => {
  return ({
    '@global': {
      body: {
        backgroundColor: theme.palette.secondary
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(5),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    errorPaper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#FFBABA',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.grey,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: theme.palette.primary.main,
    },
  })
};

const INITIAL_STATE = {
  email: '',
  password: '',
  url: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {...INITIAL_STATE};
  }

  onSubmit = event => {
    // override default form submission
    event.preventDefault();

    const {email, password, url} = this.state;

    const urlData = this.parseURL(url);
    // Check URL and throw error if invalid
    if (!urlData) {
      this.setState({error: {message: "Invalid URL"}});
      return false;
    }
    const {groupId, reportId, type} = urlData;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            email,
            url,
            groupId,
            reportId,
            type,
            admin: false  // admin can only be added from firebase
          });
      })
      .then(() => {
        this.setState({INITIAL_STATE});
        this.props.history.push(ROUTES.SIGN_IN);
      })
      .catch(error => {
        this.setState({error});
      });
    return false;
  };

  onChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  render() {
    const {
      email,
      password,
      url,
      error,
    } = this.state;

    const isInvalid = password === '' || email === '' || url === '';

    const {classes} = this.props;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h5">
                Create a new user
              </Typography>
              <form onSubmit={this.onSubmit} className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  value={password}
                  onChange={this.onChange}
                  label="Password"
                  type="password"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="url"
                  value={url}
                  onChange={this.onChange}
                  label="URL"
                  type="URL"
                />
                {/*<FormControlLabel*/}
                {/*  control={<Checkbox value="remember" color="primary" />}*/}
                {/*  label="Remember me"*/}
                {/*/>*/}
                <Button
                  disabled={isInvalid}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Create Account
                </Button>
                {/*<Grid container>*/}
                {/*  <Grid item xs>*/}
                {/*    <Link href="#" variant="body2">*/}
                {/*      Forgot password?*/}
                {/*    </Link>*/}
                {/*  </Grid>*/}
                {/*  <Grid item>*/}
                {/*    <Link href="#" variant="body2">*/}
                {/*      {"Don't have an account? Sign Up"}*/}
                {/*    </Link>*/}
                {/*  </Grid>*/}
                {/*</Grid>*/}
                {error && <Paper className={classes.errorPaper}>{error.message}</Paper>}
              </form>
            </Paper>
            <Box mt={3}>
              <MadeWithLove/>
            </Box>
          </Container>)}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;
// less verbose?
export default compose(withAuthorization(condition), withRouter, withFirebase, withStyles(classes))(SignUpForm);