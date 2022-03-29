import React, { useEffect, useState } from "react";

import {
  Button,
  Form,
  Image,
  Modal,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import "./blog.css";
import {
  deleteById,
  getAll,
  updateEntity,
} from "../../../../services/blogServices";
import { toast, ToastContainer } from "react-toastify";
import { DEL_SUCC, SER_ERROR, UPDATE_SUCC } from "../../../../context/constant";

import { default as cloudAPI } from "../../../../services/cloudUpload";
import { actions, useStore } from "../../../../context";

import AddBlogModal from "./_addBlogModal";
import JoditEditor from "../../../../services/JoditEditor";
const Blog = () => {
  const [state, dispatch] = useStore();

  const { blogs } = state;
  // init value
  const [editorContent, setEditorContent] = useState("");

  const [editStatus, setEditStatus] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [delStatus, setDelStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [blogsApi, setBlogsApi] = useState([]);
  const [imageState, setImageState] = useState();

  const [loading, setLoading] = useState(false);

  const [action, setAction] = useState(false);
  console.log("call blog");
  const getAllBlogs = async () => {
    let cancel = false;
    try {
      setLoading(true);
      // console.log(loading);
      console.log("call get all blogs");
      await getAll().then((result) => {
        if (cancel) return;
        setBlogsApi(result.data);
        dispatch(actions.loadblog(result.data));
        toast.success(`Got  ${result.data.length} blogs`);
        setLoading(false);
      });
    } catch (error) {
      toast.error(SER_ERROR);
      console.log("error");
    }
    return () => {
      cancel = true;
    };
  };

  // bootstrap issue
  // useEffect(() => {
  //   const handler = (e) => {
  //     if (
  //       e.target.closest(
  //         ".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root"
  //       ) !== null
  //     ) {
  //       e.stopImmediatePropagation();
  //     }
  //   };
  //   document.addEventListener("focusin", handler);
  //   return () => document.removeEventListener("focusin", handler);
  // }, []);

  // get blogs
  useEffect(() => {
    let abortController = new AbortController();
    getAllBlogs();
    return () => {
      abortController.abort();
    };
  }, [action]);

  // handle edit blog
  const handleImage = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setImageState(file);
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

  const handleEdit = async (entity) => {
    setOldId(entity._id);
    setEditStatus(true);
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
      setOldEntity(entity);
      setEditorContent(entity.content);

      setImageState(entity.avatar);
      setModalEditShow(true);
      // const res = await getById(id);
      // if (res.data.success) {
      //   // console.log(res.data);
      //   setEditorContent(res.data.response.content);
      //   setOldEntity(() => {
      //     const blog = res.data.response;
      //     const blogJson = JSON.stringify(blog);
      //     localStorage.setItem("blog", blogJson);
      //     return blog;
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
    // console.log(editorContent);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    console.log(oldEntity);
    dispatch(actions.updateBlog(oldEntity));

    if (oldEntity.avatar !== imageState) {
      let res = await cloudAPI(imageState);
      if (res) {
        oldEntity.avatar = res.secure_url;
        oldEntity.public_id = res.public_id;
        setImageState(res.secure_url);
      }
    } else oldEntity.avatar = imageState;

    const formData = new FormData();
    formData.append("name", oldEntity.name);
    formData.append("avatar", oldEntity.avatar);
    formData.append("quotes", oldEntity.quotes);
    formData.append("content", editorContent);
    formData.append("public_id", oldEntity.public_id);

    try {
      const res = await updateEntity(oldId, formData);
      if (res.data.success) {
        dispatch(actions.updateBlog(res.data));
      }
    } catch (err) {
      console.log(err);
    }
    setModalEditShow(false);
    // setAction(!action);
    toast.success(UPDATE_SUCC);
    setImageState("");
    setIsUpdating(false);
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
  const [delBlog, setDelBlog] = useState("");

  const handleDelete = (entity) => {
    setDelStatus(true);
    setDelBlog(entity);
    setDelModal(true);
  };
  const delBlogSubmit = async (entity) => {
    setIsDeleting(true);
    if (entity._id) {
      try {
        const res = await deleteById(entity._id);
        if (res.data.success) {
          dispatch(actions.delBlog(entity._id));
          toast.success(DEL_SUCC);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    // setAction(!action);
    setImageState("");
    setDelModal(false);
    setIsDeleting(false);
  };
  if (loading) {
    return (
      <div className="loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="blogs">
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
                  className="btn btn-primary m-2 btn-sm btn-edit"
                  onClick={() => handleEdit(blog)}
                >
                  Edit
                </Button>
                <Button
                  className="btn btn-warning m-2 btn-sm btn-del"
                  onClick={() => handleDelete(blog)}
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* modal add new blog */}
      {addStatus && (
        <AddBlogModal
          show={lgShow}
          setlgShow={setlgShow}
          setAddStatus={setAddStatus}
        />
      )}

      {/* modal edit blog */}
      {editStatus && (
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
                  {/* <TinyMCE
                  setEditorContent={setEditorContent}
                  editorContent={editorContent}
                /> */}

                  <JoditEditor
                    content={editorContent}
                    setContent={setEditorContent}
                  />
                </div>
              </Form.Group>

              {!isUpdating ? (
                <Button
                  variant="secondary"
                  type="submit"
                  //   onClick={handleAddSubmit}
                  disabled={imageState ? false : true}
                >
                  Update
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  Updating {""}
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </Button>
              )}
            </Form>
          </Modal.Body>
        </Modal>
      )}
      {/* modal delete blog  */}
      {delStatus && (
        <Modal size="md" show={delModal} onHide={() => setDelModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <label>{delBlog.name}</label>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Are you sure delete this blog?</label>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button
              className="btn btn-secondary m-2"
              onClick={() => setDelModal(false)}
            >
              Cancel
            </Button>

            {!isDeleting ? (
              <Button
                className="btn btn-warning m-2"
                onClick={() => delBlogSubmit(delBlog)}
              >
                Delete
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                Deleting{" "}
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default Blog;
