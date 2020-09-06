import React from "react";
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';

const LowerCaseButton = withStyles({
    root: {
      textTransform: 'none',
    },
  })(Button);

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, info) {
      this.setState({ hasError: true });
    }

    home() {
      this.setState({ hasError: false });
      this.props.history.push('/');
    }
  
    render() {
      if (this.state.hasError) {
        return (
            <div className="body-404">
              <div id="particles" className="particles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
        
              <main className="main-404">
                  <section className="button-404">
                      <h1>An error occurred!</h1>
                      <div>
                          <span className="circle-404">0</span>
                      </div>
                      <p className="p-404">We automatically sent this issue to the development team.</p>
                      <LowerCaseButton 
                        size="small" 
                        variant="outlined" 
                        color="secondary"
                        onClick={this.home.bind(this)}
                        >
                        Back to Home Page
                      </LowerCaseButton>
                  </section>
              </main>
            </div>
          );
      }
      return this.props.children;
    }
  }

  export default withRouter(ErrorBoundary);