import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import { Button, Typography } from "@material-ui/core";
import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import theme from '../../Styles/theme.js';
import Loader from '../Loader/Loader.js';

import NumberFormat from 'react-number-format';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', 
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing.unit * 1,
            marginRight: theme.spacing.unit * 1,
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 5,
            marginRight: theme.spacing.unit * 5,
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 5,
		marginBottom: theme.spacing.unit * 7,
        alignItems: 'center',
         padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
        width: "100%",
        overflowX: 'auto',
    },
    table: {
         overflowX: 'auto',
		 marginLeft: theme.spacing.unit ,
    },
    button: {
         marginTop: 20, marginLeft: 520,
         padding: theme.spacing.unit * 1,
      },
      name: {
        whiteSpace: 'nowrap', 
        width: '120px',
        overflow: 'hidden',
        textOverflow: 'ellipsis', 
        display: 'inline-block',
        verticalAlign: 'middle',
        color: '#0066ff', 
        cursor: 'pointer'
    }
});

const headRows = [
    { id: 'market_cap_rank', align: 'left', label: '#', tooltip: 'Market Rank' },
    { id: 'name',  align: 'left', label: 'Name', tooltip: 'Coin Name' },
    { id: 'current_price', enablePadding: false, align: 'center', label: 'Price', tooltip: 'Price per coin' },
    { id: 'price_change_percentage_24h', enablePadding: false, align: 'center', label: '24h', tooltip: 'Price Percentage Change (24H)' },
    { id: 'market_cap', enablePadding: true, align: 'center', label: 'Market Cap', tooltip: 'Coin Price * Public Supply' },
    { id: 'total_volume', enablePadding: false, align: 'center', label: 'Volume', tooltip: 'Total Volume Traded' },
    { id: '7dprice', enablePadding: true, align: 'center', label: '7d Chart', tooltip: 'Price change in the last 7 days' },
  ];



class WatchList extends Component {

    constructor(props) {
        super(props);

     
        this.state = {
            data: [],
            loading: true,
            chartData: [],
            directionData: 'asc',
            directionHeader: 'asc',
            orderBy: 'mkcap',
            button: true,
        }
        
        this.sortByNumericValue = this.sortByNumericValue.bind(this);
        this.sortByStringValue = this.sortByStringValue.bind(this);
        this.createSortHandler1 = this.createSortHandler1.bind(this);
        this.createSortHandler2 = this.createSortHandler2.bind(this);
        this.viewRows = this.viewRows.bind(this);
        this.handleClick = this.handleClick.bind(this);
      
    }
    
    componentDidMount() {

        // Only retrieve the data if it has been added to the watchlist
        if(localStorage.getItem(this.props.user.name) !== null){

        
        const fromLocalStorage = localStorage.getItem(this.props.user.name);


        const dataFromLocalStorage = JSON.parse(fromLocalStorage);

        // The elements we have added to our watchlist
        const isTrue = dataFromLocalStorage.filter(d => d.starIcon === true);


        axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${this.props.currency}&order=market_cap_desc&per_page=100&page=1&sparkline=true`)
        .then(res => {

        const data = res.data;

        // Match the generated elements with watchlist elements
        let updatedData = data.map(d => {

        const result = isTrue.find(dfls => dfls.id === d.id);

        if (typeof result !== "undefined") {
            if(result.starIcon === true){
                return { ...d, starIcon: result.starIcon };
            }
        }  
      });

      // Remove the elements that are not in our watchlist
      const updatedDataDefined = updatedData.filter(item => item !== undefined)


        let chartData = [];

        updatedDataDefined.forEach(element => {
            chartData.push({
              labels: element.sparkline_in_7d.price,
               datasets:[{
                fill: true,
                backgroundColor: element.sparkline_in_7d.price[0] < element.sparkline_in_7d.price[164] ? 'rgb(204, 255, 204)' : 'rgb(255, 204, 204)',
                data: element.sparkline_in_7d.price,
                lineTension: 0,
                borderColor: element.sparkline_in_7d.price[0] < element.sparkline_in_7d.price[164] ? 'rgba(0, 153, 0, 1)' : 'rgba(227, 11, 19, 1)',
                borderWidth: 1,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointRadius: 0,
                pointHitRadius: 0,
                }]
             });
          });

        this.setState({
            data: updatedDataDefined, loading: false, chartData
          });

        })
    } else {
        this.setState({
            loading: false
        });
    }
    
    }

    componentDidUpdate(prevProps) {

        if(this.props.currency !== prevProps.currency){


            if(localStorage.getItem(this.props.user.name) !== null){

            const fromLocalStorage = localStorage.getItem(this.props.user.name);

            const dataFromLocalStorage = JSON.parse(fromLocalStorage);

            // The elements we have added to our watchlist
            const isTrue = dataFromLocalStorage.filter(d => d.starIcon === true);

            // If no element has been added to watchlist do not retrieve updated market data
            if(isTrue.length === 0){
                this.setState({loading: false});
            }

            this.setState({ loading: true  })

            axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${this.props.currency}&order=market_cap_desc&per_page=100&page=1&sparkline=true`)
            .then(res => {
                const data = res.data;
        
                // Match the generated elements with watchlist elements
                let updatedData = data.map(d => {
        
                const result = isTrue.find(dfls => dfls.id === d.id);
        
                if (typeof result !== "undefined") {
                    if(result.starIcon === true){
                        return { ...d, starIcon: result.starIcon };
                    }
                }  
              });
        
              // Remove the elements that are not in our watchlist
              const updatedDataDefined = updatedData.filter(item => item !== undefined)
        
        
                this.setState({
                    data: updatedDataDefined, loading: false, orderBy: 'mkcap'
                  });
            })
        } else {
            this.setState({
                loading: false
            });
        }
      }
    } 

    createSortHandler1 = key => event => {
        this.sortByStringValue(event, key);
    };

    createSortHandler2 = key => event => {
        this.sortByNumericValue(event, key);
    };

    sortByNumericValue = (event, key) => {

		// if statement to handle starIcon that prevents app from crashing
        if(key !== "starIcon"){

            const { data } = this.state;

            const orderBy = key;
            let directionHeader = 'asc';
    
			// If the arrow is currently upwards, when we click it again the direction will go downwards
            if (this.state.orderBy === key && this.state.directionHeader === 'asc') {
                directionHeader = 'desc';
            }
    
			// Data is sorted here
			
			// Conditional loop for Market Rank as lowest number is considered highest
			
			if(key === "market_cap_rank"){
			data: data.sort((a, b) => (
                this.state.directionData[key] === 'asc'
                ? 
                 b[key] - a[key]
                : a[key] - b[key]
            ));
			} else {
            data: data.sort((a, b) => (
                this.state.directionData[key] === 'asc'
                ? 
                 a[key] - b[key]
                : b[key] - a[key]
            ));
			}
    
            let chartData = [];
    
			// Chart Data is sorted
            data.forEach(element => {
    
                chartData.push({
                    labels: element.sparkline_in_7d.price,
                     datasets:[{
                      fill: true,
                      backgroundColor: element.sparkline_in_7d.price[0] < element.sparkline_in_7d.price[164] ? 'rgb(204, 255, 204)' : 'rgb(255, 204, 204)',
                      data: element.sparkline_in_7d.price,
                      lineTension: 0,
                      borderColor: element.sparkline_in_7d.price[0] < element.sparkline_in_7d.price[164] ? 'rgba(0, 153, 0, 1)' : 'rgba(227, 11, 19, 1)',
                      borderWidth: 1,
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointRadius: 0,
                      pointHitRadius: 0,
                      }]
                   });
            });
    
    
            this.setState({
               data: data,
    
                 chartData,
				
				// Data can be sorted by ascending/descending multiple times as opposed to just once 
                 directionData: {
                     [key]: this.state.directionData[key] === 'asc'
                     ? 'desc'
                     : 'asc'
                 },
    
                directionHeader, orderBy, 
    
            });

        }
    
    }

    sortByStringValue = (event, key) => {

        if(key !== "starIcon") {

            const { data } = this.state;

            const orderBy = key
            let directionHeader = 'asc';
    
            if (this.state.orderBy === key && this.state.directionHeader === 'asc') {
                directionHeader = 'desc';
            }
    
    
			// Sorting for strings
            data: data.sort((a, b) => {
                const asc = this.state.directionData[key] === 'asc';
                if (a[key].toLowerCase() > b[key].toLowerCase()) {
                    return asc ? -1 : 1;
                } else if (a[key].toLowerCase() < b[key].toLowerCase()) {
                    return asc ? 1 : -1;
                } else {
                    return 0;
                }
            });
    
            let chartData = [];
    
            data.forEach(element => {
    
                chartData.push({
                    labels: element.sparkline_in_7d.price,
                     datasets:[{
                        fill: true,
                        backgroundColor: element.sparkline_in_7d.price[0] < element.sparkline_in_7d.price[164] ? 'rgb(204, 255, 204)' : 'rgb(255, 204, 204)',
                      data: element.sparkline_in_7d.price,
                      lineTension: 0,
                      borderColor: element.sparkline_in_7d.price[0] < element.sparkline_in_7d.price[164] ? 'rgba(0, 153, 0, 1)' : 'rgba(227, 11, 19, 1)',
                      borderWidth: 1,
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointRadius: 0,
                      pointHitRadius: 0,
                      }]
                   });
            });
    
            this.setState({
                data: data,
    
                chartData,
    
                directionData: {
                    [key]: this.state.directionData[key] === 'asc'
                    ? 'desc'
                    : 'asc'
                },
    
                directionHeader, orderBy, 
    
            });

        }
        
   }

        viewRows = () => {
            this.setState({rowsPerPage: 100, button: false})
        }

        handleClick = (n) => {

            this.setState(prevState => ({
              data: prevState.data.map((x) => (x === n ? {
                ...x,
                starIcon: !x.starIcon
              } : x))
            }), () => {
              localStorage.setItem(this.props.user.name, JSON.stringify(this.state.data));
            });

    
          }




    render() {

        const { classes } = this.props;

        const { rowsPerPage } = this.state;

        // No table generated if watchlist is empty
        if(this.state.loading === false && this.state.data.length === 0 ){
          return <Typography style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}> Watchlist is empty! </Typography>
        } 

        if(this.props.isLoggedIn === false){
            this.props.history.push('/');
          } 
     
        return (
            <main className={classes.main}>
            <CssBaseline />
            {this.state.loading ? <Loader /> : 
            <Paper className={classes.paper}>
            <div>
            <MuiThemeProvider theme={theme}> 
                <Table className={classes.table} fixedHeader={true}>
                    <TableHead>
                        <TableRow> 
                        {headRows.map(row => (
                    <TableCell
                     key={row.id}
                     align={row.align}
                    >
                    <Tooltip 
                     title={row.tooltip}
                     placement={'top'}
                     enterDelay={300}
                        >
                        <TableSortLabel
                        active={row.id === "7dprice" ? null : this.state.orderBy === row.id}
                        direction={this.state.directionHeader}
                        onClick = {row.id === "name"  ? this.createSortHandler1(row.id) : this.createSortHandler2(row.id)}
                        style={row.id === "market_cap" || row.id === "total_volume" || row.id === "7dprice" || row.id === "market_cap_rank"  ? { marginLeft: 14} : null}
                        >
                        {row.label}
                        </TableSortLabel>
                    </Tooltip>
                    </TableCell>
                     ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.data.map((n, index) => {
                               return (
                                <TableRow
                                    key={n.id}
                                >

                                    <TableCell> <span onClick={() => this.handleClick(n)}> {n.starIcon ? <Star  style={{ display: "inline-block", verticalAlign: "middle", cursor: 'pointer', color: '#0066ff' }} /> : <StarBorder  style={{ display: "inline-block", verticalAlign: "middle", cursor: 'pointer', }} />  } </span>   <span style={{marginLeft: 5, display: "inline-block", verticalAlign: "middle" }} >{n.market_cap_rank} </span>  </TableCell>
                                    <TableCell><Avatar src={n.image} style={{transform: 'scale(0.6)', display: "inline-block", verticalAlign: "middle"   }}/> <span className={classes.name}  onClick={() => {this.props.history.push('/view/' + n.id)}} >{n.name}</span></TableCell>
                                    <TableCell align="right"><NumberFormat  value={n.current_price} displayType={'text'} decimalScale={n.current_price >= 0.01 ? 2 : 4} thousandSeparator={true} prefix={this.props.symbol} /></TableCell>
                                    <TableCell align="right"><NumberFormat style={{color: n.price_change_percentage_24h >= 0 ? '#009900' : '#e30b13'}} value={n.price_change_percentage_24h} displayType={'text'} decimalScale={2} /><span style={{color: n.price_change_percentage_24h > 0 ? '#009900' : '#e30b13'}}>%</span></TableCell>
                                    <TableCell align="right"><NumberFormat value={n.market_cap} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={this.props.symbol} /></TableCell>
                                    <TableCell align="right"><NumberFormat value={n.total_volume} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={this.props.symbol} /></TableCell>
                                    <TableCell>
                                    <Line  data={this.state.chartData[index]}
                                width={100}

                                height={50}
                                options={{ 
                                    scales: {
                                        yAxes: [{
                                             gridLines: {
                                                display: false             
                                             },
                                            ticks: {
                                                display: false
                                            }
                                        }],
                                        xAxes: [{
                                            gridLines: {
                                                display: false           
                                            },
                                           ticks: {
                                               display: false
                                           }
                                       }],
                                    },
                                    legend: {
                                        display: false
                                    },
                                    layout: {
                                        padding: {
                                            left: 0,
                                            right: 0,
                                            top: 10,
                                            bottom: 0
                                        }
                                    },
                                    responsive: false,
                                    maintainAspectRatio: false,
                                    events: [],
                                }}
                                />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                </MuiThemeProvider> 
                </div>
            

            </Paper>
         }
            
            </main>
        );
    }
}

WatchList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (withRouter(withStyles(styles)(WatchList)));