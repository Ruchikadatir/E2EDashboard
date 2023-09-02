import React from "react";
const SufficiencyIcon = ({ fillActive }) => {
  return (
    <>
      <svg width="100" height="45" viewBox="0 0 50 156" fill="none">
        <g style="mix-blend-mode:multiply">
          <rect
            width="230"
            height="150"
            transform="matrix(-0.933711 -0.358027 -0.358027 0.933711 186.27 56.8984)"
            fill="url(#pattern0)"
          />
          <text
            x="0"
            y="98"
            font-family="Optima"
            font-size="35"
            font-weight="900"
            fill="#000000"
          >
            {fillActive}
          </text>
        </g>
      </svg>
    </>
  );
};
export default SufficiencyIcon;
