import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { FaTrash, FaPencil } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";

export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}) {
  return (
    <div className="d-flex align-items-center gap-2">
      {/* Edit button (Pencil icon) */}
      <FaPencil
        onClick={() => editModule(moduleId)}
        className="text-primary"
        style={{ cursor: "pointer", fontSize: "1.1rem" }}
      />

      {/* Trashcan icon */}
      <FaTrash
        className="text-danger"
        style={{ cursor: "pointer", fontSize: "1.1rem" }}
        onClick={() => deleteModule(moduleId)}
      />

      {/* Checkmark */}
      <GreenCheckmark />

      {/* Plus icon */}
      <BsPlus className="text-muted" style={{ cursor: "pointer", fontSize: "1.2rem" }} />

      {/* Ellipsis icon */}
      <IoEllipsisVertical className="text-muted" style={{ cursor: "pointer", fontSize: "1.2rem" }} />
    </div>
  );
}
