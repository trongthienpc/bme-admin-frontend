import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Image, Modal, Row, Col, Card } from "react-bootstrap";
import FileBase64 from "react-file-base64";
import { Editor } from "@tinymce/tinymce-react";
import { addEntity, getAll, getById } from "../../../../services/blogServices";
import { toast, ToastContainer } from "react-toastify";
import { ADD_SUCC, SER_ERROR } from "../../../../context/constant";

const Blog = () => {
  // init value
  const editorRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [imageState, setImageState] = useState();
  const [entityState, setEntityState] = useState({
    name: "",
    avatar: "",
    content: "",
  });

  useEffect(() => {
    getAllBlogs();
  }, [blogs]);

  // get all blogs
  const getAllBlogs = async () => {
    try {
      const response = await getAll();
      setBlogs(response.data);
    } catch (error) {
      toast.error(SER_ERROR);
      console.log("error");
    }
  };

  // handle edit blog
  const [modalEditShow, setModalEditShow] = useState(false);
  const [oldEntity, setOldEntity] = useState({});
  const [oldId, setOldId] = useState("");
  const handleOldEntityChange = (e) => {
    return {
      ...oldEntity,
      [e.target.name]: e.target.value,
    };
  };

  const handleEdit = async (id) => {
    setOldId(id);
    try {
      const res = await getById(id);
      console.log("res:", res);
      if (res) {
        setOldEntity(res.data.response);
        setImageState(res.data.response.avatar);
        setModalEditShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {};

  const handleEditSubmit = () => {};
  // handle entity change
  const handleEntityChange = (e) => {
    setEntityState({
      ...entityState,
      [e.target.name]: e.target.value,
    });
  };
  const [modalAddShow, setModalAddShow] = useState(false);

  // handle add
  const handleAdd = () => {
    setModalAddShow(true);
  };

  // submit entity to server
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (editorRef.current)
      setEntityState({
        ...entityState,
        content: editorRef.current.getContent(),
      });

    if (imageState)
      setEntityState({
        ...entityState,
        avatar: imageState,
      });
    const formData = new FormData();
    formData.append("name", entityState.name);
    formData.append("quotes", entityState.quotes);
    formData.append("avatar", entityState.avatar);
    entityState.content = editorRef.current.getContent();
    formData.append("content", entityState.content);
    try {
      const response = await addEntity(formData);
      if (response.data.success) {
        toast.success(ADD_SUCC);
        setModalAddShow(false);
      }
    } catch (error) {
      toast.error("Have error, please do it later");
      console.log(error);
    }
    setImageState("");
  };

  return (
    <div>
      <button className="btn btn-secondary mb-2" onClick={() => handleAdd()}>
        Add New
      </button>
      <Row xs={1} sm={2} md={3} className="g-4">
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
      <Modal
        size="lg"
        show={modalAddShow}
        onHide={() => setModalAddShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add new blog
            {/* <pre>{JSON.stringify(roomState, null, '\t')}</pre> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleAddSubmit}
            method="post"
            // encType="multipart/form-data"
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={entityState.name}
                onChange={handleEntityChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicQuotes">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="quotes"
                value={entityState.quotes}
                onChange={handleEntityChange}
              />
            </Form.Group>

            <Form.Group controlId="formAvatar" className="mb-3">
              <Form.Label>Avatar</Form.Label>
              {/* <Form.Control type="file" name="image" onChange={handleImage} /> */}
              <div>
                <FileBase64
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) => setImageState(base64)}
                />
                <Image
                  src={imageState}
                  fluid
                  rounded
                  thumbnail
                  className="mb-2"
                  hidden={imageState ? false : true}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formEditor" className="mb-3">
              <Form.Label>Content</Form.Label>
              <div>
                <Editor
                  apiKey="vqpljjh1ie1cw1eyrhhvw95556fdpeq24q7jyxmb7jgpmfcn"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue="<p>This is the initial content of the editor.</p>"
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "image| removeformat | help",
                    file_picker_callback: function (cb, value, meta) {
                      var input = document.createElement("input");
                      input.setAttribute("type", "file");
                      input.setAttribute("accept", "image/*");
                      input.onchange = function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        reader.onload = function () {
                          var id = "blobid" + new Date().getTime();
                          var blobCache =
                            editorRef.current.editorUpload.blobCache;
                          var base64 = reader.result.split(",")[1];
                          var blobInfo = blobCache.create(id, file, base64);
                          blobCache.add(blobInfo);
                          cb(blobInfo.blobUri(), { title: file.name });
                        };
                        reader.readAsDataURL(file);
                      };
                      input.click();
                    },
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
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

      {/* modal edit room */}
      <Modal
        size="lg"
        show={modalEditShow}
        onHide={() => setModalEditShow(false)}
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
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={oldEntity.name}
                onChange={handleOldEntityChange}
              />
            </Form.Group>

            <Form.Group controlId="formAvatar" className="mb-3">
              <Form.Label>Avatar</Form.Label>
              {/* <Form.Control type="file" name="image" onChange={handleImage} /> */}
              <div>
                <FileBase64
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) => setImageState(base64)}
                />
                <Image
                  src={imageState}
                  fluid
                  rounded
                  thumbnail
                  className="mb-2"
                  hidden={imageState ? false : true}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formEditor" className="mb-3">
              <Form.Label>Content</Form.Label>
              <div>
                <Editor
                  apiKey="vqpljjh1ie1cw1eyrhhvw95556fdpeq24q7jyxmb7jgpmfcn"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={oldEntity.content}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "image| removeformat | help",
                    file_picker_callback: function (cb, value, meta) {
                      var input = document.createElement("input");
                      input.setAttribute("type", "file");
                      input.setAttribute("accept", "image/*");
                      input.onchange = function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        reader.onload = function () {
                          var id = "blobid" + new Date().getTime();
                          var blobCache =
                            editorRef.current.editorUpload.blobCache;
                          var base64 = reader.result.split(",")[1];
                          var blobInfo = blobCache.create(id, file, base64);
                          blobCache.add(blobInfo);
                          cb(blobInfo.blobUri(), { title: file.name });
                        };
                        reader.readAsDataURL(file);
                      };
                      input.click();
                    },
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
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
      <ToastContainer />
    </div>
  );
};

export default Blog;
