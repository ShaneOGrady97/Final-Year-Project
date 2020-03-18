import React, { Component } from "react";
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from "react-router-dom";
import { Typography } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import ImportContacts from '@material-ui/icons/ImportContacts';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PeopleIcon from '@material-ui/icons/People';
import Tooltip from '@material-ui/core/Tooltip';
import orange from '@material-ui/core/colors/orange';


const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up('sm')]: {
            width: 1200,
        },
        [theme.breakpoints.down('sm')]: {
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        [theme.breakpoints.down('xs')]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        
    },
    paper: {
        cursor: 'pointer', 
        marginTop: theme.spacing.unit * 15,
        marginBottom: theme.spacing.unit * 7,
        marginLeft: theme.spacing.unit * 4,
        maxHeight: 270,
        minHeight: 270,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    title: {
        color: 'white', 
        fontWeight: 'bold',  
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 30,
    }

});


class Forum extends Component {

    constructor() {
        super();
        this.state = {
        };
    }
    

    render() {

       
        const { classes } = this.props;

        const news = "news";

        const general = "general";

        const marketplace = "marketplace";

        if(this.props.isLoggedIn === false){
            this.props.history.push('/');
          } 

        return (
            <main className={classes.main}>
                <CssBaseline />
                <Grid container >
                    <Grid item xs={12} md={4} >
                        <Tooltip title="Cryptocurrency news discussions" placement="top" >
                        <Paper onClick={() => {this.props.history.push('/forum/' + news)}} variant="outlined" style={{backgroundColor: orange[300]}} className={classes.paper} >
                            <Typography variant="h5" className={classes.title} >News</Typography>
                            <ImportContacts style={{transform: 'scale(6)', marginTop: 65, color: 'white' }}></ImportContacts>
                        </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4} >
                       <Tooltip title="General cryptocurrency discussions" placement="top" >
                        <Paper onClick={() => {this.props.history.push('/forum/' + general)}} variant="outlined" style={{backgroundColor: orange[600]}} className={classes.paper} >
                            <Typography  variant="h5" className={classes.title}>General discussions</Typography>
                            <PeopleIcon style={{transform: 'scale(6)', marginTop: 65, color: 'white' }}></PeopleIcon>
                        </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={4}   >
                       <Tooltip title="Discussions about trading cryptocurrencies" placement="top" >
                        <Paper onClick={() => {this.props.history.push('/forum/' + marketplace)}} variant="outlined" style={{backgroundColor: orange[900]}} className={classes.paper} >
                            <Typography  variant="h5" className={classes.title}>Marketplace</Typography>
                            <AttachMoneyIcon style={{transform: 'scale(5.7)', marginTop: 65, color: 'white' }}></AttachMoneyIcon>
                        </Paper>
                        </Tooltip>
                    </Grid>
                </Grid>
            </main>
        );
    }
}


Forum.propTypes = {
    classes: PropTypes.object.isRequired,
};



export default (withRouter(withStyles(styles)(Forum)));