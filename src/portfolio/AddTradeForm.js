

import React from 'react';
import {Form,Button,Container} from 'react-bootstrap'
import SelectSearch from 'react-select-search';
import './selectSearch.css';


const SERVER_API="gtalgos.com/"

class AddTradeForm extends React.Component {
    constructor(props) {
      super(props);
      if(props.quantity===""){
        this.state = {TradeId:props.tradeid,ISIN: props.isin, Date:props.date,Price:props.price,Quantity:props.quantity,Action:props.action,DisableBuy:true, DisableSell:false};
      }
      else{
        this.state = {TradeId:props.tradeid,ISIN: props.isin, Date:props.date,Price:props.price,Quantity:Math.abs(props.quantity),Action:props.action,DisableBuy:true, DisableSell:false};
      }
      
      this.handleChange = this.handleChange.bind(this);
      this.handleISINChange = this.handleISINChange.bind(this);
      this.handleBuy = this.handleBuy.bind(this);
      this.handleSell = this.handleSell.bind(this);
      
    }

    componentDidMount(){
        this.setState({DisableSell:false,DisableBuy:false})
        if (this.props.action==="Close"){
            if(Number(this.props.quantity)>0){
                this.setState({DisableBuy:true})
            }
            else if(Number(this.props.quantity)<0){
                this.setState({DisableSell:true})
            }
        }
    }
  
    handleChange(event) {
      this.setState({[event.target.id]: event.target.value});
    }

    handleISINChange(event) {
        this.setState({"ISIN":event});
      }
  
    async handleBuy(event) {
        
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state )
        };
        const response = await fetch(SERVER_API+'BuyTrade', requestOptions);
        await response.json();
        this.props.ViewTrades(this.state.ISIN)
        this.props.close()
    }

    async handleSell(event) {
        
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        };
        const response = await fetch(SERVER_API+'SellTrade', requestOptions);
        await response.json();
        this.props.ViewTrades(this.state.ISIN)
        this.props.close()
    }

    render() {
        
        let ISIN_Box=null
        
        if(this.props.isin==="All"){
            ISIN_Box=<SelectSearch options={this.props.universe} onChange={this.handleISINChange} id="ISIN"  search placeholder="Search ISIN" /> 
        }
        else{
            ISIN_Box=<div><h4>{this.props.isin}</h4><br></br><h5>{this.props.bondname}</h5></div>
        }

      return (

        <Form>
        <Form.Group controlId="ISIN">
            {ISIN_Box}
            
        </Form.Group>
        <Form.Group  controlId="Quantity">
            <Form.Control defaultValue={this.state.Quantity} onChange={this.handleChange} type="text" placeholder="Enter Quantity" />
        </Form.Group>
        <Form.Group controlId="Price">
            <Form.Control defaultValue={this.state.Price} onChange={this.handleChange} type="text" placeholder="Enter Clean Price" />
        </Form.Group>
        <Form.Group controlId="Date">
            <Form.Control defaultValue={this.state.Date} onChange={this.handleChange} type="text" placeholder="Enter Date of Purchase" />
            <Form.Text className="text-muted">
                Enter Date of Purchase as dd-Mmm-yy
            </Form.Text>
        </Form.Group>
        <Container fluid="true">
        <Button disabled={this.state.DisableSell} size="lg" variant="warning" onClick={this.handleSell} type="submit">
        &nbsp;&nbsp;&nbsp;&nbsp;SELL&nbsp;&nbsp;&nbsp;&nbsp;
        </Button>
        <Button disabled={this.state.DisableBuy} size="lg" className="float-sm-right" variant="primary" onClick={this.handleBuy} type="submit">
        &nbsp;&nbsp;&nbsp;&nbsp;BUY&nbsp;&nbsp;&nbsp;&nbsp;
        </Button>
        </Container>
    </Form>
      );
    }
  }


export default AddTradeForm;


            