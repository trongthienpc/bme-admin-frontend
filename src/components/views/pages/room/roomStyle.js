import React, { useState, useEffect } from "react";
import { Button, Col } from "react-bootstrap";
import { actions, useStore } from "../../../../context";
import { delRoomStyle } from "../../../../context/actions";
import { DEL_SUCC, SER_ERROR } from "../../../../context/constant";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Row, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  deleteRoomById,
  getAllRoom,
  getRoomById,
} from "../../../../services/roomServices";

import AddRoomModal from "./_addRoomModal";
import UpdateRoomModal from "./_updateRoomModal";

const RoomStyle = () => {
  const [state, dispatch] = useStore();
  const [action, setAction] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [addStatus, setAddStatus] = useState(false);
  const { rooms } = state;

  const [imageState, setImageState] = useState([]);

  //  get rooms when element re-render
  // console.log(rooms);
  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await getAllRoom();
        toast.success(`Got total ${response.data.length} rooms`);
        dispatch(actions.loadRoomStyle(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    getRooms();
  }, [action]);

  const [lgShow, setlgShow] = useState(false);

  const [mdShow, setMdShow] = useState(false);

  const [deleteRoomId, setDeleteRoomId] = useState("");

  // update room
  const [updateShow, setUpdateShow] = useState();

  const [oldRoom, setOldRoom] = useState({});

  const handlEdit = async (id) => {
    try {
      const res = await getRoomById(id);
      if (res.data.success) {
        dispatch(actions.findRoom(res.data));
        setOldRoom(() => {
          const room = res.data.room;
          const roomJson = JSON.stringify(room);
          localStorage.setItem("room", roomJson);
          return room;
        });
        // setImageState(res.data.room.images);
      }
    } catch (error) {}
    setUpdateShow(true);
    setEditStatus(true);
  };

  // add new room
  const handleAdd = () => {
    setlgShow(true);
    setAddStatus(true);
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
    setAction(!action);
  };

  return (
    <div>
      <button className="btn btn-secondary mb-2" onClick={() => handleAdd()}>
        Add New
      </button>

      {/* list all rooms */}
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

      {/* modal update room */}
      {editStatus && (
        <UpdateRoomModal
          show={updateShow}
          setUpdateShow={setUpdateShow}
          action={action}
          setAction={setAction}
          // oldRoom={oldRoom}
          setOldRoom={setOldRoom}
          imageState={imageState}
          setImageState={setImageState}
          setEditStatus={setEditStatus}
        />
      )}
      {/* modal add new room */}
      {addStatus && (
        <AddRoomModal
          show={lgShow}
          setlgShow={setlgShow}
          action={action}
          setAction={setAction}
          setAddStatus={setAddStatus}
        />
      )}

      {/* modal delete room  */}
      <Modal size="md" show={mdShow} onHide={() => setMdShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <label>{oldRoom.name}</label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Are you sure delete this room?</label>
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
