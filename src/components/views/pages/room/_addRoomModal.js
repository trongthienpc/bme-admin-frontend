import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { actions, useStore } from "../../../../context";
import { addEntity } from "../../../../services/roomServices";
import { default as cloudAPI } from "../../../../services/cloudUpload";
import { toast, ToastContainer } from "react-toastify";
import { ADD_SUCC } from "../../../../context/constant";
// import UploadImage from "../../../../services/uploadImage";
import UploadImages from "../../../../services/uploadimages";

const AddRoomModal = ({ show, setlgShow, action, setAction, setAddStatus }) => {
  // console.log(action);
  const [state, dispatch] = useStore();
  const [roomState, setRoomState] = useState({
    name: "room name",
    description: "This is description for room style",
    image: "",
    max: "3 persons",
    bed: "1 bed",
    size: "25 m2",
    view: "Garden view",
    images: [],
  });
  function handleClose() {
    setlgShow(false);
    setAddStatus(false);
  }

  const [loading, setLoading] = useState(false);

  const [imageState, setImageState] = useState([]);
  const [cloudUrls, setCloudUrls] = useState([]);

  const handleSubmit = async (e) => {
    // console.log(imageState);
    e.preventDefault();
    setLoading(true);
    setCloudUrls([]);
    if (!imageState) toast.warn("Please input image!");
    else {
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
        // console.log("cloudUrls stringify: ", JSON.stringify(cloudUrls));
      } catch (error) {
        console.log(error);
      }
      // console.log("urls: ", JSON.parse(localStorage.getItem("urls")));

      const formData = new FormData();
      formData.append("name", roomState.name);
      formData.append("description", roomState.description);
      formData.append("max", roomState.max);
      formData.append("bed", roomState.bed);
      formData.append("size", roomState.size);
      formData.append("view", roomState.view);

      const urls = JSON.parse(localStorage.getItem("urls"));
      console.log(urls.length);
      if (urls.length > 0) {
        for (let i = 0; i < urls.length; i++) {
          formData.append("images[]", urls[i]);
        }
      }
      formData.append("image", urls[0]);
      const entity = await addEntity(formData);
      if (entity.data.success) {
        toast.success(ADD_SUCC);
        dispatch(actions.addRoomStyle(entity.data));
        console.log(entity.data.message);
      }
      setlgShow(false);
      setAction(!action);
    }
    setImageState([]);
    setLoading(false);
  };

  const handleChange = (e) => {
    setRoomState({
      ...roomState,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      {/* modal add new room */}
      <Modal
        size="lg"
        show={show}
        // onHide={() => setlgShow(false)}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add new room style
            {/* <pre>{JSON.stringify(roomState, null, '\t')}</pre> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}
            method="post"
            // encType="multipart/form-data"
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={roomState.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={roomState.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicMax">
              <Form.Label>Max person</Form.Label>
              <Form.Control
                type="text"
                name="max"
                value={roomState.max}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBed">
              <Form.Label>Number bed</Form.Label>
              <Form.Control
                type="text"
                name="bed"
                value={roomState.bed}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="size">
              <Form.Label>Room size</Form.Label>
              <Form.Control
                type="text"
                name="size"
                value={roomState.size}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="view">
              <Form.Label>Room view</Form.Label>
              <Form.Control
                type="text"
                name="view"
                value={roomState.view}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Image</Form.Label>
              {/* <UploadImage setImageState={setImageState} /> */}
              <UploadImages setImageState={setImageState} />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={
                imageState &&
                roomState.name &&
                roomState.max &&
                roomState.bed &&
                roomState.size &&
                roomState.view &&
                roomState.description &&
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

export default React.memo(AddRoomModal);
