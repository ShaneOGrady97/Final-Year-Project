import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Rank from '@material-ui/icons/BarChart';
import Search from '@material-ui/icons/Search';
import Forum from '@material-ui/icons/Forum';
import Code from '@material-ui/icons/Code';
import orange from '@material-ui/core/colors/orange';
import TwoArrows from '@material-ui/icons/SwapHoriz';
import {Line} from 'react-chartjs-2';
import { Button, MuiThemeProvider } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Loader from '../Loader/Loader.js';
import theme from '../../Styles/theme.js';

import NumberFormat from 'react-number-format';

  const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 5,
	    	marginBottom: theme.spacing.unit * 7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    icon: {
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    link: {
        display: 'inline-block',
        verticalAlign: 'middle',
        color: '#0066ff',
        marginLeft: 6, 
        cursor: 'pointer'
    },
    dialogTitle: {
      padding: theme.spacing.unit,
      color: 'white',
      backgroundColor: '#2196f3',
      fontFamily: 'sans-serif',
    },
    description: {
        marginLeft: theme.spacing.unit * 9.9,
        padding: theme.spacing.unit * 2,
        color: '#2892d7',
        fontFamily: 'sans-serif',
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
    arrowsXS: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
      marginLeft: 20,
    },
    divArrowXS: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
      marginTop: -14, 
      marginBottom: -26
    },
    divXS: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
      marginLeft: -15, 
      marginTop: -15
    },
    divXSG: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      }, 
      
    }
    
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            chartData: [],
            coinVal: "",
            usdPriceVal: "",
            watched: false,
            openDialog: false,
            coins: [],
        }
    }

    componentDidMount() {


      Promise.all([
        axios.get(`https://api.coingecko.com/api/v3/coins/${this.props.match.params.id}?localization=false&sparkline=true`),
        axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1`)
        ]).then(([result1, result2]) => {

          const coins = result2.data;

          const data = result1.data;

          let chartData = [];

            // Array to hold chart data
            chartData = {
              labels:  data.market_data.sparkline_7d.price,
              datasets: [
                {
                  label: '7 day price chart',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: orange[400],
                  borderColor: orange[400],
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: orange[400],
                  pointBackgroundColor: orange[400],
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: orange[400],
                  pointHoverBorderColor: orange[400],
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: data.market_data.sparkline_7d.price
                }
              ]
            }; 


          this.setState({ data, chartData})

          // Check to see if this coin has been added to the watchlist 
          const fromLocalStorage = localStorage.getItem(this.props.user.name);

          if (localStorage.getItem(this.props.user.name)) {
            const dataFromLocalStorage = JSON.parse(fromLocalStorage);
            const result = dataFromLocalStorage.find(dfls => dfls.id === this.state.data.id);
            const resultIcon = result.starIcon;

            let updatedData = coins.map(d => {
              const result = dataFromLocalStorage.find(dfls => dfls.id === d.id);
            
            // Return only defined elements/elements that exist
              if (typeof result !== "undefined") {
                return { ...d, starIcon: result.starIcon };
              } else {
                return { ...d, starIcon: false };
              }

              
            });

            this.setState({watched: resultIcon, loading: false, coins: updatedData});
          } else {
            // End loading if it has not been added to the watchlist
            this.setState({ loading: false, coins: coins.map(x => ({ ...x, starIcon: false }))})
          } 


        }).catch(err => {
            console.log(err);
        }); 

    }

    componentDidUpdate(prevProps) {

        if(this.props.match.params.id !== prevProps.match.params.id){

            this.setState({ loading: true })


            Promise.all([
              axios.get(`https://api.coingecko.com/api/v3/coins/${this.props.match.params.id}?localization=false&sparkline=true`),
              axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1`)
              ]).then(([result1, result2]) => {
                const coins = result2.data;

                const data = result1.data;

                let chartData = [];
                
                // Array to hold chart data
                  chartData = {
                    labels:  data.market_data.sparkline_7d.price,
                    datasets: [
                      {
                        label: '7 day price chart',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: orange[400],
                        borderColor: orange[400],
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: orange[400],
                        pointBackgroundColor: orange[400],
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: orange[400],
                        pointHoverBorderColor: orange[400],
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: data.market_data.sparkline_7d.price
                      }
                    ]
                  }; 

                 this.setState({ data, chartData })

                   // Check to see if this coin has been added to the watchlist 
                const fromLocalStorage = localStorage.getItem(this.props.user.name);

                if (localStorage.getItem(this.props.user.name)) {
                  const dataFromLocalStorage = JSON.parse(fromLocalStorage);
                  const result = dataFromLocalStorage.find(dfls => dfls.id === this.state.data.id);
                  const resultIcon = result.starIcon;
      
                  let updatedData = coins.map(d => {
                    const result = dataFromLocalStorage.find(dfls => dfls.id === d.id);
                  
                  // Return only defined elements/elements that exist
                    if (typeof result !== "undefined") {
                      return { ...d, starIcon: result.starIcon };
                    } else {
                      return { ...d, starIcon: false };
                    }
      
                    
                  });
      
                  this.setState({watched: resultIcon, coins: updatedData});
                } else {
                  this.setState({ coins: coins.map(x => ({ ...x, starIcon: false }))})
                } 
                
                // End loading and reset coin and USD values
                this.setState({ loading: false, coinVal: "", usdPriceVal: ""})

              }).catch(err => {
                console.log(err);
              }); 

        }
   
    }

    onChangeHandler(e, currency){

      const symbol = this.state.data.symbol;

      const coin = this.state.data.market_data.current_price[symbol];

      const usdPrice = this.state.data.market_data.current_price.usd.toFixed(2); //Two decimal places

      // If the cryptocurrency box is selected we alter USD value depending on what is entered
      if(currency === 'A'){
        
        const newValueA = e.target.value;

        this.setState({
          coinVal: newValueA,
          usdPriceVal: +(newValueA * usdPrice).toFixed(2) // Multiply our input by the USD value per coin to get result
        })
  
      } 
       // If the USD box is selected we alter cryptocurrency value depending on what is entered
      else if(currency === 'B'){
        
        const newValueB = e.target.value;

        this.setState({
          coinVal: +(newValueB / usdPrice).toFixed(2), // Divide our input by the USD value per coin to get the result
          usdPriceVal: newValueB
        }) 

      }
    } 

    handleClick = () => {

      if(this.props.isLoggedIn === true){
        
        const coin = this.state.coins.find(d => d.id === this.props.match.params.id);

        const coinID = coin.id;

      this.setState(prevState => ({
        watched: !prevState.watched,
        coins: prevState.coins.map((x) => (x.id === coinID ? {
          ...x,
          starIcon: !x.starIcon
        } : x))
      }), () => {
        
        localStorage.setItem(this.props.user.name, JSON.stringify(this.state.coins));
 
      });} else {
            this.setState({
                openDialog: true
            });
        }

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

      

    render() {

        const { classes } = this.props;

        return (
            

            <main className={classes.main}>
         <MuiThemeProvider theme={theme} >
            <CssBaseline />
 
            {this.state.loading ? <Loader /> : 

            <div>
            <Paper className={classes.paper}>

            <Grid container spacing={24} >
    <Grid item md={4} sm={9} xs={7} >

         <Avatar src={this.state.data.image.large} style={{transform: 'scale(1.5)'}}/>
            

            <Typography variant="h6" style={{marginLeft: 60, marginTop: -45, fontWeight: 'bold'}}  >
            {this.state.data.name}
          </Typography>

          <Typography  style={{marginLeft: 60}}  >
            {this.state.data.symbol.toUpperCase()}
          </Typography>

             <div style={{marginTop: 15}}>
              <Rank className={classes.icon}  />
             <Typography style={{display: "inline-block", verticalAlign: "middle", color: 'white', backgroundColor: '#4CAF50', padding: '2px 5px', borderRadius: 4, marginLeft: 6 }}> Rank {this.state.data.market_cap_rank} </Typography>
              </div>

              <div style={{marginTop: 10}}>
              <Search className={classes.icon}  />
              <Typography className={classes.link}><a href={this.state.data.links.homepage[0]}>Website</a></Typography>
              </div>

              <div style={{marginTop: 10}}>
              <Forum  className={classes.icon}  />
             <Typography className={classes.link}><a href={this.state.data.links.subreddit_url}>Reddit</a></Typography>
              </div>

              <div style={{marginTop: 10}}>
              <Code className={classes.icon}  />
             <Typography className={classes.link}><a href={this.state.data.links.repos_url.github[0]}>Source Code</a></Typography>
              </div>
    </Grid>


    <Grid item md={4} sm={3} xs={5} >

    <Typography variant="h6" style={{fontWeight: 'bold'}}  >
              <NumberFormat  value={this.state.data.market_data.current_price.usd} displayType={'text'} decimalScale={this.state.data.market_data.current_price.usd >= 0.01 ? 2 : 4} thousandSeparator={true} prefix={'$'} />
              </Typography>

              <div> 
              {this.state.watched === false ?
              <Button onClick={() => this.handleClick()} style={{marginTop: 15}}  variant="contained" color="primary" >
            Watch
            </Button> 
            :
             <Button onClick={() => this.handleClick()}  style={{marginTop: 15}}  variant="outlined" color="primary" >
             Unwatch
             </Button>
    } 
            </div>
              
  
  <div className={classes.divXSG} style={{marginLeft: -7, marginTop: 10}}>
    <TextField style={{ maxWidth: 100, transform: 'scale(0.85'}}
                                    id={this.state.data.symbol.toUpperCase()}
                                    label={this.state.data.symbol.toUpperCase()}
                                    margin="normal"
                                    variant="outlined"
                                    //onChange={this.onChange}
                                    
                                    value={this.state.coinVal}

                                    onChange={(e) => {
                                      this.onChangeHandler(e, 'A');
                                    }} 
                />

          <TwoArrows style={{ marginTop: 30 }} />

    <TextField style={{ maxWidth: 100,transform: 'scale(0.85'}}
                                    id="USD"
                                    label="USD"
                                    margin="normal"
                                    variant="outlined"
                                   // onChange={this.onChange}
                                   value={this.state.usdPriceVal}

                                    onChange={(e) => {
                                      this.onChangeHandler(e, 'B');
                                    }} 
                />
      </div>

    
      {/* For XS screen */}
      <div className={classes.divXS}>
        <TextField style={{ maxWidth: 100, transform: 'scale(0.65'}}
                                    id={this.state.data.symbol.toUpperCase()}
                                    label={this.state.data.symbol.toUpperCase()}
                                    margin="normal"
                                    variant="outlined"
                                    //onChange={this.onChange}
                                    
                                    value={this.state.coinVal}

                                    onChange={(e) => {
                                      this.onChangeHandler(e, 'A');
                                    }} 
         />
      </div>
      <div className={classes.divArrowXS}>
        <TwoArrows className={classes.arrowsXS} />
      </div>
      <div className={classes.divXS} >
        <TextField style={{ maxWidth: 100,transform: 'scale(0.65'}}
                                    id="USD"
                                    label="USD"
                                    margin="normal"
                                    variant="outlined"
                                   // onChange={this.onChange}
                                   value={this.state.usdPriceVal}
                                    onChange={(e) => {
                                      this.onChangeHandler(e, 'B');
                                    }} 
                />
      </div>
      {/* XS Screen End */}
            
    </Grid>

    <Grid item md={2} sm={9} xs={7}  >

    <Typography style={{fontWeight: 'bold'}}>Circulating Supply</Typography>

    <NumberFormat  value={this.state.data.market_data.circulating_supply} decimalScale={0}  displayType={'text'}  thousandSeparator={true}  />

    <Typography style={{marginTop: 20, fontWeight: 'bold'}}>24H Price High</Typography>

  <NumberFormat  value={this.state.data.market_data.high_24h.usd} displayType={'text'} decimalScale={this.state.data.market_data.high_24h.usd >= 0.01 ? 2 : 4} thousandSeparator={true} prefix={'$'} />

  <Typography style={{marginTop: 20, fontWeight: 'bold'}}>All Time High</Typography>


    <NumberFormat  value={this.state.data.market_data.ath.usd} displayType={'text'} decimalScale={this.state.data.market_data.ath.usd >= 0.01 ? 2 : 4} thousandSeparator={true} prefix={'$'} />
        
   </Grid>

   <Grid item md={2} sm={3} xs={5}  >

   

    <Typography style={{fontWeight: 'bold'}}>Total Supply</Typography>

{this.state.data.market_data.total_supply !== null ? 
    <NumberFormat  value={this.state.data.market_data.total_supply} decimalScale={0} displayType={'text'}  thousandSeparator={true}  />
: <Typography variant="body2">Infinite</Typography> }

    <Typography style={{marginTop: 20, fontWeight: 'bold'}}>24H Price Low</Typography>


    <NumberFormat  value={this.state.data.market_data.low_24h.usd} displayType={'text'} decimalScale={this.state.data.market_data.low_24h.usd >= 0.01 ? 2 : 4} thousandSeparator={true} prefix={'$'} />

    <Typography style={{marginTop: 20, fontWeight: 'bold'}} >All Time Low</Typography>

    <NumberFormat  value={this.state.data.market_data.atl.usd} displayType={'text'} decimalScale={this.state.data.market_data.atl.usd >= 0.01 ? 2 : 6} thousandSeparator={true} prefix={'$'} />
        
    </Grid>


</Grid>
                
           
            </Paper>

            <Paper className ={classes.paper}>
                    <Line 
                    data={this.state.chartData}
                    
                    options={{ 
                        scales: {

                            xAxes: [{
                                gridLines: {
                                  color: 'rgba(0,0,0,0)'             
                                },
                               ticks: {
                                   display: false
                               }
                           }],
                           
                        },
                        tooltips: {
                          callbacks: {
                              title: function() {},
                              label: function(tooltipItem, data) {
                                if(-Math.floor( Math.log(tooltipItem.yLabel) / Math.log(10) + 1) > 2){
                                  return tooltipItem.yLabel.toFixed(4);
                                } else {
                                  return tooltipItem.yLabel.toFixed(2);
                                }
                              }
                          }
                      }
                    }}
                    />
            </Paper>

            <Paper className={classes.paper}>
                <Typography variant="h5">About {this.state.data.name}</Typography>
                 <div style={{marginTop: 15, fontSize: '95%', lineHeight: 1.6}} dangerouslySetInnerHTML={{__html:this.state.data.description.en}}></div> 
            </Paper>


         </div>
            
            }

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
                <h6 gutterBottom>
                    Login to access feature
                </h6>
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
    
            </main>
        );
    }
}

Content.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (withStyles(styles)(Content));

