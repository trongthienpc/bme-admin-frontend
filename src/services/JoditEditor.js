import React, { useMemo, useRef, useState } from "react";
import { default as Editor } from "jodit-react";

const JoditEditor = ({ content, setContent }) => {
  const editor = useRef(null);
  //   const [content, setContent] = useState("");
  //   console.log(content);
  const config = {
    readonly: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  return useMemo(
    () => (
      <Editor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        //   onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {
          setContent(newContent);
        }}
      />
    ),
    []
  );
};

export default JoditEditor;
