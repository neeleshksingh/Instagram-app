import React from "react";
import "./PostDetail.css";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { RiCloseLine } from "react-icons/ri";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostDetail({ commentPic, viewPostdetails }) {
  const navigate = useNavigate();
  const notifyB = (msg) => toast.success(msg);
  // function to delete post
  const deletePost = (postId) => {
    if (window.confirm("Do you really want to delete this post")) {
      fetch(`https://insta-backend-bmup.onrender.com/deletePost/${postId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          viewPostdetails();
          navigate("/");
          notifyB(result.message);
        });
    }
  };
  return (
    <div className="show-comment">
      <div className="comment-container">
        <div className="post-pic">
          <img src={commentPic.photo} alt="" />
        </div>
        <div className="comment-details">
          <div className="card-Header">
            <div className="card-pic">
              <img src={require("../../img/girl2.jpg")} alt="" />
            </div>
            <h5>{commentPic.postedBy.name}</h5>
            <span
              className="delete-icon"
              onClick={() => {
                deletePost(commentPic._id);
              }}
            >
              <DeleteOutlineIcon style={{ fontSize: "30px" }} />
            </span>
          </div>
          <div className="comment-section">
            {commentPic.comments.map((newcomment) => {
              return (
                <p className="comm">
                  <span className="commenter" style={{ fontWeight: "bolder" }}>
                    {newcomment.postedBy.name}{" "}
                  </span>
                  <span className="commentText">{newcomment.comment}</span>
                </p>
              );
            })}
          </div>
          <div className="card-content">
            <p>{commentPic.likes.length} likes</p>
            <p>{commentPic.caption}</p>
          </div>
          <div className="card-comment">
            <span>
              <AddReactionIcon />
            </span>
            <input type="text" placeholder="Add a comment..." />
            <button className="comment-btn">Post</button>
          </div>
        </div>
      </div>
      <div className="close-comment" onClick={viewPostdetails}>
        <span style={{ fontSize: "40px", cursor: "pointer" }}>
          <RiCloseLine />
        </span>
      </div>
    </div>
  );
}
