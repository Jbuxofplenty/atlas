import React, { Component } from 'react';
import ExploreIcon from '@material-ui/icons/Explore';
import { Navbar, Nav } from 'react-bootstrap';
import { dataActions } from '../../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export class NavBarPage extends Component {
  constructor(props) {
    super(props);
    this.home = this.home.bind(this);
  }

  home() {
    this.props.history.push('/home');
  }

  render() {
    return (
      <Navbar sticky="top" bg="light" expand="lg" className="justify-content-center bring-to-front">
        <Navbar.Brand style={{cursor: 'pointer'}} onClick={this.home}>
          <ExploreIcon style={{ fontSize: 40 }}/>
        </Navbar.Brand>
        <Navbar.Brand style={{cursor: 'pointer'}} onClick={this.home}>
          {'Atlas One'}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="text-center">
            <Nav.Link style={{cursor: 'pointer'}} onClick={this.home}>Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { user, userData } = authentication;
  return {
    user,
    userData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    dataReset: () => dispatch(dataActions.dataReset())
  };
}

const DefaultHeader = connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBarPage));
export default DefaultHeader;
