import React from 'react';

import { withFirebase } from '../Firebase';
import Button from "@material-ui/core/Button"

const SignOutButton = ({ firebase }) => (
  <Button color="inherit" type="button" onClick={firebase.doSignOut}>
    Logout
  </Button>
);

export default withFirebase(SignOutButton);