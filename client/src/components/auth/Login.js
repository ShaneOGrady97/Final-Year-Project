import React, { Component } from "react";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { MuiThemeProvider} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import theme from '../../Styles/theme.js';
import SignUpButton from '../../Styles/SignUpButton.js';
import LoginButton from '../../Styles/LoginButton.js';
import Span from '../../Styles/Span.js';
import { withRouter } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

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
    login: {
        marginTop: theme.spacing.unit * 3,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },

});

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {},
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

    onSubmit = e => {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

            axios
                .post("/api/users/login", userData)
                .then(res => {
                    // Save to localStorage
                    // Set token to localStorage
                    const { token } = res.data;
                    localStorage.setItem("jwtToken", token);
                    window.location.href = "./";
                })
                .catch(err =>
                    this.setState({
                        errors: err.response.data
                    }),
                );

    };


    routeChange() {
        let path = `/register`;
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
                            Login
        </Typography>

                        <form className={classes.form} onSubmit={this.onSubmit}>
                         
                            <FormControl margin="normal" required fullWidth >
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={this.state.email}
                                    error={errors.email}
                                    onChange={this.onChange}
                                    invalid={errors.email}
                                />
                                <Span component="span">
                                    {errors.email}
                                    {errors.emailnotfound}
                                </Span>
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
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
                                <Span component="span">
                                    {errors.password}
                                    {errors.passwordincorrect}
                                </Span>
                            </FormControl>
                        
                        

                                <Grid container spacing={0}>

                                    <Grid item xs={7}>
                                        <LoginButton
                                            type="submit"

                                            className={classes.login}
                                            style={{
                                                borderRadius: 25,
                                                width: '120px',
                                                outline: 'thin',
                                            }}
                                        >
                                            Login
                                    </LoginButton>
                                    </Grid>

                                    <Grid item xs={5} align="right" >
                                        <SignUpButton onClick={this.routeChange.bind(this)}
                                        

                                            className={classes.submit}
                                            style={{
                                                borderRadius: 25,
                                                outline: 'thin',

                                            }}
                                        >
                                            Register
                                     </SignUpButton>
                                    </Grid>


                                </Grid>
                     
                        </form>

                    </MuiThemeProvider>

                </Paper>

            </main>
        );
    }
}


Login.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default (withRouter(withStyles(styles)(Login)));