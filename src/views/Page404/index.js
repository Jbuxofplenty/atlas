import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const LowerCaseButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);

export default function Page500() {
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
          <section>
              <h1>Page not found!</h1>
              <div>
                  <span>5</span>
                  <span class="circle">0</span>
                  <span>0</span>
              </div>
              <p>We were unable to find the page you were looking for.</p>
              <LowerCaseButton size="small" variant="outlined" color="secondary">
                Back to Home Page
              </LowerCaseButton>
          </section>
      </main>
    </div>
  );
}
