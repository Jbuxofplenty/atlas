import React from "react";

// @material-ui
import { makeStyles } from "@material-ui/core/styles";

// nodejs library that concatenates classes
import classNames from "classnames";

import styles from "assets/jss/material-kit-react/components/fadeIn.js";

const useStyles = makeStyles(styles);

export default function FadeInSection(props) {
  const classes = useStyles();
  const [isVisible, setVisible] = React.useState(true);
  const domRef = React.useRef();
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    observer.observe(domRef.current);
    return () => observer.unobserve(domRef.current);
  }, []);
  var visibleClasses = '';
  if (isVisible) {
    visibleClasses = classNames(
      classes.isVisible
    );
  }
  return (
    <div
      className={`la la-refresh la-spin `}
      className={`${classes.fadeInSection} ${visibleClasses}`}
      ref={domRef}
    >
      {props.children}
    </div>
  );
}