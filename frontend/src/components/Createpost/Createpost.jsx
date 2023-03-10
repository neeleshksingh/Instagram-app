import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Createpost.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const Createpost = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  // getting img from cloudinary
  const [imgurl, setImgurl] = useState("");
  const notifyError = (msg) => toast.error(msg);
  const notifyMsg = (msg) => toast.success(msg);

  useEffect(() => {
    if (imgurl) {
      // saving imageurl and caption in mongo
      fetch("https://insta-u529.onrender.com/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          caption,
          pic: imgurl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notifyError(data.error);
          } else {
            notifyMsg(data.message);
            navigate("/");
          }
        })
        .catch((e) => console.log(e));
    }
  }, [imgurl]);

  // upload pic in cloudnary
  const shareImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram");
    data.append("cloud_name", "neeleshks");
    fetch("https://api.cloudinary.com/v1_1/neeleshks/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setImgurl(data.url);
      })
      .catch((e) => console.log(e));
  };
  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };
  return (
    <div className="create-post">
      <div className="post-header">
        <h3 style={{ margin: "15px auto" }}>Create New Post</h3>
        <button id="post-btn" onClick={shareImage}>
          <ArrowForwardIcon />
        </button>
      </div>
      <div className="main">
        <center>
          <img id="output" alt="" src={require("../../img/photo.png")} />
        </center>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            loadfile(e);
            setImage(e.target.files[0]);
          }}
        />
      </div>
      <div className="details">
        <div className="card-header">
        </div>
        <textarea
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
          }}
          type="text"
          placeholder="write a caption..."
        ></textarea>
      </div>
    </div>
  );
};
export default Createpost;
