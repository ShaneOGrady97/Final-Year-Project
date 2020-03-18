import React, { Component } from "react";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from "react-router-dom";
import { Typography, MuiThemeProvider, Button, Avatar } from "@material-ui/core";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import theme from '../../../Styles/Colour.js';
import greenTheme from '../../../Styles/greenTheme.js';
import Loader from '../../Loader/Loader.js';
import CreateButton from '../../../Styles/CreateButton.js';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';

import { green } from '@material-ui/core/colors';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(500 + theme.spacing.unit * 3 * 2)]: {
            width: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 6,
		marginBottom: theme.spacing.unit * 7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    title: {
        cursor: 'pointer', 
        color: 'white', 
        fontWeight: 'bold',  
        fontFamily: "'Montserrat', sans-serif",
    },
    small: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    dialogTitle: {
        padding: theme.spacing.unit,
        color: 'white',
        backgroundColor: green[500],
        fontFamily: 'sans-serif',
    },
    actions: {
        borderTop: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing.unit,
    },
    cancel: {
        marginLeft: theme.spacing.unit * 2,
    },
    post: {
        marginRight: theme.spacing.unit * 2,
    } 
    

});

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class ForumSection extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            openDialog: false,
            isDisabled: false,
            title: "",
            description: "",
        };
    }

    componentDidMount() {
        axios.get(`/api/comments/get/${this.props.match.params.section}`)
        .then(res => {
            const data = res.data;
            // Along with setting state append a random colour for the avatars
            this.setState({data: data});
            this.setState({loading: false});
        })
    }

    handleHome() {
        this.props.history.push('/forum');
    } 

    // Close Dialog when select "cancel" within it
    handleClose = () => {
        this.setState({
            openDialog: false
        });
       
    };

    handleClick= () => {
        this.setState({
            openDialog: true
        });
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit = e => {

        e.preventDefault();

        // Prevent users from sending the same message multiple times
        this.setState({
            isDisabled: true
        }); 


        const data = {
            section: this.props.match.params.section,
            author: this.props.user.name,
            title: this.state.title,
            description: this.state.description,
            colour: this.props.user.colour,
        };


        axios
            .post("/api/comments/create", data)
            .then(res => this.setState({
        
                isDisabled: false

            }))
            .catch(err =>
               console.log(err)
        );

        e.target.reset();

        window.location.href = "/forum/" + this.props.match.params.section;
   
    };

    render() {

       
        const { classes } = this.props;

        if(this.props.isLoggedIn === false){
            this.props.history.push('/');
          } 

        return (
            <main className={classes.main}>
                <CssBaseline />
                {this.state.loading ? <Loader /> : 
                <div>
                <MuiThemeProvider theme={theme}>
                <Paper className={classes.paper} >
                    <Grid container  >
                        <Grid item xs={2} sm={2} md={2} align="center" >
                           <Button style={{outline: "thin"}} onClick={() => this.handleHome()}   variant="contained" color="primary" >
                            Home
                          </Button> 
                        </Grid>
                        <Grid item xs={8} sm={8} md={8} align="center" >
                          <div></div>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} align="center" >
                           <CreateButton style={{outline: "thin"}} onClick={() => this.handleClick()}  variant="contained" >
                            Post
                          </CreateButton> 
                        </Grid>
                    </Grid>
                   
                    {this.state.data.length === 0 && this.state.loading === false ? 
                                    <Grid container spacing={0}>
                                        <Grid item xs={0} sm={3} md={3} >
                                        <div></div>
                                       </Grid>
                                       <Grid item xs={12} sm={6} md={6} >
                                         <Typography variant="subtitle1" style={{marginTop: 10}}>There are no posts. <span onClick={() => this.handleClick()} style={{cursor:'pointer', color:'#0066ff'}}>Would you like to create one?</span></Typography>
                                       </Grid>
                                       <Grid item xs={0} sm={3} md={3} >
                                        <div></div>
                                       </Grid>
                                   </Grid>
                    :
                    <Table fixedHeader={true}>
                    <TableHead>
                        <TableRow> 
                        <TableCell>Post</TableCell>
                        <TableCell >Creator</TableCell>
                        <TableCell align="right" >Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.data.map((n, i) => {
                        return (
                        <TableRow key={i}>
                             <TableCell >
                               <Typography variant="subtitle1">  <span style={{cursor:'pointer', color:'#0066ff'}} onClick={() => {this.props.history.push('/forum/' + this.props.match.params.section + '/' + n._id)}} >{n.title}</span> </Typography>
                            </TableCell>
                             <TableCell  >
                                 <Tooltip title={n.author} placement="right" >
                                 <Avatar className={classes.small} style={{backgroundColor: n.colour}}>{n.author.charAt(0).toUpperCase()}</Avatar>
                                 </Tooltip>
                                 </TableCell>
                             <TableCell align="right" >{n.date}</TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                    </Table>
                    }
                    
                </Paper>
                </MuiThemeProvider>
                <MuiThemeProvider theme={greenTheme}>
                    <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth = "true"
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.openDialog}
                    >
                    <form onSubmit={this.onSubmit}>
                        <h6 className={classes.dialogTitle} id="customized-dialog-title" onClose={this.handleClose}>
                            Create Post
                        </h6>
                    <DialogContent>   
                        <FormControl margin="normal" required fullWidth >
                            <TextField
                                required
                                id="title"
                                label="Title"
                                margin="normal"
                                variant="outlined"
                                onChange={this.onChange}
                            />   
                        </FormControl>
                        <FormControl margin="normal" required fullWidth >
                            <TextField
                                required
                                id="description"
                                label="Description"
                                multiline
                                margin="normal"
                                variant="outlined"
                                rows="8"
                                onChange={this.onChange}
                            />
                        </FormControl> 
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        <Grid container spacing={0}>
                            <Grid item xs={8} align="left">
                                <Button style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.cancel} size="small" variant="outlined" color="primary" onClick={this.handleClose} >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={4} align="right">
                                <CreateButton disabled={this.state.isDisabled} type="submit" style={{ width: '30px', height: '30px', outline: "thin dotted" }} className={classes.post} size="small" variant="contained"  color="primary">
                                    Post
                                </CreateButton>
                            </Grid>
                        </Grid>
                    </DialogActions>
                     </form>
                    </Dialog>
                </MuiThemeProvider>
                </div>
                 }
            </main>
        );
    }
}

ForumSection.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (withRouter(withStyles(styles)(ForumSection)));