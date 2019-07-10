import React, {Component} from 'react';
//import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
//import Checkbox from '@material-ui/core/Checkbox';
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

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Boilerplate portal with  '}
      <Link color="inherit" href="https://www.google.com/">
        Google
      </Link>
      {' link.'}
    </Typography>
  );
};

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
      color: theme.palette.secondary,
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
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = {...INITIAL_STATE};
  }

  onSubmit = event => {
    event.preventDefault();
    const {email, password} = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({INITIAL_STATE});
        const currentUser = this.props.firebase.auth.currentUser;
        const userId = currentUser ? currentUser.uid : "na";
        // check is user is 'admin'
        const getData = (snapshot) => {
          return (snapshot.val() && snapshot.val().admin);
        };
        this.props.firebase.db.ref('/users/' + userId).once('value').then(getData)
          .then(admin => {
              if (!!admin) {
                this.props.history.push(ROUTES.SIGN_UP);
              } else {
                this.props.history.push(ROUTES.DEMO);
              }
            }
          )
      })
      .catch(error => {
        this.setState({error});
      });

    return false;
  };

  onChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  componentDidMount() {
    this.unsubscribe = this.props.firebase.auth.onAuthStateChanged(currentUser => {
      this.setState({currentUser});
      if (currentUser) {
        this.props.history.push(ROUTES.DEMO);
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid = password === '' || email === '';

    const {classes} = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Paper className={classes.paper}>
          {/*<Avatar className={classes.avatar} src={logo}>*/}
          {/*</Avatar>*/}
          <Typography component="h1" variant="h5">
            Sign in
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
              autoComplete="email"
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
              autoComplete="current-password"
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
              Sign In
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
      </Container>
    );
  }
}

// less verbose?
export default compose(withRouter, withFirebase, withStyles(classes))(SignInForm);

