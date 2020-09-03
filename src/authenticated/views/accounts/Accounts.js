import React from 'react';
import {
  TabContent, 
  TabPane, 
  Nav, 
  NavItem, 
  NavLink, 
  InputGroup, 
  InputGroupAddon, 
  Input,
  InputGroupText,
  Row,
  Col,
} from 'reactstrap';
import classnames from 'classnames';

import s from './Accounts.module.scss';

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '2',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    return (
      <section className={`${s.root} mb-4`}>
        <h1 className="page-title">Accounts</h1>
        {/* tabs */}
        <Nav className="bg-transparent" tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <i className="icon-pane fa fa-plus"/>
              <span className="ml-xs">Add Account</span>
            </NavLink>
          </NavItem>
        </Nav>

        {/* tab content */}

        <TabContent activeTab={this.state.activeTab}>
          {/* tab #2 */}
          <TabPane tabId="2" className="py-5">
            <div>
              <h3 className="mb-3">Link an account</h3>
              <div className="d-flex flex-column justify-content-center">
                <InputGroup className={`align-self-center col-md-9 my-2 ${s.navbarForm} ${this.state.searchFocused ? s.navbarFormFocused : ''}`}>
                  <InputGroupAddon addonType="prepend" className={s.inputAddon}><InputGroupText><i className="fa fa-search" /></InputGroupText></InputGroupAddon>
                  <Input
                    id="search-input-2" placeholder="Enter trading platform or sign-in URL..." className="input-transparent"
                    onFocus={() => this.setState({ searchFocused: true })}
                    onBlur={() => this.setState({ searchFocused: false })}
                  />
                </InputGroup>
                <Row className="icon-list d-flex justify-content-center my-5">
                  <Col lg={4} md={6} xs={12} className="icon-list-item d-flex justify-content-center my-3 my-md-0"><a
                    href="../icon/university"
                  ><img className="align-self-center icon-list-item mr-2 mb-1" alt="bs" src="https://pbs.twimg.com/profile_images/1139570739747536896/HVEeWmV4.png"/> Coinbase</a></Col>
                  <Col lg={4} md={6} xs={12} className="icon-list-item d-flex justify-content-center my-3 my-md-0"><a
                    href="../icon/university"
                  ><img className="align-self-center icon-list-item mr-2 mb-1" alt="bs" src="data:image/png;base64,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"/> Robinhood</a></Col>
                </Row>
              </div>
            </div>
          </TabPane>
        </TabContent>
      </section>
    );
  }
}

export default Accounts;
