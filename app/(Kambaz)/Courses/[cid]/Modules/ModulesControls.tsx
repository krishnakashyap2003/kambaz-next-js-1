"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";

interface ModulesControlsProps {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
  isFaculty: boolean;
}

export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
  isFaculty,
}: ModulesControlsProps) {
  if (!isFaculty) {
    return null;
  }

  return (
    <div
      id="wd-modules-controls"
      className="d-flex flex-wrap justify-content-end align-items-center gap-2 mb-3"
    >
      <Button 
        variant="secondary" 
        size="lg" 
        id="wd-collapse-all"
        className="wd-action-btn"
        style={{ height: "38px" }}
      >
        Collapse All
      </Button>

      <Button 
        variant="secondary" 
        size="lg" 
        id="wd-view-progress"
        className="wd-action-btn"
        style={{ height: "38px" }}
      >
        View Progress
      </Button>

      <Dropdown>
        <DropdownToggle 
          variant="success" 
          size="lg" 
          id="wd-publish-all-btn"
          className="wd-action-btn d-flex align-items-center justify-content-center gap-1"
          style={{ height: "38px" }}
        >
          <GreenCheckmark />
          <span>Publish All</span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem id="wd-publish-all" className="d-flex align-items-center">
            <GreenCheckmark />
            <span>Publish All</span>
          </DropdownItem>
          <DropdownItem id="wd-publish-all-modules-and-items" className="d-flex align-items-center">
            <GreenCheckmark />
            <span>Publish all modules and items</span>
          </DropdownItem>
          <DropdownItem id="wd-publish-modules-only" className="d-flex align-items-center">
            <GreenCheckmark />
            <span>Publish modules only</span>
          </DropdownItem>
          <DropdownItem id="wd-unpublish-all-modules-and-items" className="d-flex align-items-center">
            <GreenCheckmark />
            <span>Unpublish all modules and items</span>
          </DropdownItem>
          <DropdownItem id="wd-unpublish-modules-only" className="d-flex align-items-center">
            <GreenCheckmark />
            <span>Unpublish modules only</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Button
        variant="danger"
        size="lg"
        id="wd-add-module-btn"
        onClick={addModule}
        className="wd-action-btn d-flex align-items-center justify-content-center"
        style={{ height: "38px" }}
      >
        <FaPlus className="me-2" style={{ fontSize: "1rem" }} />
        <span>Module</span>
      </Button>
    </div>
  );
}