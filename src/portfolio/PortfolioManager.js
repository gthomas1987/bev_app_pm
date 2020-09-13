import React from 'react';
import {Alert,Button,Tabs,Tab,Modal,Table,Container,Row,Card,Col,ListGroup,Pagination,Image,Form} from 'react-bootstrap'
import AddTradeForm from './AddTradeForm'
import SectorChart from './SectorChart'
import NumberFormat from 'react-number-format';
import '../App.css';
import DynamicTable from './DynamicTable'
import BannerLogo from './logo.JPG'

const DisplayPerPage=10



const SERVER_API="http://bevappserver2-env.eba-bpmmzn6g.ap-southeast-1.elasticbeanstalk.com/"

class PortfolioManager extends React.Component {
    
    constructor() {
      super();
      this.state = {
                    colorMode:"light",
                    backgroundColor:"#ffffff",
                    showModalAddTrade: false,
                    Currencies:[],
                    positions:[],
                    trades:[],
                    SectorDivision:{},
                    CountryDivision:{},
                    CurrencyDivision:{},
                    Cashflows:[],
                    CashflowDetails:{},
                    Coupons:[],
                    CouponDetails:{},
                    Redemptions:[],
                    RedemptionDetails:{},
                    IssuerDivision:{},
                    PositionData:[],
                    PortfolioStats:{},
                    ISINUniverse:[],
                    selectedTradeId:0,
                    selectedISIN:"All",
                    selectedBondName:"All",
                    selectedQuantity:"All",
                    selectedPrice:"All",
                    selectedDate:"All",
                    ActiveTab:"Positions",
                    TradeActionTitle:"Add New Trade",
                    TradeAction:"Add",
                    selectedCashflowDetails:[],
                    ActivePositionPage:1,
                    DisplayPositions:[],
                    ActiveTradePage:1,
                    DisplayTrades:[],
                  };
      this.LoadLandingPage = this.LoadLandingPage.bind(this);
      this.handleModalAddTradeCloseRefresh=this.handleModalAddTradeCloseRefresh.bind(this);
      this.handleViewTrades=this.handleViewTrades.bind(this);
      this.handleShowAllTrades=this.handleShowAllTrades.bind(this);
      this.handleModalAddTradeShow=this.handleModalAddTradeShow.bind(this);
      this.handleTabClick=this.handleTabClick.bind(this);
      this.handleEditTrade=this.handleEditTrade.bind(this);
      this.handleCloseTrade=this.handleCloseTrade.bind(this);
      this.getTodaysDate=this.getTodaysDate.bind(this);
      this.handleDeleteTrade=this.handleDeleteTrade.bind(this);
      this.CashflowTable=this.CashflowTable.bind(this);
      this.CurrentCashflowDetails=this.CurrentCashflowDetails.bind(this);
      this.handleCashflowDetails = this.handleCashflowDetails.bind(this);
      this.handleCouponDetails=this.handleCouponDetails.bind(this);
      this.handleRedemptionDetails=this.handleRedemptionDetails.bind(this);
      this.compareString=this.compareString.bind(this);
      this.compareDate=this.compareDate.bind(this);
      this.changePositonPage=this.changePositonPage.bind(this);
      this.handleChangeColorMode=this.handleChangeColorMode.bind(this);
    }

    
    

    handleModalAddTradeClose = () => this.setState({showModalAddTrade: false});
    handleClearCashflowDetails = () => this.setState({selectedCashflowDetails: []});

    handleChangeColorMode(event){
      console.log()
      if(event.target.checked===true){
        this.setState({colorMode:"dark"})
      }
      else{
        this.setState({colorMode:"light"})
      }
    }

    getTodaysDate(){
      var today=new Date()
      let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
      let day = today.getDate();
      let monthIndex = today.getMonth();
      let monthName = monthNames[monthIndex];
      let year = today.getFullYear();
      let yearStr=String(year).slice(-2)
      
      return `${day}-${monthName}-${yearStr}`
    }

    changePositonPage(event){
      console.log(event)
      console.log("XXXXXXXX")
      this.setState({ActivePositionPage:event,selectedISIN:"All"})
      this.setState({DisplayPositions:this.state.positions.slice(event*DisplayPerPage-DisplayPerPage,event*DisplayPerPage)})
    }

    changeTradePage(event){
      console.log(event)
      this.setState({ActiveTradePage:event,selectedISIN:"All"})
      this.setState({DisplayTrades:this.state.trades.slice(event*DisplayPerPage-DisplayPerPage,event*DisplayPerPage)})
    }

    handleModalAddTradeShow (){
      let date=this.getTodaysDate()
      this.setState({showModalAddTrade: true,TradeActionTitle:"Add New Trade",TradeAction:"Add",selectedDate:date,selectedQuantity:"",selectedPrice:"",selectedBondName:""});
    }

    handleTabClick(event){
      console.log(event)
      this.setState({ActiveTab:event,selectedISIN:"All",DisplayTrades:this.state.trades.slice(DisplayPerPage-10,DisplayPerPage)})
    }

    handleViewTrades(isin){
      console.log(isin)
      this.setState({'selectedISIN':isin,ActiveTab:"Trades",DisplayTrades:this.state.trades})
    }

    handleEditTrade(tradeid,isin,quantity,purchaseprice,date,bondname){
      this.setState({TradeActionTitle:"Edit Trade",TradeAction:"Edit",selectedTradeId:tradeid,selectedISIN:isin,selectedQuantity:quantity,selectedPrice:purchaseprice,selectedBondName:bondname,selectedDate:date,showModalAddTrade: true}) 
    }

    async handleDeleteTrade(tradeid){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"Action":"Delete","TradeId":tradeid})
      };
      const response = await fetch(SERVER_API+'DeleteTrade', requestOptions);
      await response.json();
      await this.LoadLandingPage()
      this.handleViewTrades(this.state.selectedISIN) 
    }

    handleCloseTrade(isin,quantity,bondname){
      let date=this.getTodaysDate()
      this.setState({TradeActionTitle:"Close Position",TradeAction:"Close",selectedISIN:isin,selectedQuantity:quantity,selectedBondName:bondname,selectedPrice:"",selectedDate:date,showModalAddTrade: true}) 
    }

    handleShowAllTrades(){
      this.setState({selectedISIN:"All"})
      console.log(this.state.selectedISIN)
    }

    handleCashflowDetails(date,ccy){
      var filteredCashflows = this.state.CashflowDetails.reduce((filteredCashflows, cashflow) => {
        if (cashflow.CCY===ccy && cashflow.Date===date) {
          filteredCashflows.push(cashflow);
        }
        return filteredCashflows;
      }, []);
      console.log(filteredCashflows)
      this.setState({selectedCashflowDetails:filteredCashflows})
    }

    handleCouponDetails(date,ccy){
      console.log("XXXXX")
      console.log(this.state.CouponDetails)
      var filteredCashflows = this.state.CouponDetails.reduce((filteredCashflows, cashflow) => {
        if (cashflow.CCY===ccy && cashflow.Date===date) {
          filteredCashflows.push(cashflow);
        }
        return filteredCashflows;
      }, []);
      console.log(filteredCashflows)
      this.setState({selectedCashflowDetails:filteredCashflows})
    }

    handleRedemptionDetails(date,ccy){
      var filteredCashflows = this.state.RedemptionDetails.reduce((filteredCashflows, cashflow) => {
        if (cashflow.CCY===ccy && cashflow.Date===date) {
          filteredCashflows.push(cashflow);
        }
        return filteredCashflows;
      }, []);
      console.log(filteredCashflows)
      this.setState({selectedCashflowDetails:filteredCashflows})
    }


    async handleModalAddTradeCloseRefresh(){
      await this.LoadLandingPage()
      this.setState({showModalAddTrade: false})
      this.handleViewTrades(this.state.selectedISIN) 
    }

    compareString(a, b) {
      var nameA = a.BondName.toUpperCase(); // ignore upper and lowercase
      var nameB = b.BondName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    }

    compareDate(a, b) {
      var dateA = new Date(a.Date); // ignore upper and lowercase
      var dateB = new Date(b.Date); // ignore upper and lowercase
      if (dateA < dateB) {
        return 1;
      }
      if (dateA > dateB) {
        return -1;
      }
      return 0;
    }

    async LoadLandingPage(){

      

      const response = await fetch(SERVER_API+'GetPortfolio');
        const results = await response.json();
        this.setState({ 
              Currencies:results.Currencies,
              positions: Object.values(results.Positions.sort(this.compareString)),
              trades: Object.values(results.Trades.sort(this.compareDate)),
              SectorDivision: results.SectorDivision,
              IssuerDivision: results.IssuerDivision,
              CountryDivision: results.CountryDivision,
              CurrencyDivision:results.CurrencyDivision,
              PositionData:results.PositionData,
              PortfolioStats:results.PortfolioStats,
              ISINUniverse:results.ISINUniverse,
              Cashflows:results.Cashflows,
              CashflowDetails:results.CashflowDetails,
              Redemptions:results.Redemptions,
              RedemptionDetails:results.RedemptionDetails,
              Coupons:results.Coupons,
              CouponDetails:results.CouponDetails,
              DisplayPositions:Object.values(results.Positions.sort(this.compareString)).slice(0,DisplayPerPage),
              DisplayTrades:Object.values(results.Trades.sort(this.compareDate)).slice(0,DisplayPerPage),
            });
    }
    async componentDidMount(){
        await this.LoadLandingPage()
      }

    CashflowTable(cashflowType){
      var finalColumns=this.state.Currencies.slice()
      finalColumns.unshift("Date")
      if(cashflowType==="Coupons"){
        return <div>
          <DynamicTable data={this.state.Coupons} columns={finalColumns} changeCashflow={this.handleCouponDetails} colormode={this.state.colorMode}/>
        </div>
      }
      else if(cashflowType==="Redemptions"){
        return <div>
          <DynamicTable data={this.state.Redemptions} columns={finalColumns} changeCashflow={this.handleRedemptionDetails}  colormode={this.state.colorMode}/>
        </div>
      }
      else{
        return <div>
        <DynamicTable data={this.state.Cashflows} columns={finalColumns} changeCashflow={this.handleCashflowDetails} colormode={this.state.colorMode}/>
      </div>
      }
    }

    
    CurrentCashflowDetails(){
      
      return <div><DynamicTable data={this.state.selectedCashflowDetails} columns={["Date","ISIN","BondName","CCY","Amount"]}  colormode={this.state.colorMode} /></div>
    }

    render() {

      var ISINList = this.state.ISINUniverse.map(function (val) {     
        return {name:val[0]+"-"+val[1].issuedCurrency+"-"+val[1].issuerName+"-"+val[1].maturityDate+"-"+val[1].coupon,value:val[0]}; 
      });
      var colorPnL="info"
      var colorTotalPnL="info"
      var colorReturn="info"
      var colorMV="info"
      if(Number(this.state.PortfolioStats.DailyPnL)>=0){
        colorPnL="success"
      }
      else if(Number(this.state.PortfolioStats.DailyPnL)<0){
        colorPnL="danger"
      }
      if(Number(this.state.PortfolioStats.PnL)>=0){
        colorTotalPnL="success"
      }
      else if(Number(this.state.PortfolioStats.PnL)<0){
        colorTotalPnL="danger"
      }
      if(Number(this.state.PortfolioStats.Return)>=0){
        colorReturn="success"
      }
      else if(Number(this.state.PortfolioStats.Return)<0){
        colorReturn="danger"
      }
      if(Number(this.state.PortfolioStats.MarketValue)>=0){
        colorMV="info"
      }
      else if(Number(this.state.PortfolioStats.MarketValue)<0){
        colorMV="danger"
      }
      
      
      let positionPageItems = [];
      let tradePageItems =[];
      for (let number = 1; number <= Math.ceil(this.state.positions.length/DisplayPerPage); number++) {
        positionPageItems.push(
          <Pagination.Item key={number} active={number === this.state.ActivePositionPage} onClick={() => this.changePositonPage(number)}>
            {number}
          </Pagination.Item>,
        );
      }
      for (let number = 1; number <= Math.ceil(this.state.trades.length/DisplayPerPage); number++) {
        tradePageItems.push(
          <Pagination.Item key={number} active={number === this.state.ActiveTradePage} onClick={() => this.changeTradePage(number)}>
            {number}
          </Pagination.Item>,
        );
      }

      let backgroundColor=this.state.backgroundColor
      if(this.state.colorMode==="dark"){
        backgroundColor="#333333"
      }
      
      return (
      <div style={{backgroundColor: backgroundColor}}>
        <Container fluid="true" >
        <Image src={BannerLogo} rounded />
        <Container fluid ="true" >
          <br></br>
        <Container fluid ="true" >
          <Row>
          <Col sm={1}></Col>
          <Alert variant={this.state.colorMode}>
            <Alert.Heading >Portfolio Manager</Alert.Heading>
            <p>
              <br></br>
            Track all your Bond Trades
            </p>
        </Alert>
        <Col>
        <Card bg={this.state.colorMode} border={colorPnL} text ={colorPnL} style={{ fontSize: '25px' }}>
        <Card.Header>Daily PnL</Card.Header>
        <Card.Title><br></br> <NumberFormat value= {this.state.PortfolioStats.DailyPnL} displayType={'text'} prefix="$" thousandSeparator={true} decimalScale={0} /><br></br></Card.Title>
        </Card>
        </Col>
        <Col>
        <Card bg={this.state.colorMode} border={colorTotalPnL} text={colorTotalPnL} style={{ fontSize: '25px' }}>
        <Card.Header>Total PnL</Card.Header>
        <Card.Title><br></br> <NumberFormat value= {this.state.PortfolioStats.PnL} displayType={'text'} prefix="$"  thousandSeparator={true} decimalScale={0} /><br></br></Card.Title>
        </Card>
        </Col>
        <Col>
        <Card bg={this.state.colorMode} border={colorReturn} text={colorReturn} style={{ fontSize: '25px' }}>
        <Card.Header>Return</Card.Header>
        <Card.Title><br></br> <NumberFormat value= {this.state.PortfolioStats.Return} displayType={'text'} suffix="%"  thousandSeparator={true}  decimalScale={2} /><br></br></Card.Title>
        </Card>
        </Col>
        <Col>
        <Card bg={this.state.colorMode} border={colorMV} text={colorMV} style={{ fontSize: '25px' }}>
        <Card.Header>Market Value</Card.Header>
        <Card.Title><br></br> <NumberFormat value= {this.state.PortfolioStats.MarketValue} displayType={'text'} prefix="$" thousandSeparator={true} decimalScale={0} /><br></br></Card.Title>
        </Card>
        </Col>
        <Col sm={1}>
        <Form onClick={this.handleChangeColorMode}>
        <Form.Check 
          type="switch"
          id="color-mode-switch"
          label=""
        />
      </Form>
        </Col>
        </Row>
        </Container>

        <Button variant="outline-info" className="float-sm-right" onClick={this.handleModalAddTradeShow}>Add Trade</Button> 
        
        <Tabs  defaultActiveKey="Positions" activeKey={this.state.ActiveTab}  onSelect={this.handleTabClick} id="uncontrolled-tab-example">

            <Tab eventKey="Positions" title="Positions">
                
            <Table striped bordered hover variant={this.state.colorMode} responsive="sm">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Bond</th>
                    <th>ISIN</th>
                    <th>CCY</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Market Value</th>
                    <th>Total PnL</th>
                    <th>Daily PnL</th>
                    <th>Total Return</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.DisplayPositions.map(( listValue, index ) => {
                    return (<tr key={index}>
                        <td>{index+1}</td>
                        <td>{listValue.BondName}</td>
                        <td>{listValue.ISIN}</td>
                        <td>{listValue.CCY}</td>
                        <td style={{color:listValue.Quantity<0 ? "red": ""}}> <NumberFormat value={listValue.Quantity} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td> {listValue.Price}</td>
                        <td style={{color:listValue.MarketValue<0 ? "red": ""}}> <NumberFormat value={listValue.MarketValue} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:listValue.PnL<0 ? "red": ""}}> <NumberFormat value={listValue.PnL} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:listValue.PnLDaily<0 ? "red": ""}}> <NumberFormat value={listValue.PnLDaily} displayType={'text'} thousandSeparator={true}  decimalScale={0} /></td>
                        <td style={{color:listValue.Return<0 ? "red": ""}}> <NumberFormat value={listValue.Return} displayType={'text'} thousandSeparator={true}  suffix={'%'} decimalScale={2} /></td>
                        <td><Button variant="outline-danger" size="sm" onClick={() => this.handleCloseTrade(listValue.ISIN,listValue.Quantity,listValue.BondName)}>Close Position</Button>&nbsp;&nbsp;
                        <Button variant="outline-primary" size="sm" onClick={() => this.handleViewTrades(listValue.ISIN)}>View Trades</Button></td>
                    </tr>);
                })}
                </tbody>
            </Table>
            <Pagination className="float-sm-right">{positionPageItems}</Pagination>
            </Tab>
            <Tab eventKey="Trades" title="Trades">
            
            <Table striped bordered hover variant={this.state.colorMode} responsive="sm">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Bond</th>
                    <th>ISIN</th>
                    <th>CCY</th>
                    <th>Quantity</th>
                    <th>Purchase Date</th>
                    <th>Purchase Price</th>
                    <th>Purchase CPV</th>
                    <th>Purchase AI</th>
                    <th>Purchase DPV</th>
                    <th>Current Price</th>
                    <th>Current CPV</th>
                    <th>Current AI</th>
                    <th>Current DPV</th>
                    <th>Coupons Rec</th>
                    <th>Market Value</th>
                    <th>PnL</th>
                    <th><Button variant="outline-primary" size="sm" onClick={this.handleShowAllTrades}>Show All</Button>{' '}</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.DisplayTrades.map(( listValue, index ) => {

                  if(listValue.ISIN===this.state.selectedISIN || this.state.selectedISIN==="All"){
                    return (<tr key={index}>
                        <td>{index+1}</td>  
                        <td>{listValue.BondName}</td>
                        <td>{listValue.ISIN}</td>
                        <td>{listValue.CCY}</td>
                        <td style={{color:listValue.Quantity<0 ? "red": ""}}> <NumberFormat value={listValue.Quantity} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td>{listValue.Date}</td>
                        <td> <NumberFormat value={listValue.PurchasePrice} displayType={'text'} thousandSeparator={true} decimalScale={2} /></td>
                        <td style={{color:listValue.Purchase_CPV<0 ? "red": ""}}> <NumberFormat value={listValue.Purchase_CPV} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:listValue.Purchase_AI<0 ? "red": ""}}> <NumberFormat value={listValue.Purchase_AI} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:listValue.Purchase_DPV<0 ? "red": ""}}> <NumberFormat value={listValue.Purchase_DPV} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td>{listValue.TodayPrice}</td>
                        <td style={{color:listValue.Today_CPV<0 ? "red": ""}}> <NumberFormat value={listValue.Today_CPV} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:listValue.Today_AI<0 ? "red": ""}}> <NumberFormat value={listValue.Today_AI} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:listValue.Today_DPV<0 ? "red": ""}}> <NumberFormat value={listValue.Today_DPV} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:listValue.Coupons<0 ? "red": ""}}> <NumberFormat value={listValue.Coupons} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:(listValue.Today_DPV +listValue.Coupons)<0 ? "red": ""}}> <NumberFormat value={(listValue.Today_DPV +listValue.Coupons)} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>
                        <td style={{color:listValue.PnL<0 ? "red": ""}}> <NumberFormat value={listValue.PnL} displayType={'text'} thousandSeparator={true} decimalScale={0} /></td>                        
                        <td><Button variant="outline-danger" size="sm" onClick={() => this.handleDeleteTrade(listValue.TradeId)}>Delete</Button>&nbsp;&nbsp;
                        <Button variant="outline-warning" size="sm" onClick={() => this.handleEditTrade(listValue.TradeId,listValue.ISIN,listValue.Quantity,listValue.PurchasePrice,listValue.Date,listValue.BondName)}>Edit</Button></td>
                    </tr>);
                    }
                    else{
                      return null
                    }
                })}
                </tbody>
            </Table>
            <Pagination className="float-sm-right">{tradePageItems}</Pagination>
            </Tab>
            <Tab eventKey="Analytics" title="Analytics">
            <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
              <Row>
                <Col sm={4}>
                  <ListGroup>
                    <ListGroup.Item variant={this.state.colorMode} action href="#link1">
                      Issuer
                    </ListGroup.Item>
                    <ListGroup.Item variant={this.state.colorMode} action href="#link2">
                      Industry
                    </ListGroup.Item>
                    <ListGroup.Item variant={this.state.colorMode} action href="#link3">
                      Country of Risk
                    </ListGroup.Item>
                    <ListGroup.Item variant={this.state.colorMode} action href="#link4">
                      Issued Currency
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col sm={8}>
                  <Tab.Content>
                    <Tab.Pane eventKey="#link1">
                    <SectorChart labels={Object.keys(this.state.IssuerDivision)} data={Object.values(this.state.IssuerDivision)}></SectorChart>
                    </Tab.Pane>
                    <Tab.Pane eventKey="#link2">
                    <SectorChart labels={Object.keys(this.state.SectorDivision)} data={Object.values(this.state.SectorDivision)}></SectorChart>
                    </Tab.Pane>
                    <Tab.Pane eventKey="#link3">
                    <SectorChart labels={Object.keys(this.state.CountryDivision)} data={Object.values(this.state.CountryDivision)}></SectorChart>
                    </Tab.Pane>
                    <Tab.Pane eventKey="#link4">
                    <SectorChart labels={Object.keys(this.state.CurrencyDivision)} data={Object.values(this.state.CurrencyDivision)}></SectorChart>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
            
            </Tab>
            <Tab eventKey="Cashflows" title="Cashflows">
            <Tab.Container id="list-group-tabs-example"  defaultActiveKey="#cashflow1">
              <Row>
                <Col sm={4}>
                  <ListGroup onClick={this.handleClearCashflowDetails}>
                    <ListGroup.Item  variant ={this.state.colorMode} action href="#cashflow1">
                      Upcoming Coupons
                    </ListGroup.Item>
                    <ListGroup.Item  variant={this.state.colorMode} action href="#cashflow2">
                      Upcoming Redemptions
                    </ListGroup.Item>
                    <ListGroup.Item  variant={this.state.colorMode} action href="#cashflow3">
                      Upcoming Cashflows
                    </ListGroup.Item>
                    <ListGroup.Item  variant={this.state.colorMode} action href="#cashflow4">
                      Upcoming Call Dates
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                
                <Col>
                  {this.CurrentCashflowDetails()}
                </Col>
                </Row>
                <Row>
                <Col sm={4}>
                  
                </Col>
                <Col >
                  <Tab.Content>
                    <Tab.Pane eventKey="#cashflow1">
                    {this.CashflowTable("Coupons")}
                    </Tab.Pane>
                    <Tab.Pane eventKey="#cashflow2">
                    {this.CashflowTable("Redemptions")}
                    </Tab.Pane>
                    <Tab.Pane eventKey="#cashflow3">
                    {this.CashflowTable("Cashflows")}
                    </Tab.Pane>
                    <Tab.Pane eventKey="#cashflow4">
                    {this.CashflowTable("Cashflows")}
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
            
            </Tab>
        </Tabs>
        
        <Modal show={this.state.showModalAddTrade} onHide={this.handleModalAddTradeClose}>
            <Modal.Header closeButton>
            <Modal.Title>{this.state.TradeActionTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <AddTradeForm close={this.handleModalAddTradeCloseRefresh} 
              action ={this.state.TradeAction} universe={ISINList} 
              isin={this.state.selectedISIN} 
              date={this.state.selectedDate} 
              price={this.state.selectedPrice} 
              quantity={this.state.selectedQuantity} 
              bondname={this.state.selectedBondName}
              tradeid={this.state.selectedTradeId} 
              ViewTrades={this.handleViewTrades}/>
            </Modal.Body>
        </Modal>
        </Container>
        </Container>
        <div style={{backgroundColor: backgroundColor,height: '100vh'}}></div>
      </div>
      
      )
    }
  }

export default PortfolioManager