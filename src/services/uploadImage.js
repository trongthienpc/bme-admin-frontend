import React from "react";
import { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";

const UploadImage = ({ setImageState, imageState }) => {
  const [image, setImage] = useState(imageState);

  useEffect(() => {
    return () => {
      image && URL.revokeObjectURL(image.preview);
    };
  }, [image]);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setImage(file);
      setImageState(file);
    }
  };
  return (
    <>
      <Form.Control type="file" accept="image/*" onChange={onImageChange} />
      {image && (
        <Image
          src={image.preview ? image.preview : image}
          fluid
          rounded
          thumbnail
          className="mb-2"
          hidden={image ? false : true}
        />
      )}
    </>
  );
};

export default React.memo(UploadImage);
