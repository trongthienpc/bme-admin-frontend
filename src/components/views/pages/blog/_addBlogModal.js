import React, { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useStore } from "../../../../context";
import { toast, ToastContainer } from "react-toastify";
import { default as cloudAPI } from "../../../../services/cloudUpload";
import TinyMCE from "../../../../services/tinyMCE";
import { addEntity } from "../../../../services/blogServices";
import { ADD_SUCC } from "../../../../context/constant";
import UploadImage from "../../../../services/uploadImage";
import JoditEditor from "../../../../services/JoditEditor";

const AddBlogModal = ({ show, setlgShow, action, setAction, setAddStatus }) => {
  const [state, dispatch] = useStore();

  const [submitStatus, setSubmitStatus] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [imageState, setImageState] = useState();
  const [entityState, setEntityState] = useState({
    name: "blog name",
    quotes: "blog quotes ....",
    avatar: "",
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
    // if (editorRef.current)
    //   setEntityState({
    //     ...entityState,
    //     content: editorRef.current.getContent(),
    //   });

    let secure_url = await cloudAPI(imageState);
    if (secure_url) entityState.avatar = secure_url;
    const formData = new FormData();
    console.log(editorContent);
    entityState.content = editorContent;
    formData.append("content", entityState.content);
    formData.append("name", entityState.name);
    formData.append("quotes", entityState.quotes);
    formData.append("avatar", entityState.avatar);
    try {
      const response = await addEntity(formData);

      if (response.data.success) {
        toast.success(ADD_SUCC);
        setlgShow(false);
      }
    } catch (error) {
      toast.error("Have error, please do it later");
      console.log(error);
    }
    setAction(!action);
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
                variant="primary"
                type="submit"
                //   onClick={handleAddSubmit}
                disabled={imageState ? false : true}
              >
                Submit
              </Button>
            ) : (
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default AddBlogModal;
