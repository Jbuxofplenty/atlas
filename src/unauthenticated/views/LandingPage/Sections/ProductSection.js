import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Let{"'"}s talk Atlas</h2>
          <h5 className={classes.description}>
          Why check multiple brokerage apps throughout the day just to end up missing the news? 
          At Atlas, we believe in giving you secure, single-point monitoring of your assets. 
          From cryptocurrencies to your 401k, securely link all your investment accounts and stay up-to-date with your true net worth.
          </h5>
          <h5 className={classes.description}>
          What’s next at Atlas? Since our founders invest like you, we know your investment strategy is often social. From friends to family to a professional advisor, strategies need to be discussed. We’re working hard to create group chats, investment clubs, and a real-time investment simulator for our users to flex their investment strategies before execution. 
          Assemble your friends, commit funds, collectively decide what tickers to buy or sell and watch your club’s portfolio value soar.
            more.
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Community"
              description="Feature coming soon: chat. Find friends, send them stock picks, collaborate, execute. Don’t bog down your other messaging apps with stonk talk. Consolidate all of your investment efforts onto the Atlas platform."
              icon={Chat}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Reliability"
              description="Account protection is our highest priority. We use OAuth 2 read-only authorization tokens with our supported financial institutions to keep you in the driver’s seat and your login credentials safe."
              icon={VerifiedUser}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Security"
              description="Opt-in to our End-to-End Encryption (E2EE) feature to keep your information that much safer. Security is a core value at Atlas. Not only will your financial information remain secure, but so will your personal data. Your data is exactly that: yours. Not even Atlas representatives will be able to see what’s in your account."
              icon={Fingerprint}
              iconColor="danger"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
