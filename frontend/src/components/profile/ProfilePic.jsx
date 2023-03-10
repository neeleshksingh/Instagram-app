import React, { useEffect, useRef, useState } from "react";
import "../Modal/Modal.css";
export default function ProfilePic({ changeProfilepic }) {
  const hiddenInputFile = useRef(null);
  const [image, setImage] = useState("");
  const [imgurl, setImgurl] = useState("");

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
      .then((data) => setImgurl(data.url))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (image) {
      shareImage();
    }
  }, [image]);

  useEffect(() => {
    if (imgurl) {
      postPic();
    }
  }, [imgurl]);
  const postPic = () => {
    fetch("https://insta-u529.onrender.com/updateProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: imgurl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        changeProfilepic();
        window.location.reload();
      })
      .catch((e) => console.log(e));
  };

  const handleclick = () => {
    hiddenInputFile.current.click();
  };
  return (
    <div className="profilePic darkBg">
      <div className="changepic centered">
        <div>
          <h2>change profile pic</h2>
        </div>
        <div>
          <button
            onClick={handleclick}
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
          >
            upload photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={hiddenInputFile}
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div>
          <button
            className="upload-btn"
            style={{ color: "#ED4956" }}
            onClick={() => {
              setImgurl(null);
              postPic();
            }}
          >
            remove photo
          </button>
        </div>
        <div>
          <button className="upload-btn" onClick={changeProfilepic}>
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}
