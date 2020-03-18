import React, { Component } from "react";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';


import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import { withRouter } from "react-router-dom";
import axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import SubmitButton from '../../Styles/SignUpButton.js';
import theme from '../../Styles/theme.js';


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
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,

    },
    submit: {
        marginTop: theme.spacing.unit * 3,

    },
    login: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 7.5,

    },
    social: {
        marginTop: theme.spacing.unit
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
    cancel: {
        marginRight: theme.spacing.unit * 5,
    },
    home: {
        marginRight: theme.spacing.unit * 11.5,
    }

});

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class Contact extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            message: "",
            open: "",
            isDisabled: false,
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }




    handleClose = () => {
        this.setState({
            open: false
        });
       
    };

    homeRedirect = () => {
        this.setState({
            open: false
        });
        this.props.history.push('/');
    };

    onChange = e => {


        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        
        e.preventDefault();
     
        // Prevent users from sending the same message multiple times
        this.setState({
            isDisabled: true
        }); 


        const data = {
            name: this.state.name,
            email: this.state.email,
            message: this.state.message
        };

        axios
            .post("/api/contact/contact", data)
            .then(res => this.setState({
        
                open: true,
                isDisabled: false

            }))
            .catch(err =>
               console.log(err)
        );

        e.target.reset();
   

    };
    

    render() {

       
        const { classes } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <MuiThemeProvider theme={theme}>

                        <Typography component="h1" variant="h5">
                            Contact
        </Typography>

                        <form className={classes.form} onSubmit={this.onSubmit} >
                           
                            <FormControl margin="normal" required fullWidth >

                                <TextField
                                    required
                                    id="name"
                                    label="Name"
                                    autoFocus
                              
                                    margin="normal"
                                    variant="outlined"
                                    onChange={this.onChange}
                                />
                             
                            </FormControl>
                          
                            <FormControl margin="normal" required fullWidth >

                                <TextField
                                    required
                                    id="email"
                                    label="Email"
                              
                                    type="email"
                               
                                    autoComplete="email"
                                    margin="normal"
                                    variant="outlined"

                                    onChange={this.onChange}
                                />
                              
                            </FormControl>

                            <FormControl margin="normal" required fullWidth >

                                <TextField
                                    required
                                    id="message"
                                    label="Message"

                                    multiline
                                    
                                    margin="normal"
                                    variant="outlined"

                                    onChange={this.onChange}
                                />

                                </FormControl>


                                        <SubmitButton
                                            type="submit"
                                            fullWidth

                                            disabled={this.state.isDisabled}
                                
                                            className={classes.submit}
                                            style={{
                                                borderRadius: 25,
                                             
                                                outline: 'none',

                                            }}
                                        >
                                            Submit
                                     </SubmitButton>
                              
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
                                    Message Sent
                               </h6>
                                <DialogContent className={classes.description}>
                                <div style={{textAlign: 'center'}}>
                                    <h6 gutterBottom>
                                        Return to home page?
                                    </h6>
                                </div>
                                </DialogContent>
                                <DialogActions className={classes.actions}>
                                    <Button style={{ width: '30px', height: '30px' }} className={classes.cancel} size="small" variant="outlined" color="primary" onClick={this.handleClose.bind(this)} >
                                        Cancel
                                     </Button>
                                    <Button style={{ width: '30px', height: '30px' }} className={classes.home} size="small" variant="contained" onClick={this.homeRedirect.bind(this)}  color="primary">
                                        Home
                                     </Button>
                                </DialogActions>
                            </Dialog>

                    </MuiThemeProvider>
                </Paper>
            </main>
        );
    }
}


Contact.propTypes = {
    classes: PropTypes.object.isRequired,
};



export default (withRouter(withStyles(styles)(Contact)));