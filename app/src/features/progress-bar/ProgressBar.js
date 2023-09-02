import React from "react";

const ProgressBar = ({ bgcolor, progress, height }) => {
  const parentDiv = {
    height: 30,
    width: "100%",
    background: "#E8E9EC",
    borderRadius: "4px 4px 0px 0px",
  };

  const childDiv = {
    display: "flex",
    alignItems: "center",
    height: "100%",
    width: `${progress}%`,
    background: bgcolor,
    borderRadius: "4px 4px 0px 0px",
    textAlign: "left",
  };

  const progresstext = {
    fontFamily: "noto-sans-bold",
    whiteSpace: "nowrap",
    marginLeft: 2,
    color: "#0D1640",
    fontWeight: 700,
  };

  return (
    <div style={parentDiv}>
      <div style={childDiv}>
        <span style={progresstext}>{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
