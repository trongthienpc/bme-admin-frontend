import React from "react";
import { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";

const UploadImages = ({ setImageState, imageState, editAction }) => {
  editAction = editAction ?? false;
  const [images, setImages] = useState([]);

  useEffect(() => {
    return () => {
      for (let i = 0; i < images.length; i++) {
        images[i] && URL.revokeObjectURL(images[i].preview);
      }
    };
  }, [images]);

  const onImageChange = (e) => {
    console.log("image change ===>");
    let files = Array.from(e.target.files);

    for (let i = 0; i < files.length; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
    }
    setImages(() => {
      return files;
    });
    setImageState(() => {
      return files;
    });
  };
  return (
    <>
      <Form.Control
        type="file"
        multiple
        accept="image/*"
        onChange={onImageChange}
      />
      {editAction
        ? imageState &&
          imageState.map((image, index) => (
            <Image
              key={index}
              src={image.preview ? image.preview : image}
              fluid={false}
              roundedCircle={false}
              thumbnail={true}
              className="flex mb-2"
              hidden={image ? false : true}
            />
          ))
        : images.map((image, index) => (
            <Image
              key={index}
              src={image.preview}
              fluid={false}
              roundedCircle={false}
              thumbnail={true}
              className="flex mb-2"
              hidden={image ? false : true}
            />
          ))}
    </>
  );
};

export default UploadImages;
