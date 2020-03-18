import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Content from './components/Home/Content';
import Navbar from './components/Navbar/Navbar';
import Login from './components/auth/Login';
import WatchList from './components/auth/WatchList';
import Forum from './components/auth/forum/Forum';
import ForumSection from './components/auth/forum/ForumSection';
import ForumPost from './components/auth/forum/ForumPost';
import Register from './components/auth/Register';
import Contact from './components/Contact/Contact';
import jwt_decode from "jwt-decode";

let isLoggedIn = false;

let user = "";


// Check for token to keep user logged in
if (localStorage.jwtToken) {
    // Retrieve token data
    const token = localStorage.jwtToken;
  
    // Decode token and get user info and expiry
    const decoded = jwt_decode(token);

    // Username of the account which will be used for personal posts/watchlists
    user = decoded;
   
    isLoggedIn = true;

    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Remove token from local storage
      // User will be logged out
      localStorage.removeItem("jwtToken");
      isLoggedIn = false;
    }
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        currency: "USD",
        symbol: "$",
    }

    this.changeCurrency = this.changeCurrency.bind(this);
}



changeCurrency = (dataType1, dataType2) => {
  this.setState({
   currency: dataType1,
   symbol: dataType2
  });
 }


  render() {
      return (
        <Router>
            <div>
                <Navbar changeCurrency={this.changeCurrency} isLoggedIn={isLoggedIn} /> 
                <Route exact path="/"  render={(props) => (<Home currency={this.state.currency} symbol={this.state.symbol} isLoggedIn={isLoggedIn} user={user}  {...props}/>)} /> 
                <Route path="/login"  render={(props) => (<Login isLoggedIn={isLoggedIn} {...props}/>)} /> 
                <Route path="/register" render={(props) => (<Register isLoggedIn={isLoggedIn} {...props}/>)} />
                <Route path="/watchlist"  render={(props) => (<WatchList currency={this.state.currency} symbol={this.state.symbol} isLoggedIn={isLoggedIn} user={user}  {...props}/>)} />
                <Route exact path="/forum"  render={(props) => (<Forum isLoggedIn={isLoggedIn}  {...props}/>)} />
                <Route exact path="/forum/:section"  render={(props) => (<ForumSection isLoggedIn={isLoggedIn} user={user}  {...props}/>)} />
                <Route path="/forum/:section/:post"  render={(props) => (<ForumPost isLoggedIn={isLoggedIn} user={user}  {...props}/>)} /> 
                <Route path="/view/:id" render={(props) => (<Content isLoggedIn={isLoggedIn} user={user}  {...props}/>)} />
                <Route path="/contact" component={Contact} />
            </div>
        </Router>
    );
  }
}
