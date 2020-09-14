import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Orders from './containers/Orders/Orders';

import Chackout from './containers/Checkout/Checkout';
import { Route, Switch } from 'react-router-dom';

class App extends Component {
  // To tes componentWillUnmount
  //state = {
  //   show: true
  // };

  // componentDidMount() {
  //   setTimeout(()=>{
  //     this.setState({show:false});
  //   },5000);
  // };
  // {this.state.show ? <BurgerBuilder/>:null} IN JSX
  render(){
    return  (
    <div>
      <Layout>
        <Switch> 
          <Route path="/chackout" component={Chackout}/>
          <Route path="/orders" component={Orders}/>
          <Route path= "/" exact component={BurgerBuilder}/>
        </Switch>
       
      </Layout>
    </div>
    );
  }
  
}

export default App;
