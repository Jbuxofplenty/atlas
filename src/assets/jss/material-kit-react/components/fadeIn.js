const fadeInStyle = {
  fadeInSection: {
    opacity: "0",
    transform: "translateY(10vh)",
    visibility: "hidden",
  },
  top: {
    transition: "opacity 0.8s ease-out, transform 1.2s ease-out",
    willChange: "opacity, visibility",
  },
  isVisible: {
    opacity: "1",
    transform: "none",
    visibility: "visible",
  }
};

export default fadeInStyle;
