import React from 'react';
import { connect } from 'react-redux';
import { dataActions } from 'actions';
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
  Table,
} from 'reactstrap';
import classnames from 'classnames';

import Modal from '@material-ui/core/Modal';
import Connect from "components/Connect/Connect.js";
import Account from "./components/Account.js";

import s from './Accounts.module.scss';

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 0,
      popularInstitutions: [],
      filteredInstitutions: [],
      allInstitutions: [],
      searchFocused: false,
      searchFilter: '',
      open: false,
      activeInstitution: {},
      accounts: null,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
    this._isMounted && this.props.getInstitutions();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(nextProps) {
    if(this.props.institutions !== nextProps.institutions ||
        this.props.userData !== nextProps.userData) {
      this.populateInstitutions();
    }
  }

  populateInstitutions() {
    var popularInstitutions = [];
    var filteredInstitutions = [];
    var allInstitutions = [];
    for (var key in this.props.institutions) {
      // Filter out previously added accounts
      const displayName = this.props.institutions[key].displayName;
      var checkAccounts = this.state.accounts.filter(account => (
        account.displayName === displayName
      ));
      if(checkAccounts.length === 0) {
        filteredInstitutions.push(this.props.institutions[key]);
        allInstitutions.push(this.props.institutions[key]);
        // Popular institutions
        if(popularInstitutions.length < 12 && this.props.institutions[key].popular)  {
          popularInstitutions.push(this.props.institutions[key]);
        }
      }
    }
    this.setState({filteredInstitutions, popularInstitutions, allInstitutions});
  }

  filterInstitutions(e) {
    const searchFilter = e.target.value.toLowerCase();
    const filteredInstitutions = this.state.allInstitutions.filter(item => {
      return Object.keys(item).some(key => {
          if(key !== "icon" && key !== "popular") return item[key].toLowerCase().includes(searchFilter)
          else return false;
        }
      );
    });
    this.setState({ searchFilter, filteredInstitutions })
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  // Modal
  handleOpen(activeInstitution) {
    this.setState({ activeInstitution, open: true });
  };

  handleClose() {
    this.setState({ activeInstitution: {}, open: false });
  };

  render() {
    return (
      <section className={`${s.root} mb-4`}>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div>
            <Connect institution={this.state.activeInstitution} handleClose={this.handleClose} />
          </div>
        </Modal>
        <h1 className="page-title">Accounts</h1>
        {this.state.accounts &&
          <>
            <Nav className="bg-transparent" tabs>
                {this.state.accounts.map((account, index) => 
                  <NavItem key={index}>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === index })}
                      onClick={() => { this.toggle(index); }}
                    >
                      <span className="ml-xs">{account.displayName}</span>
                    </NavLink>
                  </NavItem>
                )}
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === this.state.accounts.length })}
                  onClick={() => { this.toggle(this.state.accounts.length); }}
                >
                  <i className="icon-pane fa fa-plus"/>
                  <span className="ml-xs">Add Account</span>
                </NavLink>
              </NavItem>
            </Nav>

            {/* tab content */}

            <TabContent activeTab={this.state.activeTab}>
              {this.state.accounts.map((account, index) => 
                <Account key={index} account={account} tabId={index} />
              )}
              <TabPane tabId={this.state.accounts.length} className="py-5">
                <div>
                  <h3 className="mb-3">Link an account</h3>
                  <div className="d-flex flex-column justify-content-center">
                    <InputGroup className={`align-self-center col-md-9 my-2 ${s.navbarForm} ${this.state.searchFocused ? s.navbarFormFocused : ''}`}>
                      <InputGroupAddon addonType="prepend" className={s.inputAddon}><InputGroupText><i className="fa fa-search" /></InputGroupText></InputGroupAddon>
                      <Input
                        id="search-input-2" placeholder="Enter trading platform or sign-in URL..." className="input-transparent"
                        onFocus={() => this.setState({ searchFocused: true })}
                        onBlur={() => this.setState({ searchFocused: false })}
                        onChange={(e) => this.filterInstitutions(e)}
                      />
                    </InputGroup>
                    {this.state.searchFilter === '' ?
                      <Row className="icon-list d-flex justify-content-center align-items-center my-5">
                        {this.state.popularInstitutions.map((institution, index) => (
                          <Col lg={4} md={6} xs={12}  onClick={() => this.handleOpen(institution)} 
                              className={`icon-list-item d-flex justify-content-center align-items-center my-3 ${s.iconListItem}`} key={index}>
                            <img className={`${s.avatar} rounded-circle thumb-sm float-left mx-4`} alt="bs" src={institution.icon}/>
                            {institution.displayName}
                          </Col>
                          ))
                        }
                      </Row> :
                      <div className="align-self-center w-75">
                        <Table className="table-dark-hover">
                          <tbody>
                          {this.state.filteredInstitutions.map((institution, index) => (
                              <tr className={`${s.institutionListItem}`} key={index} onClick={() => this.handleOpen(institution)}>
                                <td><img className="align-self-center icon-list-item mr-2 mb-1" alt="bs" src={institution.icon}/></td>
                                <td>{institution.displayName}</td>
                                <td>{institution.url}</td>
                              </tr>
                            ))
                          }
                          </tbody>
                          {/* eslint-enable */}
                        </Table>
                      </div>
                    }
                  </div>
                </div>
              </TabPane>
            </TabContent>
          </>
      } 
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    institutions: state.data.institutions,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    getInstitutions: () => dispatch(dataActions.getInstitutions()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
