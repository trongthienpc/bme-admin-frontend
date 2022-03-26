import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
// require("dotenv").config();

const TinyMCE = ({ setEditorContent, editorContent }) => {
  let initialContent =
    "<p>... let write something here about your blog ...</p>";
  if (editorContent) initialContent = editorContent;
  const [data, setData] = useState(initialContent);

  const handleEditorChange = (content) => {
    setEditorContent(content);
    setData(content);
  };
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey={process.env.REACT_APP_API_tinyMCEKey}
      onInit={(evt, editor) => (editorRef.current = editor)}
      // initialValue="<p>This is the initial content of the editor.</p>"
      value={data}
      onEditorChange={handleEditorChange}
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
              var blobCache = editorRef.current.editorUpload.blobCache;
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
  );
};

export default TinyMCE;
