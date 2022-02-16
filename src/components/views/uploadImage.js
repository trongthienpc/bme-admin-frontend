import React from 'react'
import { useEffect, useState } from 'react'
import { Form, Image } from "react-bootstrap";

const UploadImage = ({ setImageState }) => {
    const [image, setImage] = useState()


    useEffect(() => {
        return () => {
            image && URL.revokeObjectURL(image.preview)
        }
    }, [image])

    const onImageChange = (e) => {
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file)
        setImage(file)
        setImageState(file)
    }
    return (
        <>
            <Form.Control
                type="file"
                accept='image/*'
                onChange={onImageChange} />
            {image && < Image
                src={image.preview}
                fluid
                rounded
                thumbnail
                className="mb-2"
                hidden={image ? false : true}
            />}

        </>
    )
}

export default UploadImage