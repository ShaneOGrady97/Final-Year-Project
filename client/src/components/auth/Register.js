import React, { Component } from "react";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../../Styles/theme.js';
import SignUpButton from '../../Styles/SignUpButton.js';
import LoginButton from '../../Styles/LoginButton.js';
import Span from '../../Styles/Span.js';
import Grid from '@material-ui/core/Grid';
import { withRouter } from "react-router-dom";
import axios from "axios";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import { Button } from "@material-ui/core";

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(500 + theme.spacing.unit * 3 * 2)]: {
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 6,
		marginBottom: theme.spacing.unit * 7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit * 3,

    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,

    },
    submit: {
   
        marginTop: theme.spacing.unit * 3,
    },
    login: {
        marginTop: theme.spacing.unit * 3,      
    },
    dialogTitle: {
        padding: theme.spacing.unit,
        color: 'white',
        backgroundColor: '#2196f3',
        fontFamily: 'sans-serif',
    },
    description: {
        padding: theme.spacing.unit * 2,
        color: '#2892d7',
        fontFamily: 'sans-serif'
    },
    actions: {
        borderTop: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing.unit,
    },
});

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {},
            open: "",
            isDisabled: false
        };
    }

    componentDidMount(){
        //Redirect back to home page if already logged in
        if(this.props.isLoggedIn === true){
            this.props.history.push("/");
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    handleClose = () => {
        this.setState({
            open: false
        });
       
    };

    onSubmit = e => {

        e.preventDefault();

        this.setState({
            isDisabled: true
        })

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        axios
        .post("/api/users/register", newUser)
        .then(res => 

            this.setState({
                open: true,
                isDisabled: false
            }))

        .catch(err =>
            this.setState({
                isDisabled: false,
                errors: err.response.data
            }),
        ); 
    };

    routeChange() {
        let path = `/login`;
        this.props.history.push(path);
    }

    render() {

        const { errors } = this.state;

        const { classes } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline />

                <Paper className={classes.paper}>
                    <MuiThemeProvider theme={theme}>

                        <Typography component="h1" variant="h5">
                            Register
        </Typography>

                        <form className={classes.form} onSubmit={this.onSubmit}>
                            <FormControl margin="normal"  fullWidth >
                                <InputLabel htmlFor="name">Username</InputLabel>
                                <Input
                                    autoFocus
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                            
                                    value={this.state.name}
                                    error={errors.name}
                                    onChange={this.onChange}
                                    invalid={errors.name}
                                />
                                <Span className={classes.span} component="span"> {errors.name} </Span>
                               
                            </FormControl>
                            <FormControl margin="normal"  fullWidth >
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                           
                                    value={this.state.email}
                                    error={errors.email}
                                    onChange={this.onChange}
                                    invalid={errors.email}
                                />
                                <Span component="span"> {errors.email} </Span>
                            </FormControl>
                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={this.state.password}
                                    error={errors.password}
                                    onChange={this.onChange}
                                    invalid={errors.password}
                                />
                                <Span component="span"> {errors.password} </Span>
                            </FormControl>
                            <FormControl margin="normal" fullWidth >
                                <InputLabel htmlFor="password2">Confirm Password</InputLabel>
                                <Input
                                    id="password2"
                                    name="password2"
                                    autoComplete="password2"
                                    type="password"
                                    value={this.state.password2}
                                    error={errors.password2}
                                    onChange={this.onChange}
                                    invalid={errors.password2}
                                />
                                <Span component="span"> {errors.password2} </Span>
                            </FormControl>

                        

                            <Grid container spacing={0}>

                                <Grid item xs={7} >
                                  <SignUpButton
                                type="submit"
                                className={classes.submit}
                                disabled={this.state.isDisabled}
                                style={{
                                    borderRadius: 25,
                                    outline: 'none',
                                   
                                }}
                                  >
                                Register
                                     </SignUpButton>
                                    </Grid>

                                <Grid item xs={5}  align="right" >
                                        <LoginButton onClick={this.routeChange.bind(this)}
                                   

                                        className={classes.login}
                                        style={{
                                            borderRadius: 25,
                                            width: '120px',
                                            outline: 'none',


                                        }}
                                    >
                                        Login
                                    </LoginButton>
                                    </Grid>
                       

                                </Grid>

                              
                        </form>

                        <Dialog
                                TransitionComponent={Transition}
                                keepMounted
                                fullWidth = "true"
                                maxWidth= "xs"
                                onClose={this.handleClose}
                                aria-labelledby="customized-dialog-title"
                                open={this.state.open}
                            >
                                <h6 className={classes.dialogTitle} id="customized-dialog-title" onClose={this.handleClose}>
                                    Success
                               </h6>
                                <DialogContent className={classes.description}>
                                <div style={{textAlign: 'center'}}>
                                    <h6 gutterBottom>
                                        Please verify your email address
                                    </h6>
                                </div>
                                </DialogContent>
                                <DialogActions className={classes.actions}>
                                    <Button style={{ width: '30px', height: '30px' }} size="small" variant="contained" color="primary" onClick={this.handleClose.bind(this)} >
                                        Close
                                     </Button>
                                </DialogActions>
                            </Dialog>

                    </MuiThemeProvider>
                </Paper>
            </main>
        );
    }
}


Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (withRouter(withStyles(styles)(Register)));