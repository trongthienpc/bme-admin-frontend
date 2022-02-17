const dataCloud = async (file) => {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ueil3d5s");
  formData.append("folder", "test");
  const res = await fetch("https://api.cloudinary.com/v1_1/thientt/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.secure_url;
    })
    .catch((err) => console.log(err));
  return res;
};

export default dataCloud;
