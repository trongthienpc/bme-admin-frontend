import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { actions, useStore } from "../../../../context";
import { UPDATE_SUCC } from "../../../../context/constant";
import { updateRoomById } from "../../../../services/roomServices";
import { default as cloudAPI } from "../../../../services/cloudUpload";
import { toast, ToastContainer } from "react-toastify";
// import UploadImage from "../../../../services/uploadImage";
import UploadImages from "../../../../services/uploadimages";

const UpdateRoomModal = ({
  show,
  setUpdateShow,
  action,
  setAction,
  // oldRoom,
  // setOldRoom,
  // imageState,
  // setImageState,
  setEditStatus,
}) => {
  console.log("call update room modal");
  const [state, dispatch] = useStore();
  const [loading, setLoading] = useState(false);
  const [cloudUrls, setCloudUrls] = useState([]);

  const [oldRoom, setOldRoom] = useState(() => {
    const oldRoomJson = localStorage.getItem("room") || "";
    const oldRoom = JSON.parse(oldRoomJson) || {};
    return oldRoom;
  });

  const [imageState, setImageState] = useState(() => {
    const images = oldRoom.images;
    return images;
  });

  const editAction = true;

  function handleClose() {
    setUpdateShow(false);
    setEditStatus(false);
  }

  const handleUpdateChange = (e) => {
    console.log("input changes ==============>");
    setOldRoom({
      ...oldRoom,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    let id = oldRoom._id;

    if (oldRoom.images !== imageState) {
      try {
        for (let i = 0; i < imageState.length; i++) {
          const secure_url = await cloudAPI(imageState[i]);
          setCloudUrls((prev) => {
            const listUrl = [...prev, secure_url];
            const listUrlJson = JSON.stringify(listUrl);
            localStorage.setItem("urls", listUrlJson);
            return listUrl;
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      oldRoom.images = imageState;
    }

    const formData = new FormData();
    formData.append("name", oldRoom.name);
    formData.append("max", oldRoom.max);
    formData.append("bed", oldRoom.bed);
    formData.append("size", oldRoom.size);
    formData.append("view", oldRoom.view);
    formData.append("description", oldRoom.description);

    const urls = JSON.parse(localStorage.getItem("urls"));

    if (urls.length > 0) {
      for (let i = 0; i < urls.length; i++) {
        formData.append("images[]", urls[i]);
      }
    }
    formData.append("image", urls[0]);

    const response = await updateRoomById(id, formData);

    if (response.data.success) {
      dispatch(actions.updateRoom(response.data));
      console.log(response.data.message);
      setUpdateShow(false);
      toast.success(UPDATE_SUCC);
      setImageState("");
      setAction(!action);
    }
  };
  return (
    <>
      {/* modal update room */}
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{oldRoom.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate} method="post">
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={oldRoom.name}
                onChange={handleUpdateChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={oldRoom.description}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicMax">
              <Form.Label>Max person</Form.Label>
              <Form.Control
                type="text"
                name="max"
                value={oldRoom.max}
                onChange={handleUpdateChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBed">
              <Form.Label>Number Bed</Form.Label>
              <Form.Control
                type="text"
                name="bed"
                value={oldRoom.bed}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="size">
              <Form.Label>Room size</Form.Label>
              <Form.Control
                type="text"
                name="size"
                value={oldRoom.size}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="view">
              <Form.Label>Room view</Form.Label>
              <Form.Control
                type="text"
                name="view"
                value={oldRoom.view}
                onChange={handleUpdateChange}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Image</Form.Label>
              <UploadImages
                setImageState={setImageState}
                imageState={imageState}
                editAction={editAction}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={
                oldRoom.bed &&
                oldRoom.max &&
                oldRoom.name &&
                oldRoom.description &&
                oldRoom.size &&
                oldRoom.view &&
                !loading
                  ? false
                  : true
              }
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default UpdateRoomModal;
