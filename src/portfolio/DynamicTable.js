
import React from 'react';
import {Table,Button} from 'react-bootstrap'
import NumberFormat from 'react-number-format';

export default class DynamicTable extends React.Component {
 
    constructor(props){
    super(props);
    this.state={date:props.data}
    this.getHeader = this.getHeader.bind(this);
    this.getRowsData = this.getRowsData.bind(this);
    this.getKeys = this.getKeys.bind(this);
    }


    componentDidMount(){
        this.setState ({data:this.props.data});
    }
    
    getKeys = function(){
        return this.props.columns;
        }
    
    getHeader = function(){
        var keys = this.getKeys();
        return keys.map((key, index)=>{
        return <th key={key}>{key.toUpperCase()}</th>
        })
        }
    
    getRowsData = function(){
        var items = this.props.data;
        var keys = this.getKeys();
        return items.map((row, index)=>{
        return <tr key={index}><RenderRow key={index} data={row} keys={keys} obj={this} colormode={this.props.colormode}/></tr>
        })
        }
    
    render() {
    return (
    <div>
    <Table borderless="false" size="sm" striped bordered hover variant={this.props.colormode} responsive="sm">
    <thead>
    <tr>{this.getHeader()}</tr>
    </thead>
    <tbody>
    {this.getRowsData()}
    </tbody>
    </Table>
    </div>
    
    );
    }
   }

   const Temp=(date,ccy,func)=>{
       console.log(func.props.changeCashflow(date,ccy))
   }

   const RenderValidRow=(props,key,index)=>{
    
    if (key==="Date" || key==="ISIN" || key==="BondName" || key==="CCY"){
        return (
            <td key={props.data[key]}>    
                {props.data[key]}
            </td>)
    }
    else if (key==="Amount"){
        return (
            <td key={props.data[key]}>   
                <NumberFormat value= {props.data[key]} displayType={'text'} thousandSeparator={true} decimalScale={0} /> 
            </td>)
    }
    else if(key in props.data){
        return (
            <td key={props.data[key]}>    
                <Button block="true" variant={props.colormode} onClick={() => Temp(props.data["Date"],key,props.obj)} >
                <NumberFormat value= {props.data[key]} displayType={'text'} thousandSeparator={true} decimalScale={0} />
                </Button>
            </td>)
    }
    else{
        return <td></td>
    }
   }
   
   const RenderRow = (props) =>{
    return props.keys.map((key, index)=>{
        return RenderValidRow(props,key,index)
    })
   }