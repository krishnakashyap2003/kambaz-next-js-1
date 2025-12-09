import { FaCheckCircle, FaCircle } from "react-icons/fa";

export default function GreenCheckmark() {
  return (
    <span className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: "18px", height: "18px", marginRight: "4px" }}>
      <FaCircle className="text-white" style={{ fontSize: "16px", position: "absolute" }} />
      <FaCheckCircle className="text-success" style={{ fontSize: "14px", position: "absolute" }} />
    </span>
  );
}