import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
export default function LessonControlButtons() {
  return (
    <div className="d-flex align-items-center gap-2">
      <GreenCheckmark />
      <IoEllipsisVertical className="text-muted" style={{ cursor: "pointer", fontSize: "1.2rem" }} />
    </div>
  );
}
