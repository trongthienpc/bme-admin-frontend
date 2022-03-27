import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { deleteById, getAll } from "../../../../services/foodService";
import "./food.css";
import AddFoodModal from "./_addFoodModal";
import DeleteFoodModal from "./_deleteFoodModal";
import EditFoodModal from "./_editFoodModal";
const Food = () => {
  const [entityState, setEntityState] = useState({
    name: "",
    image: "",
    price: 0,
    discount: 0,
  });

  const [action, setAction] = useState(false);
  const [addShow, setAddShow] = useState(false);
  const [addStatus, setAddStatus] = useState(false);

  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);

  const [editShow, setEditShow] = useState(false);
  const [editStatus, setEditStatus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState([]);

  const getAllFoods = async () => {
    try {
      setLoading(true);
      const response = await getAll();
      if (response) toast.success(`Got ${response.data.length} foods`);
      setFoods(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    getAllFoods();
  }, [action]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  // add new food
  const handleAdd = () => {
    setAddShow(true);
    setAddStatus(true);
  };

  // delete food
  const handleDelete = async (entity) => {
    setDeleteShow(true);
    setDeleteStatus(true);
    setEntityState(entity);
  };

  // edit food
  const handleEdit = async (entity) => {
    setEditShow(true);
    setEditStatus(true);
    setEntityState(entity);
  };
  return (
    <div className="container food">
      <Button className="btn btn-sm mb-3 btn-secondary" onClick={handleAdd}>
        Add new
      </Button>
      <Row lg={3} xs={1} md={2} className="g-4 align-items-end">
        {foods.map((food, index) => (
          <Col key={index}>
            <Card>
              <Card.Img variant="top" src={food.image} />
              <Card.Body>
                <Card.Title>{food.name}</Card.Title>
                <Card.Text className="food-price">
                  <span>Price: {food.price}$ </span>
                  <span>Discount: {food.discount}%</span>
                </Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <Button
                  className="btn btn-primary m-2 btn-sm btn-edit"
                  onClick={() => handleEdit(food)}
                >
                  Edit
                </Button>
                <Button
                  className="btn btn-warning m-2 btn-sm btn-del"
                  onClick={() => handleDelete(food)}
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {addStatus && (
        <AddFoodModal
          show={addShow}
          setLgShow={setAddShow}
          action={action}
          setAction={setAction}
          setAddStatus={setAddStatus}
        />
      )}

      {deleteStatus && (
        <DeleteFoodModal
          show={deleteShow}
          setMdShow={setDeleteShow}
          action={action}
          setAction={setAction}
          entityState={entityState}
        />
      )}

      {editStatus && (
        <EditFoodModal
          show={editShow}
          setMdShow={setEditShow}
          action={action}
          setAction={setAction}
          entityState={entityState}
          setEntityState={setEntityState}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Food;
