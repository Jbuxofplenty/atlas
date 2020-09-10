import React from 'react';
import { connect } from 'react-redux';
import { dataActions } from 'actions';
import {
  TabContent, 
  TabPane, 
  Nav, 
  NavItem, 
  NavLink, 
} from 'reactstrap';
import classnames from 'classnames';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";
import Button from "components/CustomButtons/Button.js";

// material-ui
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import s from './Profile.module.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '2',
      password: "",
      showPassword: false,
      backedUp: props.backedUp,
    };

  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  deleteBackup() {

  }

  render() {
    return (
      <section className={`${s.root} mb-4`}>
        <h1 className="page-title">Profile</h1>
        {/* tabs */}
        <Nav className="bg-transparent" tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <i className="icon-pane fa fa-lock"/>
              <span className="ml-xs">End to End Encryption</span>
            </NavLink>
          </NavItem>
        </Nav>

        {/* tab content */}

        <TabContent activeTab={this.state.activeTab}>
          {/* tab #2 */}
          <TabPane tabId="2" className="py-5">
            <div>
              {!this.state.backedUp ?
                <div>
                  <h3 className={`${s.header} mb-3`}>Backup Private Key</h3>
                  <div className="d-flex flex-column justify-content-center w-100">
                    <div className={`${s.rounded}`}></div>
                    <GridContainer justify="center" className={`${s.gridContainer}`}>
                      <GridItem xs={12} sm={12} md={6} className={`${s.instructionContainer}`}>
                        <div className={`${s.instructionText}`}>
                          Because this framework uses end-to-end encryption, it places
                          a larger burden on the user to manage encryption keys.
                          Generating a backup password for your private key is critical
                          because the key is located on your personal device. If you clear
                          your cache before making a backup password for your key, all
                          your encrypted financial data will need to be pulled from the
                          origin servers again.
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <AuthCustomInput
                          id="backup-password"
                          labelText="Backup Password"
                          value={this.state.password}
                          white
                          onChange={this.handleChange('password')}
                          fullWidth
                          inputProps={{
                            color: "secondary",
                            type: this.state.showPassword ? 'text' : 'password',
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="Toggle password visibility"
                                  onClick={this.handleClickShowPassword}
                                  color="secondary"
                                >
                                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </div>
                </div>
                :
                <div>
                  <h3 className={`${s.header} mb-3 mt-5`}>Restore Private Key</h3>
                  <div className="d-flex flex-column justify-content-center w-100">
                    <div className={`${s.rounded}`}></div>
                    <GridContainer justify="center" className={`${s.gridContainer}`}>
                      <GridItem xs={12} sm={12} md={6} className={`${s.instructionContainer}`}>
                        <div className={`${s.instructionText}`}>
                          Retrieve backed up private key from the cloud.  Enter the correct
                          password you used to backup your private key initially.
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <AuthCustomInput
                          id="restore-password"
                          labelText="Backup Password"
                          value={this.state.password}
                          white
                          onChange={this.handleChange('password')}
                          fullWidth
                          inputProps={{
                            color: "secondary",
                            type: this.state.showPassword ? 'text' : 'password',
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="Toggle password visibility"
                                  onClick={this.handleClickShowPassword}
                                  color="secondary"
                                >
                                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </div>
                  <h3 className={`${s.header} mb-3 mt-5`}>Update Private Key Password</h3>
                  <div className="d-flex flex-column justify-content-center w-100">
                    <div className={`${s.rounded}`}></div>
                    <GridContainer justify="center" className={`${s.gridContainer}`}>
                      <GridItem xs={12} sm={12} md={6}>
                        <AuthCustomInput
                          id="old-password"
                          labelText="Old Password"
                          value={this.state.password}
                          white
                          onChange={this.handleChange('password')}
                          fullWidth
                          inputProps={{
                            color: "secondary",
                            type: this.state.showPassword ? 'text' : 'password',
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="Toggle password visibility"
                                  onClick={this.handleClickShowPassword}
                                  color="secondary"
                                >
                                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <AuthCustomInput
                          id="new-password"
                          labelText="New Password"
                          value={this.state.password}
                          white
                          onChange={this.handleChange('password')}
                          fullWidth
                          inputProps={{
                            color: "secondary",
                            type: this.state.showPassword ? 'text' : 'password',
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="Toggle password visibility"
                                  onClick={this.handleClickShowPassword}
                                  color="secondary"
                                >
                                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </div>
                  <h3 className={`${s.header} mb-3 mt-5`}>Delete Private Key Backup</h3>
                  <div className="d-flex flex-column justify-content-center w-100">
                    <div className={`${s.rounded}`}></div>
                    <GridContainer justify="center" className={`${s.gridContainer}`}>
                      <GridItem xs={12} sm={12} md={6} className={`${s.instructionContainer}`}>
                        <div className={`${s.instructionText}`}>
                          Delete your backup private key stored in the cloud.  Be careful,
                          if you lose your existing key (from clearing you cache) you will
                          lose access to all of your encrypted financial data on this 
                          platform!
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6} className={`${s.instructionContainer}`}>
                        <Button 
                          color="danger" 
                          size="lg" 
                          onClick={this.deleteBackup()}
                        >
                          Delete Backup
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </div>
                </div>
              }
            </div>
          </TabPane>
        </TabContent>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    backedUp: state.eThree.backedUp,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    getInstitutions: () => dispatch(dataActions.getInstitutions()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
