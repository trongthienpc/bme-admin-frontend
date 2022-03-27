import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import UploadImage from "../../../../services/uploadImage";
import { default as cloudAPI } from "../../../../services/cloudUpload";
import { addEntity } from "../../../../services/foodService";
import { ADD_SUCC } from "../../../../context/constant";

const AddFoodModal = ({ show, setLgShow, setAddStatus, action, setAction }) => {
  const [entityState, setEntityState] = useState({
    name: "",
    price: 0,
    discount: 0,
    image: "",
  });
  const [imageState, setImageState] = useState();
  const handleClose = () => {
    setLgShow(false);
    setAddStatus(false);
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!imageState) return toast.warn("Please input food image");

    let secure_url = await cloudAPI(imageState);
    if (secure_url) entityState.image = secure_url;
    const formData = new FormData();
    formData.append("name", entityState.name);
    formData.append("price", entityState.price);
    formData.append("image", entityState.image);
    formData.append("discount", entityState.discount);

    try {
      const result = await addEntity(formData);
      if (result.data.success) {
        toast.success(ADD_SUCC);
        setLgShow(false);
      }
    } catch (error) {
      toast.error("There some error!");
      console.log(error);
    }
    setAction(!action);
    setImageState("");
  };
  const handleEntityChange = (e) => {
    setEntityState({
      ...entityState,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      {/* modal add new comment */}
      <Modal size="md" show={show} onHide={() => handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Add new food</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleAddSubmit}

            // encType="multipart/form-data"
          >
            <Form.Group controlId="formAvatar" className="mb-3">
              <Form.Label>Food image</Form.Label>
              <UploadImage setImageState={setImageState} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Food Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter customer name"
                name="name"
                value={entityState.name}
                onChange={handleEntityChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter food price"
                name="price"
                value={entityState.price}
                onChange={handleEntityChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="discount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter food price discount"
                name="discount"
                value={entityState.discount}
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

export default React.memo(AddFoodModal);
