import React, { useState, useEffect } from "react";
import { Form, Button, Col, Image } from "react-bootstrap";
import { actions, useStore } from "../../../../context";
import { addRoomStyle, delRoomStyle } from "../../../../context/actions";
import {
    ADD_SUCC,
    DEL_SUCC,
    UPDATE_SUCC,
    SER_ERROR,
    apiUrl,
} from "../../../../context/constant";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Row, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    addEntity,
    deleteRoomById,
    getAllRoom,
    getRoomById,
    updateRoomById,
} from "../../../../services/roomServices";

import UploadImage from '../../uploadImage'
import axios from "axios";

const RoomStyle = () => {
    const [state, dispatch] = useStore();

    const [imageState, setImageState] = useState();

    const { roomStyles } = state;

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // list all room style
        const getRooms = async () => {
            try {
                const response = await getAllRoom();
                setRooms(response.data);
                dispatch(actions.loadRoomStyle(response.data));
            } catch (error) {
                console.log(error);
            }
        };
        getRooms();
    }, [rooms]);

    const [lgShow, setlgShow] = useState(false);

    const [mdShow, setMdShow] = useState(false);

    const [deleteRoomId, setDeleteRoomId] = useState("");

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImageState(file);
    };

    const [roomState, setRoomState] = useState({
        name: "",
        description: "This is description for room style",
        image: "",
        max: "persons",
        bed: "bed",
    });

    // update room
    const [updateShow, setUpdateShow] = useState(false);
    const [oldRoomId, setOldRoomId] = useState("");
    const [oldRoom, setOldRoom] = useState({});

    const handlEdit = async (id) => {
        setOldRoomId(id);
        try {
            const res = await getRoomById(id);
            if (res.data.success) {
                dispatch(actions.findRoom(res.data));
                setOldRoom(res.data.room);
                setImageState(res.data.room.image);
            }
        } catch (error) { }

        setUpdateShow(true);
    };
    const handleUpdateChange = (e) => {
        setOldRoom({
            ...oldRoom,
            [e.target.name]: e.target.value,
        });
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", oldRoom.name);
            formData.append("max", oldRoom.max);
            formData.append("bed", oldRoom.bed);
            formData.append("description", oldRoom.description);
            formData.append("image", imageState);

            const response = await updateRoomById(oldRoomId, formData);

            if (response.data.success) {
                dispatch(actions.updateRoom());
                setUpdateShow(false);
                toast.success(UPDATE_SUCC);
                setImageState("");
                // getRooms();
            }
        } catch (error) {
            console.log(error);
        }
    };
    // add new room style
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageState) toast.warn("Input your message");
        else {
            try {
                const cloudData = new FormData()
                cloudData.append("file", imageState)
                cloudData.append("upload_preset", "ueil3d5s")
                cloudData.append("folder", "test")
                const res = await
                    fetch("https://api.cloudinary.com/v1_1/thientt/upload", {
                        method: "POST",
                        body: cloudData
                    })
                        .then((response) => {
                            return response.json()
                        })
                        .then(data => {
                            if (data.secure_url !== '') {
                                roomState.image = data.secure_url
                            }
                        })
                        .catch(err => console.log(err))


            } catch (error) {
                console.log(error);
            }

            const formData = new FormData();
            formData.append("name", roomState.name);
            formData.append("description", roomState.description);
            formData.append("max", roomState.max);
            formData.append("bed", roomState.bed);
            formData.append("image", roomState.image)
            const entity = await addEntity(formData);
            if (entity.data.success) toast.success(ADD_SUCC);
            dispatch(addRoomStyle(entity.data));
            setlgShow(false);
        }
        setImageState("");
    };

    const handleChange = (e) => {
        setRoomState({
            ...roomState,
            [e.target.name]: e.target.value,
        });
    };

    const handleAdd = () => {
        // setImageState("");
        setlgShow(true);
    };

    // delete room
    const handleDelete = async (id) => {
        setDeleteRoomId(id);
        setMdShow(true);
    };

    const deleteRoom = async (id) => {
        try {
            const response = await deleteRoomById(deleteRoomId);
            if (response.data.success) dispatch(delRoomStyle(id));
            toast.success(DEL_SUCC);
            setMdShow(false);
        } catch (error) {
            setMdShow(false);
            return error.response.data
                ? error.response.data
                : { success: false, message: SER_ERROR };
        }

        setImageState("");
    };

    return (
        <div>
            <button className="btn btn-secondary mb-2" onClick={() => handleAdd()}>
                Add New
            </button>

            <Row xs={1} md={2} className="g-4">
                {rooms.map((room, index) => (
                    <Col key={index}>
                        <Card className="mb-2 h-100">
                            <Card.Img variant="top" src={room.image} />
                            <Card.Body>
                                <Card.Title>{room.name}</Card.Title>
                                <Card.Text>{room.description}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between">
                                <Button
                                    className="btn btn-primary m-2"
                                    onClick={() => handlEdit(room._id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    className="btn btn-warning m-2"
                                    onClick={() => handleDelete(room._id)}
                                >
                                    Delete
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* modal update new room */}
            <Modal size="lg" show={updateShow} onHide={() => setUpdateShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {/* Update Room */}
                        {oldRoomId}
                        {/* <pre>{JSON.stringify(roomState, null, '\t')}</pre> */}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={handleUpdate}
                        method="post"
                    // encType="multipart/form-data"
                    >
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
                            <Form.Label>Number formBasicBed</Form.Label>
                            <Form.Control
                                type="text"
                                name="bed"
                                value={oldRoom.bed}
                                onChange={handleUpdateChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleImage} />

                        </Form.Group>

                        <Image src={imageState} fluid rounded thumbnail className="mb-2" />

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={
                                oldRoom.bed &&
                                    oldRoom.max &&
                                    oldRoom.name &&
                                    oldRoom.description
                                    ? false
                                    : true
                            }
                        >
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* modal add new room */}
            <Modal size="lg" show={lgShow} onHide={() => setlgShow(false)}>
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
                            <Form.Label>Number formBasicBed</Form.Label>
                            <Form.Control
                                type="text"
                                name="bed"
                                value={roomState.bed}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            {/* <Form.Control type="file" name="image" onChange={handleImage} /> */}
                            {/* <FileBase64
                type="file"
                multiple={false}
                onDone={({ base64 }) => setImageState(base64)}
              /> */}
                            < UploadImage setImageState={setImageState} />
                        </Form.Group>

                        {/* <Image
                            src={imageState}
                            fluid
                            rounded
                            thumbnail
                            className="mb-2"
                            hidden={imageState ? false : true}
                        /> */}

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

            {/* modal delete room  */}
            <Modal size="md" show={mdShow} onHide={() => setMdShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <label>{deleteRoomId}</label>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>Are you sure delete this style room?</label>
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
                        onClick={() => deleteRoom(deleteRoomId)}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default RoomStyle;
