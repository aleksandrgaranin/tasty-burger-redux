import React, {Component} from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import classes from './ContactData.module.css';

import axios from '../../../axios-orders';


class ContactData extends Component {
    state = {
        orderForm: {           
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },               
            street:{
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },              
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            delivery: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'chipest', displayValue: 'Chipest'}
                    ]
                },
                value: 'fastest',
                validation: {},    
                valid: true,           
                touched: false
            },        
        },
        formIsValid: false,
        loading: false
    }


    orderHendler = (event) => {
        event.preventDefault(); //important this line prevent reloading the page
        console.log(this.props);

        this.setState({loading: true});
        const formData = {}
        for (let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        const order = {
            ingredients: this.props.ing,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(response => { 
                this.setState({ loading: false })
                this.props.history.push('/');
            })
            .catch( error =>  { 
                this.setState({ loading: false })
            });
    }


    // VALIDATION METHOD
    checkValidity(value, rules) {
        let isValid = true;
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength &&isValid;
        }

        return isValid;
    }


    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }; //not a deep clone just {orderForm:name, email ...}

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }; //dipper clone of order form {orderForm:{name: props}, {email: props}, ...} but not all the way
        updatedFormElement.value = event.target.value;

        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
            // .valid -> boolean, result of validation true or false 

        updatedFormElement.touched = true; // if user clicked on input tield

        updatedOrderForm[inputIdentifier] = updatedFormElement;
        console.log(updatedFormElement)

        let formIsValid = true; // Over all validation
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }


        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render () {
        const formElementsArrey = [];
        for (let key in this.state.orderForm){
            formElementsArrey.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form className={classes.Form} onSubmit={this.orderHendler}>
                    
                    {formElementsArrey.map(formElement => (
                        <Input 
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event)=> this.inputChangedHandler(event, formElement.id)}/>
                    ))}
                    <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
                </form>
        );
        if(this.state.loading){
            form = <Spinner/>;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
} 

const mapStateToProps = state => {
    return {
        ing: state.ingredients,
        price: state.totalPrice
    }
    
}


export default connect(mapStateToProps)(ContactData);