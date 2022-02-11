import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useStore } from "../../../../context";
const RoomStyle = () => {
  const [state, dispatch] = useStore();
  const { roomStyle } = state;

  const [roomState, setRoomState] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleSubmit = (e) => {
    setRoomState({
      ...roomState,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={roomState.name}
            onChange={handleSubmit}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={roomState.description}
            onChange={handleSubmit}
          />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            value={roomState.image}
            name="image"
            onChange={handleSubmit}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default RoomStyle;
