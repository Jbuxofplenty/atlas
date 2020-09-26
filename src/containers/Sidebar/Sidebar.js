import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup';

import { navigationActions} from 'actions';

class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    activeItem: '',
  };

  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
  }

  componentDidMount() {
    this.props.openSidebar();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.sidebarOpened !== this.props.sidebarOpened) {
      if (nextProps.sidebarOpened) {
        this.element.style.height = `${this.element.scrollHeight}px`;
      } else {
        this.element.classList.remove(s.sidebarOpen);
        setTimeout(() => {
          this.element.style.height = '';
        }, 0);
      }
    }
  }

  dismissAlert(id) {
  }

  doLogout() {
  }

  render() {
    return (
      <nav
        className={cx(s.root)}
        ref={(nav) => {
          this.element = nav;
        }}
      >
        <header className={s.logo}>
          <div onClick={() => this.props.history.push('/app/dashboard')}><span
            className="fw-bold">Atlas</span> One</div>
        </header>
        <ul className={s.nav}>
          <LinksGroup
            onActiveSidebarItemChange={t => this.props.changeActiveSidebarItem(t)}
            activeItem={this.props.activeItem}
            header="Dashboard"
            isHeader
            iconName="fi flaticon-home"
            link="/app/dashboard"
            index="main"
          />
          <h5 className={[s.navTitle, s.groupTitle].join(' ')}>Tools</h5>
          <LinksGroup
            onActiveSidebarItemChange={t => this.props.changeActiveSidebarItem(t)}
            activeItem={this.props.activeItem}
            header="Accounts"
            isHeader
            iconName="fa fa-user-circle"
            link="/app/accounts"
            index="accounts"
          />
          <LinksGroup
            onActiveSidebarItemChange={t => this.props.changeActiveSidebarItem(t)}
            activeItem={this.props.activeItem}
            header="Charts"
            isHeader
            iconName="fa fa-chart-bar"
            link="/app/charts"
            index="charts"
          />
          <LinksGroup
            onActiveSidebarItemChange={t => this.props.changeActiveSidebarItem(t)}
            activeItem={this.props.activeItem}
            header="Orders"
            isHeader
            iconName="fi flaticon-list"
            link="/app/orders"
            index="orders"
          />
        </ul>
      </nav>
    );
  }
}



function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    activeItem: store.navigation.activeItem,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    closeSidebar: () => dispatch(navigationActions.closeSidebar()),
    openSidebar: () => dispatch(navigationActions.openSidebar()),
    changeActiveSidebarItem: (t) => dispatch(navigationActions.changeActiveSidebarItem(t)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
