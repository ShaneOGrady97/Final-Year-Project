import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArrowDown from '@material-ui/icons/ArrowDropDown';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Paper from "@material-ui/core/Paper";
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import theme2 from '../../Styles/theme.js';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';

const themeMui = createMuiTheme({
    palette: {
        primary: { main: '#212121', blue: blue[500], orange: orange[400] }, 
        secondary: { main: '#262626' }, 
    },
    typography: {
        fontFamily: "'Montserrat', sans-serif",
        htmlFontSize: 15,
    }
});


const styles = theme => ({

    grow: {
        flexGrow: 0.53,
        [theme.breakpoints.up('xl')]: {
            flexGrow: 0.52,
        },
    },
    margin1: {
        marginLeft: 5,
    },
    original: {
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        }
    },
    spanColor: {
        color: themeMui.palette.primary.orange,
    },
    span: {
        color: themeMui.palette.primary.orange,
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        },
        marginRight: 10
    },
    register: {
        color: themeMui.palette.primary.orange,
        cursor: 'pointer',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
          },
    },
    button: {
        transition: '0.5s',
        cursor: 'pointer',
        '&:hover': {
            color: themeMui.palette.primary.orange,
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
          }, 
        
    },
    currencySelect: {
        transition: '0.5s',
        cursor: 'pointer',
        '&:hover': {
            color: themeMui.palette.primary.orange,
        },
        
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 400,
        },
        [theme.breakpoints.up('xl')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 650,
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 7.8,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    dialogTitle: {
        padding: theme.spacing.unit,
        color: 'white',
        backgroundColor: '#2196f3',
        fontFamily: 'sans-serif'
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
    login: {
        marginRight: theme.spacing.unit * 11.5,
    },

    menuButton: {
       // marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up('md')]: {
          display: 'none',
        },
      },
  
    drawer: {
        backgroundColor: '#212121',
    },

    buttonDrawer: {
        color: 'white',
        transition: '0.5s',
        cursor: 'pointer',
        '&:hover': {
            color: themeMui.palette.primary.orange,
        },    
    },
});

function Transition(props) {
    return <Slide direction="down" {...props} />;
}


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           names:[],
           images: [],
           imageSuggestions: [],
           id: [],
           idSugs: [],
           suggestions: [],
           text: '',
           open: false,
           selectedCurrency: 'USD',
           selectedSymbol: '$',
           openDialog: false,
           openMobile: false,
        }
    }

    componentDidMount() {
   
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true')
            .then(res => {
                const data = res.data;
                let names = [];
                let images = [];
                let id = [];

                data.forEach(element => {
                   names.push(element.name);
                   images.push(element.image);
                   id.push(element.id);
                  });

                this.setState({names, images, id})

            })


    }


    onTextChanged = (e) => {
        const value = e.target.value;
        let suggestions = [];
        let imageSuggestions = [];

        let idSugs = [];

        let z = [];

        if (value.length > 0){
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = this.state.names.filter(v => regex.test(v));
            z = suggestions.map(v => this.state.names.indexOf(v));
            imageSuggestions =  z.map(v => this.state.images[v] );
            idSugs =  z.map(v => this.state.id[v] );
        }
        this.setState(() => ({suggestions, imageSuggestions, text: value, idSugs}));
    }

    suggestionSelected (value) {
        this.setState(() => ({
            text: "",
            suggestions: [],
            imageSuggestions: [],
        }))

        this.props.history.push('/view/' + value);

    }


    renderSuggestions () {
        const {suggestions, imageSuggestions, idSugs} = this.state;
        const { classes } = this.props;

        if(suggestions.length === 0){
            return null;
        }
        return (
            <Paper square={true} style={{position: 'absolute',  marginTop: 0.5, padding: 0, minWidth: "100%",  zIndex: 1}}>
             <ul style={{ color: 'black', listStyleType: 'none', textAlign: 'left', margin: 0, padding: 0, overflow: 'auto', maxHeight: 185 }}>
                {suggestions.map((item, index) =>  
                <MenuItem key={index}  onClick={() => this.suggestionSelected(idSugs[index])}>   <Avatar src={imageSuggestions[index]} style={{transform: 'scale(0.6)', display: "inline-block", verticalAlign: "middle"   }}/>  {item} </MenuItem> 
                )}
             </ul>
            </Paper>
        )
    }

    // Close Dialog when select "cancel" within it
    handleClose = () => {
        this.setState({
            openDialog: false
        });
       
    };

    // Redirect to login page when we select "login"
    loginRedirect = () => {
        this.setState({
            openDialog: false
        });
        this.props.history.push('/login');
    };

    // Open Dialog if not logged in, otherwise redirect to watchlist
    watchlistRedirect = () => {
        if(this.props.isLoggedIn === true){
            this.props.history.push('/watchlist');
        }else {
            this.setState({
                openDialog: true
            });
        }
    };

    // Open Forum if not logged in, otherwise redirect to forum
    forumRedirect = () => {
        if(this.props.isLoggedIn === true){
            this.props.history.push('/forum');
        }else {
            this.setState({
                openDialog: true
            });
        }
    };

    // Open dropdown for currency selection
    openDropDown = () => {

        this.setState(prevState => ({
            open: !prevState.open,
          }));
       
    };

    // Logout of the account
    logOut = () => {
    // Remove token from local storage
	localStorage.removeItem("jwtToken");
    window.location.href = "./";
    };

    select = (valCurrency, valSymbol) => {

         this.setState({

            selectedCurrency: valCurrency,

            selectedSymbol: valSymbol
         })

         this.props.changeCurrency(valCurrency, valSymbol);

    };

    handleDrawerToggle = () => {
        this.setState(prevState => ({
          mobileOpen: !prevState.mobileOpen,
        }));
    };


    render() {
        const { classes } = this.props;

        const {text} = this.state;

        return (
        <div>
            <MuiThemeProvider theme={themeMui}>
            <div>
                    <AppBar style={{ height: 62 }}  position="static" >
                        <Toolbar color="inherit" >
                            
                            <div className={classes.grow} />

                            <IconButton
                        style={{outline: 'thin'}}
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={this.handleDrawerToggle}
                        className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>

                            <Typography className={classes.original} onClick={() => {this.props.history.push('/')}} color="inherit" style={{ maxWidth: 170 , minWidth: 170, cursor: 'pointer'}}  >
                                Welcome to <span className={classes.spanColor}>Cointrack</span>
                            </Typography>

                            <Typography className={classes.span} onClick={() => {this.props.history.push('/')}} color="inherit" style={{ cursor: 'pointer'}}  >
                                Cointrack
                            </Typography>
                            
                            <div className={classes.margin1} ></div>

                             <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search Cryptos"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    value={text} onChange={this.onTextChanged}
                                />
                                    {this.renderSuggestions()}
                            </div> 


                                    

                            {this.props.location.pathname === "/" || this.props.location.pathname === "/watchlist"  ?
                       
                            <div className={classes.currencySelect} onClick={this.openDropDown} style={{ maxWidth: 65, minWidth: 65, marginLeft: 20}}  >
                            <Typography style={{display: "inline-block", verticalAlign: "middle"  }}  color="inherit">
                                {this.state.selectedCurrency}
                            </Typography>
                          
                           {this.state.open ?
                            
                            <Paper  style={{ position: 'absolute', marginTop: 0.5, marginLeft: -10, zIndex: 1}}>
                            <ul  style={{ color: 'black', listStyleType: 'none', textAlign: 'center', margin: 0, padding: 0, overflow: 'auto', maxHeight: 185  }}>
                               
                               <MenuItem onClick={this.select.bind(this, "USD", "$")} >USD</MenuItem>
                               <MenuItem onClick={this.select.bind(this, "EUR", "€")} >EUR</MenuItem>
                               <MenuItem onClick={this.select.bind(this, "GBP", "£")} >GBP</MenuItem>

                            </ul>
                            </Paper>

                            : 
                            
                            null}
                         
                            <ArrowDown  style={{display: "inline-block", verticalAlign: "middle"}}  />

                            </div>

                            : null }

                            <Typography onClick={this.watchlistRedirect.bind(this)} style={{  marginLeft: 10 }}   className={classes.button} color="inherit">
                                WatchList
                            </Typography>

                            <Typography onClick={this.forumRedirect.bind(this)} style={{  marginLeft: 25 }}   className={classes.button} color="inherit">
                                Forum
                            </Typography>

                            {/* Check to see if logged in to enable logout functionality */}
                           { this.props.isLoggedIn === true ?
                            <Typography onClick={() => {this.logOut()}} style={{ marginRight: 25, marginLeft: 25 }} className={classes.button} color="inherit">
                                Logout
                           </Typography> : null }
                           { localStorage.getItem("jwtToken") === null ?
                            <Typography onClick={() => {this.props.history.push('/login')}} style={{ marginRight: 25, marginLeft: 25 }} className={classes.button} color="inherit">
                                Login
                            </Typography>
                            : null }
                             { this.props.isLoggedIn === false ?
                          <Typography onClick={() => {this.props.history.push('/register')}} className={classes.register} style={{ marginRight: 25 }} color="inherit">
                                Register
                          </Typography>  
                          : null }

                            <Typography onClick={() => {this.props.history.push('/contact')}} style={{ marginRight: 25 }}  className={classes.button} color="inherit">
                                Contact
                          </Typography>
                           
                           {/* Render Drawer for mobile devices */}
                          <Drawer classes={{ paper: classes.drawer }} onClose={this.handleDrawerToggle} open={this.state.mobileOpen}>
                            <div style={{width: 250}}>
                            <List>
                            <ListItem>
                            <Typography onClick={() => {this.watchlistRedirect(); this.handleDrawerToggle()}} className={classes.buttonDrawer} >WatchList</Typography>
                            </ListItem>
                            <Divider />
                            <ListItem>
                            <Typography onClick={() => {this.forumRedirect(); this.handleDrawerToggle()}} className={classes.buttonDrawer} >Forum</Typography>
                            </ListItem>
                            <Divider />
                            { this.props.isLoggedIn === true ? 
                            <div>
                            <ListItem>
                            <Typography onClick={() => {this.logOut(); this.handleDrawerToggle()}} className={classes.buttonDrawer} >Logout</Typography>
                            </ListItem>
                            <Divider />
                            </div>
                            :
                            <div>
                            <ListItem>
                            <Typography onClick={() => { this.props.history.push('/login'); this.handleDrawerToggle();}} className={classes.buttonDrawer} >Login</Typography>
                            </ListItem>
                            <Divider />
                            <ListItem>
                            <Typography onClick={() => { this.props.history.push('/register'); this.handleDrawerToggle();}} className={classes.buttonDrawer} >Register</Typography>
                            </ListItem>
                            <Divider />
                            </div>
                            }
                            <ListItem>
                            <Typography onClick={() => {this.props.history.push('/contact'); this.handleDrawerToggle();}} className={classes.buttonDrawer} >Contact</Typography>
                            </ListItem>
                            </List>
                            </div>
                        </Drawer>

                    </Toolbar>
                </AppBar>

       
                </div>
            </MuiThemeProvider>

            <MuiThemeProvider theme={theme2}>
            <Dialog
            TransitionComponent={Transition}
            keepMounted
            fullWidth = "true"
            maxWidth= "xs"
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.openDialog}
            >
            <h6 className={classes.dialogTitle} id="customized-dialog-title" onClose={this.handleClose}>
                Alert
            </h6>
            <DialogContent className={classes.description}>
            <div style={{textAlign: 'center'}}>
                <h6 gutterBottom>
                    Login to access feature
                </h6>
            </div>
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Button style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.cancel} size="small" variant="outlined" color="primary" onClick={this.handleClose.bind(this)} >
                    Cancel
                </Button>
                <Button style={{ width: '30px', height: '30px', outline: "thin" }} className={classes.login} size="small" variant="contained" onClick={this.loginRedirect.bind(this)}  color="primary">
                    Login
                </Button>
            </DialogActions>
            </Dialog>
            </MuiThemeProvider>
            </div>
        );
       
    }
    
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (withRouter(withStyles(styles)(Navbar)));