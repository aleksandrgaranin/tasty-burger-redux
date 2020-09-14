import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../../containers/Checkout/ContactData/ContactData';




class Checkout extends Component{
    // state ={
    //     ingredients: null,
    //     price: 0
    // }

    // componentWillMount(){
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price = 0;
    //     for (let param of query.entries()) {
    //         if (param[0] === 'price'){
    //             price = param[1];
    //         } else {
    //              // ['salat', '1']
    //             ingredients[param[0]] = +param[1];
    //         }
           
    //     }
    //     this.setState({ingredients: ingredients, totalPrice: price});
    // }

    checkoutCanceledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        return(
            <div>
                <CheckoutSummary 
                ingredients={this.props.ing}
                checkoutCanceled={this.checkoutCanceledHandler}
                checkoutContinued={this.checkoutContinuedHandler}/>
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    component={ContactData}/>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        ing: state.ingredients
        
    }
};


export default connect(mapStateToProps)(Checkout);