import "./DesiredGrowth.scss";
import { Button } from "antd";
import { ArrowForward } from "@material-ui/icons";

const DesiredGrowth = () => {
  return (
    <div className="desired-growth-container">
      <div className="label">Desired Growth %</div>
      <div className="input-custom-container">
        <input
          id="desired-growth-input"
          placeholder="Input %"
          disabled={true}
        />
        <Button className="input-btn" disabled={true} icon={<ArrowForward />} />
      </div>
      <div className="border-line"></div>
      <div></div>
    </div>
  );
};

export default DesiredGrowth;
