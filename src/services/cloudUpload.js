const dataCloud = async (file) => {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ueil3d5s");
  formData.append("folder", "test");
  // formData.append("eager", "c_pad,h_300,w_400|c_crop,h_200,w_260");
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
