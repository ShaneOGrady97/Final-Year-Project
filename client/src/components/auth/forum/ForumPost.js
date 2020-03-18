import React, { Component } from "react";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from "react-router-dom";
import { Typography, MuiThemeProvider, Button, Divider, Avatar } from "@material-ui/core";
import axios from 'axios';
import { red, green} from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import theme from '../../../Styles/theme.js';
import Loader from '../../Loader/Loader.js';
import Delete from '@material-ui/icons/Delete';
import Reply from '@material-ui/icons/Reply';
import Edit from '@material-ui/icons/Edit';
import greenTheme from '../../../Styles/greenTheme.js';
import redTheme from '../../../Styles/redTheme.js';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import CreateButton from '../../../Styles/CreateButton.js';
import FormControl from '@material-ui/core/FormControl';


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
    size: {
        width: theme.spacing.unit * 6,
        height: theme.spacing.unit * 6,
    },
    icon: {
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    option: {
        display: 'inline-block',
        verticalAlign: 'middle',
        color: '#0066ff',
        cursor: 'pointer'
    },
    dialogTitle: {
        padding: theme.spacing.unit,
        color: 'white',
        backgroundColor: green[500],
        fontFamily: 'sans-serif',
    },
    dialogTitleDelete: {
        padding: theme.spacing.unit,
        color: 'white',
        backgroundColor: red[500],
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
    },
    cancelDelete: {
        marginRight: theme.spacing.unit * 5,
    },
    delete: {
        marginRight: theme.spacing.unit * 11.5,
    },
    description: {
        padding: theme.spacing.unit * 2,
    },



});

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class ForumPost extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            dataReplies: [],
            loading: true,
            colour: "",
            openDialogReply: false,
            openDialogEdit: false,
            openDialogDelete: false,
            openDialogDeleteReply: false,
            openDialogEditReply: false,
            isDisabled: false,
            title: "",
            description: "",
            descriptionReply: "",
            replyID: "",
            originalAuthor: "",
            replyTo: "",
        };
    }

    componentDidMount() {


            Promise.all([
            axios.get(`/api/comments/get/${this.props.match.params.section}/${this.props.match.params.post}`),
            axios.get(`/api/comments/get/${this.props.match.params.section}/${this.props.match.params.post}/replies`)
            ]).then(([result1, result2]) => {
              const data = result1.data;
              const title = data.title;
              const description = data.description;
              this.setState({data: data, title: title, description: description});


              const dataReplies = result2.data;
              this.setState({dataReplies: dataReplies, loading: false});
            }).catch(err => {
                console.log(err);
            }); 
          

    }


    handleBack() {
        this.props.history.goBack();
    } 

    // Close Dialog when select "cancel" within it
    handleCloseReply = () => {
        this.setState({
            openDialogReply: false
        });
        
    };

    handleClickReply= (originalAuthor) => {
        this.setState({originalAuthor: originalAuthor})
        this.setState({
            openDialogReply: true,
        });
    }

    handleCloseEdit = () => {
        this.setState({
            openDialogEdit: false
        });
        
    };

    handleClickEdit= () => {
        this.setState({
            openDialogEdit: true,
        });
    }

    handleCloseDelete = () => {
        this.setState({
            openDialogDelete: false
        });
        
    };

    handleClickDelete= () => {
        this.setState({
            openDialogDelete: true,
        });
    }

    handleCloseDeleteReply = () => {
        this.setState({
            openDialogDeleteReply: false
        });
        
    };

    handleClickDeleteReply= (_id) => {
        this.setState({ replyID: _id})

        this.setState({
            openDialogDeleteReply: true,
        });
    }

    handleCloseEditReply= () => {
        this.setState({
            openDialogEditReply: false,
        });
    }

    handleClickEditReply= (description, _id) => {

        const des = description;

        var re = /@(\S+)\b/g;
        let userName = des.match(re);
        const desUpdated = des.replace(userName, "");
        const desWithoutUserName = desUpdated.replace(/\s/, "");
       
        this.setState({descriptionReply: desWithoutUserName, replyID: _id, replyTo: userName})

        this.setState({openDialogEditReply: true});
    }

    onChange = e => {
        this.setState({descriptionReply: e.target.value});
    }

    onChangeEditTitle = e => {  
          
          this.setState({title: e.target.value}); 
    } 

    onChangeEditDescription = e => {  

          this.setState({description: e.target.value});    
    } 

    onChangeEditDescriptionReply =  e => {  

        this.setState({descriptionReply: e.target.value}); 
    } 

    onSubmitReply = e => {

        e.preventDefault();
        
        // Prevent users from sending the same message multiple times
        this.setState({
            isDisabled: true
        }); 

        const descriptionValue = "@" + this.state.originalAuthor + " " + this.state.descriptionReply

        const data = {
            id: this.props.match.params.post,
            section: this.props.match.params.section,
            author: this.props.user.name,
            description: descriptionValue,
            colour: this.props.user.colour,
        };


        axios
            .post("/api/comments/createReply", data)
            .then(() => this.setState({
        
                isDisabled: false
        
            }))
            .catch(err =>
               console.log(err)
        );

        e.target.reset();

        window.location.href = "/forum/" + this.props.match.params.section + "/" + this.props.match.params.post;

    };

    onSubmitEdit = e => {
        
        e.preventDefault();

        // Prevent users from sending the same message multiple times
        this.setState({
            isDisabled: true
        }); 


        const data = {
            title: this.state.title,
            description: this.state.description,
        };


        axios
            .post(`/api/comments/update/${this.props.match.params.post}`, data)
            .then(() => this.setState({
        
                isDisabled: false
        
            }))
            .catch(err =>
               console.log(err)
        );

        e.target.reset();

        window.location.href = "/forum/" + this.props.match.params.section + "/" + this.props.match.params.post;

    };

    onSubmitEditReply = e => {

        e.preventDefault();

        // Prevent users from sending the same message multiple times
        this.setState({
            isDisabled: true
        }); 

        const descriptionValue = this.state.replyTo + " " + this.state.descriptionReply

        const data = {
            description: descriptionValue,
        };


        axios
            .post(`/api/comments/updateReply/${this.state.replyID}`, data)
            .then(() => this.setState({
        
                isDisabled: false
        
            }))
            .catch(err =>
               console.log(err)
        );

        e.target.reset();

        window.location.href = "/forum/" + this.props.match.params.section + "/" + this.props.match.params.post;

    };

    onSubmitDelete = () => {

        Promise.all([
        axios.delete(`/api/comments/delete/${this.props.match.params.section}/${this.props.match.params.post}`), 
        axios.delete(`/api/comments/delete/${this.props.match.params.section}/${this.props.match.params.post}/replies`)
        ]).then(() =>  this.props.history.goBack())
        .catch(err => console.log(err)); 
    };

    onSubmitDeleteReply = () => {

        axios
        .delete(`/api/comments/delete/${this.state.replyID}`)
        .then(window.location.href = "/forum/" + this.props.match.params.section + "/" + this.props.match.params.post)
        .catch(err =>
            console.log(err)
        );  
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
                <MuiThemeProvider theme={theme}>
                <Paper className={classes.paper} >
                    <Grid container spacing={0}>
                        <Grid item xs={12} >
                            <Typography style={{fontWeight: 'bold', fontSize: 26}} variant="h5" >{this.state.data.title}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: 20}}>
                        <Grid item xs={2} sm={2} md={2} align="left" >
                           <Button style={{outline: "thin"}} onClick={() => this.handleBack()}   variant="contained" color="primary" >
                            Back
                          </Button> 
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: 13}}>
                        <Grid item xs={12} align="left" >
                          <Divider />
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: 30}}>
                        <Grid item xs={2} sm={1} md={1} align="center" >
                            <Avatar className={classes.size} style={{backgroundColor: this.state.data.colour}}>{this.state.data.author.slice(0, 1).toUpperCase()}</Avatar>
                        </Grid>
                        <Grid item xs={7} sm={8} md={8} align="left" >
                            <Typography style={{fontWeight: 'bold'}} >{this.state.data.author}</Typography>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} align="right" >
                            <Typography style={{fontWeight: 'bold'}} >{this.state.data.date}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: -10}}>
                        <Grid item xs={2} sm={1} md={1} align="center" >
                         <div></div>
                        </Grid>
                        <Grid item xs={10}  sm={11} md={11} align="left" >
                            <Typography >{this.state.data.description}</Typography>
                        </Grid>
                    </Grid>
                    {this.state.data.author === this.props.user.name ?
                    <Grid container style={{marginTop: 10}}>
                        <Grid item xs={6} sm={8} md={9} >
                         <div></div>
                        </Grid>
                        <Grid item xs={3}  sm={2} md={2} align="right" >
                            <div>
                            <Delete className={classes.icon} />
                            <Typography onClick={() => this.handleClickDelete()} className={classes.option}>Delete</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={3}  sm={2} md={1} align="center" >
                            <div>
                            <Edit className={classes.icon} />
                            <Typography onClick={() => this.handleClickEdit()} className={classes.option}>Edit</Typography>
                            </div>
                        </Grid>
                    </Grid>
                    :
                    <Grid container style={{marginTop: 10}}>
                    <Grid item xs={10} sm={10} md={11} >
                        <div></div>
                    </Grid>
                    <Grid item xs={2}  sm={2} md={1} align="center" >
                        <div>
                        <Reply className={classes.icon} />
                        <Typography onClick={() => this.handleClickReply(this.state.data.author)} className={classes.option}>Reply</Typography>
                        </div>
                    </Grid>
                    </Grid>
                    }
                    <Divider style={{marginTop: 30}}/>


                    {/* Duplicate code for the replies section */}
                    {this.state.dataReplies.map((n, i) => {
                                // Regular expression to extract username and apply css to it
                                var re = /@(\S+)\b/g;
                                let oldstr = n.description.match(re);
                                let str = n.description.replace(oldstr, "");
                        return (
                    <Grid key={i} >
                    <MuiThemeProvider theme={greenTheme}>
                    <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth = "true"
                    onClose={this.handleCloseEditReply}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.openDialogEditReply}
                    >
                    <form onSubmit={this.onSubmitEditReply}>
                        <h6 className={classes.dialogTitle} id="customized-dialog-title" onClose={this.handleCloseEditReply}>
                            Edit reply
                        </h6>
                    <DialogContent>   
                        <FormControl margin="normal" required fullWidth >                         
                            <TextField
                                required
                                id="description"
                                margin="normal"
                                variant="outlined"
                                onChange={this.onChangeEditDescriptionReply}
                                rows="8"
                                multiline
                                value={this.state.descriptionReply}
                            />
                        </FormControl> 
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        <Grid container spacing={0}>
                            <Grid item xs={8} align="left">
                                <Button style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.cancel} size="small" variant="outlined" color="primary" onClick={this.handleCloseEditReply} >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={4} align="right">
                                <CreateButton disabled={this.state.isDisabled} type="submit" style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.post} size="small" variant="contained"  color="primary">
                                    Edit
                                </CreateButton>
                            </Grid>
                        </Grid>
                    </DialogActions>
                     </form>
                    </Dialog>
                    </MuiThemeProvider>
                    <Grid container style={{marginTop: 30}}>
                        <Grid item xs={2} sm={1} md={1} align="center" >
                            <Avatar className={classes.size} style={{backgroundColor: n.colour}}>{n.author.slice(0, 1).toUpperCase()}</Avatar>
                        </Grid>
                        <Grid item xs={7} sm={8} md={8} align="left" >
                            <Typography style={{fontWeight: 'bold'}} >{n.author}</Typography>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} align="right" >
                            <Typography style={{fontWeight: 'bold'}} >{n.date}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: -10}}>
                        <Grid item xs={2} sm={1} md={1} align="center" >
                         <div></div>
                        </Grid>
                        <Grid item xs={10}  sm={11} md={11} align="left" >
                            <Typography> <span style={{color: "#0066ff"}}>{oldstr}</span> {str}</Typography>
                        </Grid>
                    </Grid>
                    {n.author === this.props.user.name ?
                    <Grid container style={{marginTop: 10}}>
                        <Grid item xs={6} sm={8} md={9} >
                         <div></div>
                        </Grid>
                        <Grid item xs={3}  sm={2} md={2} align="right" >
                            <div>
                            <Delete className={classes.icon} />
                            <Typography onClick={() => this.handleClickDeleteReply(n._id)} className={classes.option}>Delete</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={3}  sm={2} md={1} align="center" >
                            <div>
                            <Edit className={classes.icon} />
                            <Typography onClick={() => this.handleClickEditReply(n.description, n._id)} className={classes.option}>Edit</Typography>
                            </div>
                        </Grid>
                    </Grid>
                    :
                    <Grid container style={{marginTop: 10}}>
                    <Grid item xs={10} sm={10} md={11} >
                        <div></div>
                    </Grid>
                    <Grid item xs={2}  sm={2} md={1} align="center" >
                        <div>
                        <Reply className={classes.icon} />
                        <Typography onClick={() => this.handleClickReply(n.author)} className={classes.option}>Reply</Typography>
                        </div>
                    </Grid>
                    </Grid>
                    }
                    <Divider style={{marginTop: 30}} />
                    </Grid>
                 );
                })}
                </Paper>
                </MuiThemeProvider>
                }

                <MuiThemeProvider theme={greenTheme}>
                    <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth = "true"
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.openDialogReply}
                    >
                    <form onSubmit={this.onSubmitReply}>
                        <h6 className={classes.dialogTitle} id="customized-dialog-title" onClose={this.handleCloseReply}>
                            Reply to post
                        </h6>
                    <DialogContent>   
                        <FormControl margin="normal" required fullWidth >                         
                            <TextField
                                required
                                id="description"
                                label="Reply"
                                margin="normal"
                                variant="outlined"
                                onChange={this.onChange}
                                rows="8"
                                multiline
                            />   
                        </FormControl> 
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        <Grid container spacing={0}>
                            <Grid item xs={8} align="left">
                                <Button style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.cancel} size="small" variant="outlined" color="primary" onClick={this.handleCloseReply} >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={4} align="right">
                                <CreateButton disabled={this.state.isDisabled} type="submit" style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.post} size="small" variant="contained"  color="primary">
                                    Reply
                                </CreateButton>
                            </Grid>
                        </Grid>
                    </DialogActions>
                     </form>
                    </Dialog>

                    <Dialog
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth = "true"
                    onClose={this.handleCloseEdit}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.openDialogEdit}
                    >
                    <form onSubmit={this.onSubmitEdit}>
                        <h6 className={classes.dialogTitle} id="customized-dialog-title" onClose={this.handleCloseEdit}>
                            Edit post
                        </h6>
                    <DialogContent>   
                        <FormControl margin="normal" required fullWidth >
                            <TextField
                                required
                                id="title"
                                margin="normal"
                                variant="outlined"
                                onChange={this.onChangeEditTitle}
                                value={this.state.title}
                            />   
                        </FormControl>
                        <FormControl margin="normal" required fullWidth >                         
                            <TextField
                                required
                                id="description"
                                margin="normal"
                                variant="outlined"
                                onChange={this.onChangeEditDescription}
                                rows="8"
                                multiline
                                value={this.state.description}
                            />
                        </FormControl> 
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        <Grid container spacing={0}>
                            <Grid item xs={8} align="left">
                                <Button style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.cancel} size="small" variant="outlined" color="primary" onClick={this.handleCloseEdit} >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={4} align="right">
                                <CreateButton disabled={this.state.isDisabled} type="submit" style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.post} size="small" variant="contained"  color="primary">
                                    Edit
                                </CreateButton>
                            </Grid>
                        </Grid>
                    </DialogActions>
                     </form>
                    </Dialog>
                </MuiThemeProvider>
                <MuiThemeProvider theme={redTheme}>
                <Dialog
                TransitionComponent={Transition}
                keepMounted
                fullWidth = "true"
                maxWidth= "xs"
                onClose={this.handleClose}
                aria-labelledby="customized-dialog-title"
                open={this.state.openDialogDelete}
                >
                <h6 className={classes.dialogTitleDelete} id="customized-dialog-title" onClose={this.handleCloseDelete}>
                    Delete 
                </h6>
                <DialogContent className={classes.description}>
                <div style={{textAlign: 'center'}}>
                    <h6 style={{color: red[500], fontFamily: "sans-serif"}} gutterBottom>
                        Do you want to delete this post?
                    </h6>
                </div>
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.cancelDelete} size="small" variant="outlined" color="primary" onClick={this.handleCloseDelete} >
                        Cancel
                    </Button>
                    <Button onClick={() => this.onSubmitDelete()} style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.delete} size="small" variant="contained"  color="primary">
                        Delete
                    </Button>
                </DialogActions>
                </Dialog>

                <Dialog
                TransitionComponent={Transition}
                keepMounted
                fullWidth = "true"
                maxWidth= "xs"
                onClose={this.handleClose}
                aria-labelledby="customized-dialog-title"
                open={this.state.openDialogDeleteReply}
                >
                <h6 className={classes.dialogTitleDelete} id="customized-dialog-title" onClose={this.handleCloseDeleteReply}>
                    Delete 
                </h6>
                <DialogContent className={classes.description}>
                    <div style={{textAlign: 'center'}}>
                    <h6 style={{color: red[500], fontFamily: "sans-serif"}} gutterBottom>
                        Do you want to delete this reply?
                    </h6>
                </div>
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.cancelDelete} size="small" variant="outlined" color="primary" onClick={this.handleCloseDeleteReply} >
                        Cancel
                    </Button>
                    <Button onClick={() => this.onSubmitDeleteReply()} style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.delete} size="small" variant="contained"  color="primary">
                        Delete
                    </Button>
                </DialogActions>
                </Dialog>
                </MuiThemeProvider>
            </main>
        );
    }
}

ForumPost.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default (withRouter(withStyles(styles)(ForumPost)));