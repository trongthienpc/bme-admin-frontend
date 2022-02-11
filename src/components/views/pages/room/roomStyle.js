import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useStore } from "../../../../context";
import { addRoomStyle } from "../../../../context/actions";
import { apiUrl } from "../../../../context/constant";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Table } from "react-bootstrap";
const RoomStyle = () => {
  const [state, dispatch] = useStore();

  const [imageState, setImageState] = useState(null);

  //check authenticated

  const { isAuthenticated } = state;

  if (isAuthenticated) {
  } else {
  }

  // list all room style
  const [rooms, setRooms] = useState();

  const getRooms = async () => {
    try {
      const res = axios.get(`${apiUrl}/rooms/all`);
      setRooms(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const [lgShow, setlgShow] = useState(false);

  const handleImage = (event) => {
    const file = event.target.files[0];
    setImageState(file);
  };

  const [roomState, setRoomState] = useState({
    name: "",
    description: "",
    image: null,
    max: 0,
    bed: 0,
  });

  const handleChange = (e) => {
    setRoomState({
      ...roomState,
      [e.target.name]: e.target.value,
    });
  };

  // add new room style

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageState) toast.warn("Input your message");
    else {
      const formData = new FormData();
      formData.append("name", roomState.name);
      formData.append("description", roomState.description);
      formData.append("max", roomState.max);
      formData.append("bed", roomState.bed);
      formData.append("image", imageState);

      try {
        const response = await axios.post(`${apiUrl}/room/add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status) toast.success(response.data.message);
        console.log(response);
        dispatch(addRoomStyle(response.data));
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Max Person</th>
            <th>Bed</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr>
              <td>{index}</td>
              <td>{room.name}</td>
              <td>{room.max}</td>
              <td>{room.bed}</td>
              <td>{room.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal size="lg" show={lgShow} onHide={() => setlgShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add new room style</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}
            method="post"
            encType="multipart/form-data"
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
                type="number"
                name="max"
                value={roomState.max}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBed">
              <Form.Label>Number formBasicBed</Form.Label>
              <Form.Control
                type="number"
                name="bed"
                value={roomState.bed}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImage} />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={imageState ? false : true}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default RoomStyle;
