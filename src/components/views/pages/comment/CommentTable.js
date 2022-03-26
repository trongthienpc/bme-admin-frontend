import React, { useState } from "react";
import { Table } from "react-bootstrap";
import "./commentTable.css";
import UpdateCommentModal from "./_updateCommentModal";
import moment from "moment";
import { getById } from "../../../../services/commentService";
const CommentTable = ({ posts, loading, postsPerPage, currentPage }) => {
  const [lgShow, setlgShow] = useState(false);
  const [oldId, setOldId] = useState();
  const d = new Date();
  const [entityState, setEntityState] = useState({
    name: "",
    nation: "",
    comment: "",
    date: moment(d).format("YYYY-MM-DD"),
  });

  const handleEdit = async (comment) => {
    console.log(comment._id);
    setEntityState(comment);
    setlgShow(true);
    setOldId(comment._id);
  };
  if (loading) {
    return <h2>Loading...</h2>;
  }
  const handleDelete = async (id) => {
    console.log(id);
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Nation</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index}>
              <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
              <td>{post.name}</td>
              <td>{post.nation}</td>
              <td>{post.comment}</td>
              <td className="actions">
                <button
                  className="btn btn-info"
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* update comment  */}
      <UpdateCommentModal
        show={lgShow}
        setlgShow={setlgShow}
        entityState={entityState}
        setEntityState={setEntityState}
      />
    </div>
  );
};

export default React.memo(CommentTable);
