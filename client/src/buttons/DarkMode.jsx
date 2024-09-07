import React from "react";
import PropTypes from "prop-types";
import "./DarkMode.css"; // Import the CSS (Add this file in the same directory)

function DarkMode({ extraClasses }) {
  const [dark, setDark] = React.useState(true); // Default is dark mode

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };
  return (
    <>
      <div className={extraClasses}>
        <label
          htmlFor="themeToggle"
          className="themeToggle st-sunMoonThemeToggleBtn"
        >
          <input
            type="checkbox"
            id="themeToggle"
            className="themeToggleInput"
            onChange={darkModeHandler}
            checked={!dark} // Toggle based on state
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="none"
          >
            <mask id="moon-mask">
              <rect x="0" y="0" width="20" height="20" fill="white"></rect>
              <circle cx="11" cy="3" r="8" fill="black"></circle>
            </mask>
            <circle
              className="sunMoon text-blue-950 dark:text-white"
              cx="10"
              cy="10"
              r="8"
              mask="url(#moon-mask)"
            ></circle>
            <g>
              <circle
                className="sunRay sunRay1"
                cx="18"
                cy="10"
                r="1.5"
              ></circle>
              <circle
                className="sunRay sunRay2"
                cx="14"
                cy="16.928"
                r="1.5"
              ></circle>
              <circle
                className="sunRay sunRay3"
                cx="6"
                cy="16.928"
                r="1.5"
              ></circle>
              <circle
                className="sunRay sunRay4"
                cx="2"
                cy="10"
                r="1.5"
              ></circle>
              <circle
                className="sunRay sunRay5"
                cx="6"
                cy="3.1718"
                r="1.5"
              ></circle>
              <circle
                className="sunRay sunRay6"
                cx="14"
                cy="3.1718"
                r="1.5"
              ></circle>
            </g>
          </svg>
        </label>
      </div>
    </>
  );
}

DarkMode.propTypes = {
  extraClasses: PropTypes.string,
};

export default DarkMode;
