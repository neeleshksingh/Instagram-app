import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./Display_Profile.css";

export default function Display_Profile() {
  var ProfilePicLink =
    "https://cdn-icons-png.flaticon.com/512/1177/1177568.png";
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [isfollow, setIsfollow] = useState(false);

  const { id } = useParams();
  // follow a user

  const follow = (id) => {
    fetch("https://insta-u529.onrender.com/follow", {
      method: "put",
      headers: {
        "Content-Type": "Application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsfollow(true);
      })
      .catch((e) => console.log(e));
  };
  // to unfollow user
  const unfollow = (id) => {
    fetch("https://insta-u529.onrender.com/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        setIsfollow(false);
      });
  };
  useEffect(() => {
    fetch(`https://insta-u529.onrender.com/userProfile/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.data);
        setPosts(result.ProfileData);
        if (
          result.data.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsfollow(true);
        }
      })
      .catch((e) => console.log(e));
  }, [isfollow]);

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
          <img src={user.Photo ? user.Photo : ProfilePicLink} alt="" />
        </div>
        <div className="profile-data">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>{user.name}</h1>
            <button
              onClick={() => {
                if (isfollow) {
                  unfollow(user._id);
                } else {
                  follow(user._id);
                }
              }}
              className="followbtn"
            >
              {isfollow ? "unfollow" : "follow"}
            </button>
          </div>

          <div className="profile-info" style={{ display: "flex" }}>
            <p>{posts.length} posts</p>
            <p>{user.followers ? user.followers.length : "0"} follower</p>
            <p>{user.following ? user.following.length : "0"} folllowing</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "94%", margin: "25px auto", opacity: "0.8" }} />
      <div className="gallery">
        {posts.map((pics) => {
          return <img key={pics._id} src={pics.photo} alt="" />;
        })}
      </div>
    </div>
  );
}
