"use client";

import { Modal, FormControl, Button } from "react-bootstrap";

interface ModuleEditorProps {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  moduleName: string;
  setModuleName: (name: string) => void;
  addModule: () => void;
}

export default function ModuleEditor({
  show,
  handleClose,
  dialogTitle,
  moduleName,
  setModuleName,
  addModule,
}: ModuleEditorProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormControl
          value={moduleName}
          placeholder="Enter module name"
          onChange={(e) => setModuleName(e.target.value)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            addModule();
          }}
        >
          {dialogTitle === "Edit Module" ? "Update Module" : "Add Module"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
