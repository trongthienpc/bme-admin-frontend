import React, { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { actions, useStore } from "../../../../context";
import { toast, ToastContainer } from "react-toastify";
import { default as cloudAPI } from "../../../../services/cloudUpload";
import { addEntity } from "../../../../services/blogServices";
import { ADD_SUCC } from "../../../../context/constant";
import UploadImage from "../../../../services/uploadImage";
import JoditEditor from "../../../../services/JoditEditor";

const AddBlogModal = ({ show, setlgShow, setAddStatus }) => {
  const [state, dispatch] = useStore();

  const [submitStatus, setSubmitStatus] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [imageState, setImageState] = useState();
  const [entityState, setEntityState] = useState({
    name: "blog name",
    quotes: "blog quotes ....",
    avatar: "",
    public_id: "",
    content: "",
  });

  // handle entity change
  const handleEntityChange = (e) => {
    setEntityState({
      ...entityState,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setAddStatus(false);
    setlgShow(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(true);
    if (!imageState) return toast.warn("Please input blog avatar");

    let data = await cloudAPI(imageState);
    if (data) {
      entityState.avatar = data.secure_url;
      entityState.public_id = data.public_id;
    }
    const formData = new FormData();

    entityState.content = editorContent;
    formData.append("content", entityState.content);
    formData.append("name", entityState.name);
    formData.append("quotes", entityState.quotes);
    formData.append("avatar", entityState.avatar);
    formData.append("public_id", entityState.public_id);
    try {
      await addEntity(formData).then((res) => {
        dispatch(actions.addBlog(res.data.data));
        toast.success(ADD_SUCC);
      });
    } catch (error) {
      toast.error("Have error, please do it later");
      console.log(error);
    }
    setlgShow(false);
    // setAction(!action);
    setImageState("");
    setSubmitStatus(false);
  };
  return (
    <>
      {/* modal add new room */}
      <Modal size="lg" show={show} onHide={handleClose} enforceFocus={false}>
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
            <Form.Group className="mb-3" controlId="quotes">
              <Form.Label>Quotes</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter quotes"
                name="quotes"
                value={entityState.quotes}
                onChange={handleEntityChange}
              />
            </Form.Group>

            <Form.Group controlId="formAvatar" className="mb-3">
              <Form.Label>Avatar</Form.Label>
              <UploadImage setImageState={setImageState} />
            </Form.Group>

            <Form.Group controlId="editor" className="mb-3">
              <Form.Label>Content</Form.Label>
              <div>
                {/* tinyMCE */}
                {/* <TinyMCE setEditorContent={setEditorContent} /> */}
                <JoditEditor
                  content={editorContent}
                  setContent={setEditorContent}
                />
              </div>
            </Form.Group>

            {!submitStatus ? (
              <Button
                variant="secondary"
                type="submit"
                //   onClick={handleAddSubmit}
                disabled={imageState ? false : true}
              >
                Submit
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                Submiting{" "}
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
      <ToastContainer />
    </>
  );
};

export default React.memo(AddBlogModal);
