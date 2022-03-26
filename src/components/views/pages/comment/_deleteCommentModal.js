import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useStore, actions } from "../../../../context";
import { DEL_SUCC, SER_ERROR } from "../../../../context/constant";
import { deleteById } from "../../../../services/commentService";

const DeleteCommentModal = ({
  show,
  setMdShow,
  entityState,
  setAction,
  action,
}) => {
  const [state, dispatch] = useStore();
  const deleteEntity = async (id) => {
    try {
      const response = await deleteById(id);
      if (response.data.success) dispatch(actions.deleteComment(id));
      toast.success(DEL_SUCC);
      setMdShow(false);
    } catch (error) {
      setMdShow(false);
      return error.response.data
        ? error.response.data
        : { success: false, message: SER_ERROR };
    }

    setAction(!action);
  };

  return (
    <div>
      <Modal size="md" show={show} onHide={() => setMdShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <label>Delete comfirm</label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Are you sure delete this comment?</label>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            className="btn btn-primary m-2"
            onClick={() => setMdShow(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-warning m-2"
            onClick={() => deleteEntity(entityState._id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteCommentModal;
