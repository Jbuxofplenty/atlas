import React from 'react';
import {
  Row,
  Col,
  Container,
} from 'reactstrap';

import AccountsWidget from './components/AccountsWidget';
import CandlestickWidget from './components/CandlestickWidget';

import { dataActions } from 'actions';

import s from './Dashboard.module.scss';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accounts: null,
    };

    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    var tempAccounts = this._isMounted && await dataActions.getFinancialData("accounts");
    var accounts = [];
    for (var key in tempAccounts){
      accounts.push(tempAccounts[key]);
    }
    this._isMounted && this.setState({ accounts });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className={s.root}>
        {this.state.accounts &&
          <>
            <h1 className="page-title">Dashboard &nbsp;</h1>
            <Container className="w-100">
              <Row>
                <Col lg={12} xs={12}>
                  <CandlestickWidget />
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={12}>
                  <AccountsWidget accounts={this.state.accounts} />
                </Col>
              </Row>
            </Container>
          </>
        }
      </div>
    );
  }
}

export default Dashboard;
