import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { SER_ERROR } from "../../../../context/constant";
import { getAll } from "../../../../services/commentService";
import AddCommentModal from "./_addCommentModal";
import UpdateCommentModal from "./_updateCommentModal";
import moment from "moment";
import "./comment.css";
import Pagination from "./pagination";
import { useStore, actions } from "../../../../context";
import DeleteCommentModal from "./_deleteCommentModal";

const Comment = () => {
  const [addShow, setAddShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [addStatus, setAddStatus] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [action, setAction] = useState(false);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [state, dispatch] = useStore();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const getAllComments = async () => {
    try {
      setLoading(true);
      console.log("call get all comments");
      const response = await getAll();
      toast.success(`Got  ${response.data.length} comments`);

      setComments(response.data);
      setPosts(response.data);
      dispatch(actions.loadComment(response.data));
      setLoading(false);
    } catch (error) {
      toast.error(SER_ERROR);
      console.log("error");
    }
  };

  // get all comments
  useEffect(() => {
    getAllComments();
  }, [action]);

  // search
  useEffect(() => {
    const result = !search
      ? comments
      : comments.filter((x) => x.name.toLowerCase().includes(search));

    setSearchResult(result);
  }, [search, comments]);

  const d = new Date();
  const [entityState, setEntityState] = useState({
    name: "",
    nation: "",
    comment: "",
    date: moment(d).format("YYYY-MM-DD"),
  });

  // edit comment
  const handleEdit = async (comment) => {
    setEntityState(comment);
    setEditShow(true);
    setEditStatus(true);
  };
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // delete comment
  const handleDelete = async (entity) => {
    setDeleteShow(true);
    setDeleteStatus(true);
    setEntityState(entity);
    console.log(entity);
  };
  // pagination
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResult.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAdd = () => {
    setAddShow(true);
    setAddStatus(true);
  };

  // convert text to TitleCase
  const convertTextToTitleCase = (text) => {
    let camelCaseText = text
      .split(" ")
      .map(function (word, index) {
        // First character upper case else lower case
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
    return camelCaseText;
  };

  return (
    <div className="comments">
      {/* add new comment */}
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-md-3">
            <button
              className="btn btn-secondary btn-sm mb-2"
              onClick={() => handleAdd()}
            >
              Add New
            </button>
          </div>
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer' name"
                aria-label="Customer' name"
                aria-describedby="basic-addon2"
              />
            </div>
          </div>
        </div>
        <div></div>
      </div>

      {addStatus && (
        <AddCommentModal
          show={addShow}
          setlgShow={setAddShow}
          action={action}
          setAction={setAction}
          setAddStatus={setAddStatus}
        />
      )}

      {/* table comments */}
      <Container fluid="sm">
        <Row>
          <Col>
            <Table striped bordered hover responsive className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Nation</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post, index) => (
                  <tr key={index}>
                    <td aria-label="No." style={{ textAlign: "center" }}>
                      {(currentPage - 1) * postsPerPage + index + 1}
                    </td>
                    <td aria-label="Customer Name">{post.name}</td>
                    <td aria-label="Customer Nation">
                      {post.nation.toUpperCase()}
                    </td>
                    <td aria-label="Customer Comment">{post.comment}</td>
                    <td aria-label="Comment date" className="date">
                      {moment(post.date).format("DD-MM-YYYY")}
                    </td>
                    <td aria-label="Actions" className="actions">
                      <div>
                        <button
                          className="btn btn-info btn-sm btn-edit"
                          onClick={() => handleEdit(post)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-warning btn-sm btn-del"
                          onClick={() => handleDelete(post)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* update comment  */}

            {searchResult.length > postsPerPage && (
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={comments.length}
                paginate={paginate}
              />
            )}
          </Col>
        </Row>
      </Container>

      {editStatus && (
        <UpdateCommentModal
          show={editShow}
          setlgShow={setEditShow}
          action={action}
          setAction={setAction}
          setAddStatus={setAddStatus}
          entityState={entityState}
          setEntityState={setEntityState}
        />
      )}

      {deleteStatus && (
        <DeleteCommentModal
          show={deleteShow}
          setMdShow={setDeleteShow}
          entityState={entityState}
          action={action}
          setAction={setAction}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default Comment;
