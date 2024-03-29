import React from "react";
import { useHistory } from "react-router";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import UnauthenticatedHeader from "containers/UnauthenticatedHeader/UnauthenticatedHeader.js";
import Footer from "containers/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import HeaderLinks from "containers/UnauthenticatedHeader/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import FadeIn from "components/FadeIn/FadeIn.js";

import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Sections for this page
import ProductSection from "./Sections/ProductSection.js";
import CarouselSection from "./Sections/CarouselSection.js";
import TeamSection from "./Sections/TeamSection.js";
import WorkSection from "./Sections/WorkSection.js";

// @font-awesome/icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const history = useHistory();
  const signup = () => {history.push('/signup')};

  return (
    <div>
      <UnauthenticatedHeader
        color="transparent"
        routes={dashboardRoutes}
        brand="Atlas One"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax filter image={require("assets/img/landing-bg.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={9}>
              <h1 className={classes.title}>All Your Accounts in One Place</h1>
              <h4>
              Atlas One is the premiere platform for the everyday investor. 
              View all of your portfolios in One place, track performance, compare tickers and strategize with friends.
              </h4>
              <br />
              <Button
                color="primary"
                size="lg"
                onClick={signup}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faSignInAlt} className={classes.socialIcons} style={{cursor: 'pointer'}} />
                Get Started
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <FadeIn>
            <ProductSection />
          </FadeIn>
          <FadeIn>
            <CarouselSection />
          </FadeIn>
          <FadeIn>
            <TeamSection />
          </FadeIn>
          <FadeIn>
            <WorkSection />
          </FadeIn>
        </div>
      </div>
      <Footer authenticated={false} />
    </div>
  );
}
