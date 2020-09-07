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

import s from './Accounts.module.scss';

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '2',
      popularInstitutions: [],
      filteredInstitutions: [],
      allInstitutions: [],
      searchFocused: false,
      searchFilter: '',
      open: false,
      activeInstitution: {},
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.populateInstitutions();
  }

  async populateInstitutions() {
    await this.props.getInstitutions();
    var popularInstitutions = [];
    var filteredInstitutions = [];
    var allInstitutions = [];
    for (var key in this.props.institutions){
      filteredInstitutions.push(this.props.institutions[key]);
      allInstitutions.push(this.props.institutions[key]);
      // Popular institutions
      if(popularInstitutions.length < 10 && this.props.institutions[key].popular)  {
        popularInstitutions.push(this.props.institutions[key]);
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
                    onChange={(e) => this.filterInstitutions(e)}
                  />
                </InputGroup>
                {this.state.searchFilter === '' ?
                  <Row className="icon-list d-flex justify-content-center my-5">
                    {this.state.popularInstitutions.map((institution, index) => (
                      <Col lg={4} md={6} xs={12}  onClick={() => this.handleOpen(institution)} 
                          className={`icon-list-item d-flex justify-content-center my-3 my-md-0 ${s.iconListItem}`} key={index}>
                        <img className={`${s.avatar} rounded-circle thumb-sm float-left ml-2 mr-2`} alt="bs" src={institution.icon}/>
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
