import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

class BreadcrumbHistory extends Component {

  renderBreadCrumbs = () => {
    let route = this.props.url.split('/')
    .slice(1)
    .map(route => route
      .split('-')
      .map(word => {if(word[0]) {return word[0].toUpperCase() + word.slice(1)} return ''})
      .join(' ')
    )
    const length = route.length;
    return route.map((item,index) => (
      length === index + 1 ? 
      <BreadcrumbItem key={index} className="active"><strong>{item}</strong></BreadcrumbItem> : 
      <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
    ))
  }
  
  render() {
    return (
      <>
        { this.props.url !== '/app/chat' ?
          <div>
            <Breadcrumb tag="nav" listTag="div">
              <BreadcrumbItem>Atlas One</BreadcrumbItem>
              {this.renderBreadCrumbs()}
            </Breadcrumb>
          </div>
        :null}
      </>
    )
  };
};

export default BreadcrumbHistory;