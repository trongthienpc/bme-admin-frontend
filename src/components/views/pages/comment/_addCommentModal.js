import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import { getAll, addEntity } from "../../../../services/commentService";
import { ADD_SUCC } from "../../../../context/constant";
require("date-format-lite");

const AddCommentModal = ({
  show,
  setlgShow,
  action,
  setAction,
  setAddStatus,
}) => {
  console.log("call add comment modal");

  const handleClose = () => {
    setlgShow(false);
    setAddStatus(false);
  };
  const d = new Date();
  const [entityState, setEntityState] = useState({
    name: "",
    nation: "",
    comment: "",
    date: moment(d).format("YYYY-MM-DD"),
  });
  const handleEntityChange = (e) => {
    setEntityState({
      ...entityState,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    console.log(entityState);
    const formData = new FormData();
    formData.append("name", entityState.name);
    formData.append("nation", entityState.nation);
    formData.append("comment", entityState.comment);
    formData.append("date", entityState.date);
    try {
      const response = await addEntity(formData);

      if (response.data.success) {
        toast.success(ADD_SUCC);
        setlgShow(false);
      }
    } catch (error) {
      toast.error("Have error, please do it later");
      console.log(error);
    }
    setAction(!action);
  };
  return (
    <>
      {/* modal add new comment */}
      <Modal size="md" show={show} onHide={() => handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Add new comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleAddSubmit}

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
                rows={5}
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
                value={entityState.date}
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
                Add
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default React.memo(AddCommentModal);
