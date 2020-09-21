import React, { Component } from 'react';
import { connect } from 'react-redux'

import axios from '../../axios-orders';
import withErrorHendler from '../../hoc/withErrorHandler/withErrorHandler';

import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner'
import * as actions from '../../store/actions/index';


class Orders extends Component {   
    componentDidMount(){
        this.props.onFetchOrder(this.props.token);
    }

    render () {
        let orders = <Spinner />;
        if (!this.props.loading) {
            orders = this.props.orders.map(order => (
                <Order                         
                    key={order.id}
                    ingredients={order.ingredients}
                    price={order.price} />
            ))
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        orders: state.ordr.orders,
        loading: state.ordr.loading,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrder: (token) => dispatch(actions.fetchOrders(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHendler(Orders, axios));