import React from 'react';
import { useHistory } from "react-router";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import 'assets/scss/_404.scss';

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
              <h1>Page is currently unavailable!</h1>
              <div>
                  <span>5</span>
                  <span className="circle-404">0</span>
                  <span>0</span>
              </div>
              <p className="p-404">An internal server error occured. We'll be looking into it.</p>
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
