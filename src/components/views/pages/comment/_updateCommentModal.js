import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import { updateById } from "../../../../services/commentService";
import { actions, useStore } from "../../../../context";

const UpdateCommentModal = ({
  show,
  setlgShow,
  action,
  setAction,
  entityState,
  setEntityState,
}) => {
  const [state, dispatch] = useStore();
  console.log("call update modal");
  const handleClose = () => {
    setlgShow(false);
  };

  const handleEntityChange = (e) => {
    setEntityState({
      ...entityState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(entityState);
    const id = entityState._id;
    const commentForm = new FormData();
    commentForm.append("name", entityState.name);
    commentForm.append("nation", entityState.nation);
    commentForm.append("comment", entityState.comment);
    commentForm.append("date", entityState.date);

    try {
      await updateById(id, commentForm);
      setlgShow(false);
    } catch (error) {
      console.log(error);
    }
    setAction(!action);
  };

  return (
    <>
      {/* modal update comment */}
      <Modal size="md" show={show} onHide={() => handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Update comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}

            // encType="multipart/form-data"
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter customer name"
                name="name"
                value={entityState.name}
                onChange={handleEntityChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="nation">
              <Form.Label>Customer Nation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter customer nation"
                name="nation"
                value={entityState.nation}
                onChange={handleEntityChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="comment">
              <Form.Label>Customer Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comment"
                placeholder="enter customer comment"
                value={entityState.comment}
                onChange={handleEntityChange}
              />
            </Form.Group>
            <Form.Group controlId="dateComment">
              <Form.Label>Comment Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                placeholder="Date of Comment"
                value={moment(entityState.date).format("YYYY-MM-DD")}
                onChange={handleEntityChange}
              />
            </Form.Group>
            <Form.Group controlId="submit">
              <Button
                className="mt-3"
                name="submit"
                variant="primary"
                type="submit"
              >
                Update
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default React.memo(UpdateCommentModal);
