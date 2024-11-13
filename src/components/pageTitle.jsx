import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from "prop-types";

const PageTitle = ({ title }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [location, title]);

  return null;
};

export default PageTitle;

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
