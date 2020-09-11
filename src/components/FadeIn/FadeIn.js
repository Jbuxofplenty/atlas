import React from "react";

// @material-ui
import { makeStyles } from "@material-ui/core/styles";

// nodejs library that concatenates classes
import classNames from "classnames";

import styles from "assets/jss/material-kit-react/components/fadeIn.js";

const useStyles = makeStyles(styles);

export default function FadeInSection(props) {
  const classes = useStyles();
  const [isVisible, setVisible] = React.useState(false);
  const [top, setTop] = React.useState(false);
  const domRef = React.useRef();
  React.useEffect(() => {
    var current = domRef.current;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {setVisible(entry.isIntersecting); setTop(entry.boundingClientRect.top > 0)});
    });
    observer.observe(current);
    return () => observer.unobserve(current);
  }, []);
  var visibleClasses = '';
  if (isVisible) {
    visibleClasses = classNames(
      classes.isVisible
    );
  }
  var topClasses = '';
  if (top) {
    topClasses = classNames(
      classes.top
    );
  }
  return (
    <div
      className={`${classes.fadeInSection} ${visibleClasses} ${topClasses}`}
      ref={domRef}
    >
      {props.children}
    </div>
  );
}