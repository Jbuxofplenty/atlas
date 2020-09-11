const fadeInStyle = {
  fadeInSection: {
    opacity: "0",
    transform: "translateY(40vh)",
    visibility: "hidden",
    transition: "opacity 0.6s ease-out, transform 1.2s ease-out",
    willChange: "opacity, visibility",
  },
  isVisible: {
    opacity: "1",
    transform: "none",
    visibility: "visible",
  }
};

export default fadeInStyle;
