import React from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router";
import { withStyles } from '@material-ui/core/styles';

const LowerCaseButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);

export default function Page500() {
  const history = useHistory();
  const home = () => {history.push('/')};

  return (
    <div className="body-404">
      <div id="particles" class="particles">
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
              <h1>Page not found!</h1>
              <div>
                  <span>4</span>
                  <span class="circle">0</span>
                  <span>4</span>
              </div>
              <p>We were unable to find the page you were looking for.</p>
              <LowerCaseButton 
                size="small" 
                variant="outlined" 
                color="secondary"
                onClick={home}
                >
                Back to Home Page
              </LowerCaseButton>
          </section>
      </main>
    </div>
  );
}
