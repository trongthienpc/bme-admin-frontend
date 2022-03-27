import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import UploadImage from "../../../../services/uploadImage";
import { default as cloudAPI } from "../../../../services/cloudUpload";
import { UPDATE_SUCC } from "../../../../context/constant";
import { updateById } from "../../../../services/foodService";

const EditFoodModal = ({
  show,
  setMdShow,
  entityState,
  setEntityState,
  action,
  setAction,
}) => {
  const handleEntityChange = (e) => {
    setEntityState({
      ...entityState,
      [e.target.name]: e.target.value,
    });
  };

  const [imageState, setImageState] = useState(() => {
    const image = entityState.image;
    return image;
  });

  const handleClose = () => {
    setMdShow(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (entityState.image !== imageState) {
      let secure_url = await cloudAPI(imageState);
      if (secure_url) {
        entityState.image = secure_url;
        setImageState(secure_url);
      }
    } else entityState.image = imageState;

    const newFormData = new FormData();
    newFormData.append("name", entityState.name);
    newFormData.append("image", entityState.image);
    newFormData.append("price", entityState.price);
    newFormData.append("discount", entityState.discount);

    try {
      const res = await updateById(entityState._id, newFormData);
      if (res) toast.success(UPDATE_SUCC);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }

    setMdShow(false);
    setAction(!action);
    toast.success(UPDATE_SUCC);
    setImageState("");
  };
  return (
    <>
      {/* modal edit food */}
      <Modal size="md" show={show} onHide={() => handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Update food</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleUpdateSubmit}

            // encType="multipart/form-data"
          >
            <Form.Group controlId="formAvatar" className="mb-3">
              <Form.Label>Food image</Form.Label>
              <UploadImage
                setImageState={setImageState}
                imageState={entityState.image}
              />
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

export default React.memo(EditFoodModal);
