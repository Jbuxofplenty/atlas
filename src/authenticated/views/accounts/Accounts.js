import React, { useEffect, useState, useCallback } from 'react';
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
import { Card } from '@material-ui/core';
import classnames from 'classnames';

import Modal from '@material-ui/core/Modal';
import Connect from "components/Connect/Connect.js";
import Account from "./components/Account.js";

// OAuth
import OAuthObject from 'oauth2';
import { createLinkToken, getAccessToken } from 'oauth2/plaid';
import { usePlaidLink } from 'react-plaid-link';

import s from './Accounts.module.scss';

const plaidIcon = 'data:image/png;base64,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';

function Accounts(props) {
  const [activeTab, setActiveTab] = useState(0);
  const [popularInstitutions, setPopularInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [connectOpen, setConnectOpen] = useState(false);
  const [activeInstitution, setActiveInstitution] = useState({});
  const [accounts, setAccounts] = useState(null);
  const [linkToken, setLinkToken] = useState('temp');

  const onSuccess = useCallback(async (publicToken, metadata) => {
    var accessToken = await getAccessToken(publicToken);
    var plaidObject = OAuthObject['Plaid'];
    plaidObject.setupAccount(metadata, accessToken);
  }, []);
 
  const config = {
    token: linkToken,
    onSuccess,
    // ...
  };
 
  const { open, ready } = usePlaidLink(config);

  const plaidLink = () => {
    if(!ready) return;
    open();
  }

  useEffect(() => {
    props.getInstitutions();
    getLinkToken();
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateAccounts();
    // eslint-disable-next-line
  }, [props.institutions, props.userData, props.data]);

  const getLinkToken = async () => {
    var data = await createLinkToken();
    setLinkToken(data.link_token);
  }

  const updateAccounts = async () => {
    var accountsObject = await dataActions.getFinancialData("accounts");
    var tempAccounts = [];
    for (var key in accountsObject){
      tempAccounts.push(accountsObject[key]);
    }
    setAccounts(tempAccounts);
    populateInstitutions(tempAccounts);
  }

  const populateInstitutions = (tempAccounts) => {
    var popularInstitutions = [];
    var filteredInstitutions = [];
    var allInstitutions = [];
    for (var key in props.institutions) {
      // Filter out previously added accounts
      const displayName = props.institutions[key].displayName;
      var checkAccounts = tempAccounts.filter(account => (
        account.displayName === displayName
      ));
      if(checkAccounts.length === 0) {
        filteredInstitutions.push(props.institutions[key]);
        allInstitutions.push(props.institutions[key]);
        // Popular institutions
        if(popularInstitutions.length < 12 && props.institutions[key].popular)  {
          popularInstitutions.push(props.institutions[key]);
        }
      }
    }
    setSearchFilter(searchFilter);
    setFilteredInstitutions(filteredInstitutions);
    setPopularInstitutions(popularInstitutions);
    setAllInstitutions(allInstitutions);
  }

  const filterInstitutions = (e) => {
    const searchFilter = e.target.value.toLowerCase();
    const filteredInstitutions = allInstitutions.filter(item => {
      return Object.keys(item).some(key => {
          if(key !== "icon" && key !== "popular") return item[key].toLowerCase().includes(searchFilter)
          else return false;
        }
      );
    });
    setSearchFilter(searchFilter);
    setFilteredInstitutions(filteredInstitutions);
  }

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }

  // Modal
  const handleOpen = (activeInstitution) => {
    setActiveInstitution(activeInstitution);
    setConnectOpen(true)
  };

  const handleClose = () => {
    setActiveInstitution({});
    setConnectOpen(false)
  };

  return (
    <section className={`${s.root} mb-4`}>
      <Modal
        open={connectOpen}
        onClose={handleClose}
      >
        <div>
          <Connect institution={activeInstitution} handleClose={handleClose} />
        </div>
      </Modal>
      <h1 className="page-title">Accounts</h1>
      {accounts &&
        <>
          <Nav className="bg-transparent" tabs>
              {accounts.map((account, index) => 
                <NavItem key={index}>
                  <NavLink
                    className={classnames({ active: activeTab === index })}
                    onClick={() => { toggle(index); }}
                  >
                    <span className="ml-xs">{account.displayName}</span>
                  </NavLink>
                </NavItem>
              )}
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === accounts.length })}
                onClick={() => { toggle(accounts.length); }}
              >
                <i className="icon-pane fa fa-plus"/>
                <span className="ml-xs">Add Account</span>
              </NavLink>
            </NavItem>
          </Nav>

          {/* tab content */}

          <TabContent activeTab={activeTab}>
            {accounts.map((account, index) => 
              <Account key={index} account={account} tabId={index} />
            )}
            <TabPane tabId={accounts.length} className="py-5">
              <div>
                <h3 className="mb-3">Link an account</h3>
                <div className="d-flex flex-column justify-content-center">
                  <div className="d-flex flex-column justify-content-center my-5">
                  <Col lg={9} md={12} xs={12}  onClick={() => plaidLink()} className="align-self-center">
                    <Card className={`p-5 icon-list-item d-flex justify-content-center align-items-center my-3 ${s.iconListItem}`} raised>
                      <img className={`${s.avatar} rounded-circle thumb-sm float-left mr-4`} alt="bs" src={plaidIcon}/>
                      Link an account with Plaid
                    </Card>
                  </Col>
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <div className={`${s.accountSeparator}`}></div>
                    <div className={`${s.orText}`}>Or</div>
                    <div className={`${s.accountSeparator}`}></div>
                  </div>
                  <InputGroup className={`align-self-center col-md-9 mb-2 mt-5 ${s.navbarForm} ${searchFocused ? s.navbarFormFocused : ''}`}>
                    <InputGroupAddon addonType="prepend" className={s.inputAddon}><InputGroupText><i className="fa fa-search" /></InputGroupText></InputGroupAddon>
                    <Input
                      id="search-input-2" placeholder="Enter trading platform or sign-in URL..." className="input-transparent"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      onChange={(e) => filterInstitutions(e)}
                    />
                  </InputGroup>
                  {searchFilter === '' ?
                    <Row className="icon-list d-flex justify-content-center align-items-center my-5">
                      {popularInstitutions.map((institution, index) => (
                          <Col lg={6} md={12} xs={12}  onClick={() => handleOpen(institution)} 
                                key={index}>
                            <Card className={`p-5 icon-list-item d-flex justify-content-center align-items-center my-3 ${s.iconListItem}`} raised>
                              <img className={`${s.avatar} rounded-circle thumb-sm float-left mr-4`} alt="bs" src={institution.icon}/>
                              {institution.displayName}
                            </Card>
                          </Col>
                        ))
                      }
                    </Row> :
                    <div className="align-self-center w-75">
                      <Table className="table-dark-hover">
                        <tbody>
                        {filteredInstitutions.map((institution, index) => (
                            <tr className={`${s.institutionListItem}`} key={index} onClick={() => handleOpen(institution)}>
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

const mapStateToProps = (store) => {
  return {
    institutions: store.data.institutions,
    data: store.data.accounts,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    getInstitutions: () => dispatch(dataActions.getInstitutions()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
