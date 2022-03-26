import React, { useEffect, useState } from "react";
import { Button, Form, Image, Modal, Row, Col, Card } from "react-bootstrap";

import {
  addEntity,
  deleteById,
  getAll,
  getById,
  updateEntity,
} from "../../../../services/blogServices";
import { toast, ToastContainer } from "react-toastify";
import {
  ADD_SUCC,
  DEL_SUCC,
  SER_ERROR,
  UPDATE_SUCC,
} from "../../../../context/constant";
import UploadImage from "../../../../services/uploadImage";
import { default as cloudAPI } from "../../../../services/cloudUpload";
import { actions, useStore } from "../../../../context";
import TinyMCE from "../../../../services/tinyMCE";
import AddBlogModal from "./_addBlogModal";
const Blog = () => {
  const [state, dispatch] = useStore();
  // init value
  const [editorContent, setEditorContent] = useState("");
  const [toEditor, setToEditor] = useState("default");
  const [blogs, setBlogs] = useState([]);
  const [imageState, setImageState] = useState();
  const [entityState, setEntityState] = useState({
    name: "",
    quotes: "",
    avatar: "",
    content: "",
  });

  const [action, setAction] = useState(false);

  // bootstrap issue
  useEffect(() => {
    const handler = (e) => {
      if (
        e.target.closest(
          ".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root"
        ) !== null
      ) {
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener("focusin", handler);
    return () => document.removeEventListener("focusin", handler);
  }, []);

  // get blogs
  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const response = await getAll();
        toast.success(`Got  ${response.data.length} blogs`);
        setBlogs(response.data);
      } catch (error) {
        toast.error(SER_ERROR);
        console.log("error");
      }
    };
    getAllBlogs();
  }, [action]);

  // handle edit blog
  const handleImage = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setImageState(file);
    console.log(imageState);
  };

  const [modalEditShow, setModalEditShow] = useState(false);
  const [oldEntity, setOldEntity] = useState({
    name: "",
    quotes: "",
    avatar: "",
    content: "",
  });
  const [oldId, setOldId] = useState("");
  const handleOldEntityChange = (e) => {
    setOldEntity({
      ...oldEntity,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = async (id) => {
    setOldId(id);
    try {
      // const res = await getById(id)
      //   .then((response) => {
      //     return response;
      //   })
      //   .then((data) => {
      //     setOldEntity(data.data.response);
      //     setImageState(data.data.response.avatar);
      //     setEditorContent(data.data.response.content);
      //     setModalEditShow(true);
      //   });
      // console.log(res);
      const res = await getById(id);
      if (res.data.success) {
        setOldEntity(() => {
          const blog = res.data.response;
          const blogJson = JSON.stringify(blog);
          localStorage.setItem("blog", blogJson);
          return blog;
        });
      }
    } catch (error) {
      console.log(error);
    }
    console.log(editorContent);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (oldEntity.avatar !== imageState) {
      let secure_url = await cloudAPI(imageState);
      if (secure_url) {
        oldEntity.avatar = secure_url;
        setImageState(secure_url);
      }
    } else oldEntity.avatar = imageState;

    const formData = new FormData();
    formData.append("name", oldEntity.name);
    formData.append("avatar", oldEntity.avatar);
    formData.append("quotes", oldEntity.quotes);
    formData.append("content", editorContent);

    try {
      const res = await updateEntity(oldId, formData);
      if (res.data.success) {
        dispatch(actions.updateBlog(res.data));
      }
    } catch (err) {
      console.log(err);
    }
    setModalEditShow(false);
    setAction(!action);
    toast.success(UPDATE_SUCC);
    setImageState("");
  };

  // handle add
  const [lgShow, setlgShow] = useState(false);
  const [addStatus, setAddStatus] = useState(false);
  const handleAdd = () => {
    setlgShow(true);
    setAddStatus(true);
  };

  // delete blog
  const [delModal, setDelModal] = useState(false);
  const [delBlogId, setDelBlogId] = useState("");
  const handleDelete = (id) => {
    setDelBlogId(id);
    setDelModal(true);
  };
  const delBlogSubmit = async (id) => {
    if (id) {
      try {
        const res = await deleteById(id);
        if (res.data.success) {
          dispatch(actions.delBlog(id));
          setDelModal(false);
          toast.success(DEL_SUCC);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    setAction(!action);
    setImageState("");
  };

  return (
    <div>
      <button className="btn btn-secondary mb-2" onClick={() => handleAdd()}>
        Add New
      </button>
      <Row xs={1} md={2} className="g-4">
        {blogs.map((blog, index) => (
          <Col key={index}>
            <Card className="mb-2 h-100">
              <Card.Img variant="top" src={blog.avatar} />
              <Card.Body>
                <Card.Title>{blog.name}</Card.Title>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <Button
                  className="btn btn-primary m-2"
                  onClick={() => handleEdit(blog._id)}
                >
                  Edit
                </Button>
                <Button
                  className="btn btn-warning m-2"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* modal add new blog */}
      <AddBlogModal
        show={lgShow}
        setlgShow={setlgShow}
        action={action}
        setAction={setAction}
        setAddStatus={setAddStatus}
      />

      {/* modal edit blog */}
      <Modal
        size="lg"
        show={modalEditShow}
        onHide={() => setModalEditShow(false)}
        enforceFocus={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit blog
            {/* <pre>{JSON.stringify(roomState, null, '\t')}</pre> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleEditSubmit}
            method="post"
            // encType="multipart/form-data"
          >
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={oldEntity.name}
                onChange={handleOldEntityChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="quotes">
              <Form.Label>Quotes</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter quotes"
                name="quotes"
                value={oldEntity.quotes}
                onChange={handleOldEntityChange}
              />
            </Form.Group>

            <Form.Group controlId="formAvatar" className="mb-3">
              <Form.Label>Avatar</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImage} />

              {imageState && (
                <Image
                  src={imageState.preview ? imageState.preview : imageState}
                  fluid
                  rounded
                  thumbnail
                  className="mb-2"
                  hidden={imageState ? false : true}
                />
              )}
            </Form.Group>

            <Form.Group controlId="formEditor" className="mb-3">
              <Form.Label>Content</Form.Label>
              <div>
                <TinyMCE
                  setEditorContent={setEditorContent}
                  editorContent={editorContent}
                />
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              //   onClick={handleAddSubmit}
              disabled={imageState ? false : true}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* modal delete blog  */}
      <Modal size="md" show={delModal} onHide={() => setDelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <label>{delBlogId}</label>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Are you sure delete this style room?</label>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            className="btn btn-primary m-2"
            onClick={() => setDelModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-warning m-2"
            onClick={() => delBlogSubmit(delBlogId)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Blog;
