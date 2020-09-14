import React,{ Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionType from '../../store/actions';


class BurgerBuilder extends Component {

    state = {
        
        totalPrice: 3,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount (){
        console.log(this.props);
        // axios.get('https://tasty-burger-953f1.firebaseio.com/ingredients.json')
        // .then(response => {
        //     this.setState({ingredients: response.data})
        // })
        // .catch(error => {
        //     this.setState({error: true});
        // });
    }

    updatePurchaseState (ingredients) {
     
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchaseable: sum > 0});
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngresients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngresients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type]
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngresients});
    //     this.updatePurchaseState(updatedIngresients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount<=0){
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngresients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngresients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type]
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngresients});
    //     this.updatePurchaseState(updatedIngresients);
    // }


    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCanselHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
       
        const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/chackout',
            search:'?' + queryString
        });
    }

    render () {
        const disabledInfo = {
            ...this.props.ing
        };// {salad: true, meat: false, ...}
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null
        
        let burger = this.state.error ? <p style={{textAlign:"center"}}>Ingredients can't be loaded</p> : <Spinner/>

        if (this.props.ing){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ing}></Burger>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purchaseHandler}
                        price={this.props.price}
                    />       
                </Aux>
            )
            orderSummary = <OrderSummary 
                ingredients={this.props.ing}
                purchaseCanceled={this.purchaseCanselHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price}
            />;

        }       

        if(this.state.loading) {
            orderSummary = <Spinner/>;
        }
        return (            
            <Aux>                
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCanselHandler}> 
                    {orderSummary}
                </Modal>
                {burger}
                    
            </Aux>
        );
    }
}


const mapStateToProps = state => {
    return {
        ing: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionType.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionType.REMOVE_INGREDIENT, ingredientName: ingName})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));