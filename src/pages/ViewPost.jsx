import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const ViewPost = () => {
  const { postId } = useParams();
  const { connected } = useConnection();

  const processId = "5iK7nXtoUMWNCDtiOpwf75_ppw0v4LwusumyqiQdPq8";
  const [isFetching, setIsFetching] = useState(false);
  const [postContent, setPostContent] = useState();

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "Get" },
          { name: "Post-Id", value: postId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result", filteredResult);
      setPostContent(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }

    // setIsFetching(false);
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    setIsFetching(false);
  }, [connected]);

  return (
    <main>
      <Header />
      {postContent && (
        <div style={styles.parentDiv}>
          <h2 style={styles.postHeading}>{postContent.Title}</h2>
          <p style={styles.postContent}>{postContent.Author}</p>
          <p style={styles.postContent}>{postContent.ID}</p>
          <Link to="/view" style={styles.postLink}>
            <button style={styles.button}>Back</button>
          </Link>
          <hr style={styles.horizontalRule} />
          <ReactQuill value={postContent.Body} readOnly theme="bubble" />
        </div>
      )}
    </main>
  );
};

export default ViewPost;

const styles = {
  parentDiv: {
    height: "calc(100vh - 72px)",
    display: "flex",
    flexDirection: "column",
    padding: "40px",
  },
  horizontalRule: {
    border: 0,
    clear: "both",
    display: "block",
    width: "100%",
    backgroundColor: "#ccc",
    height: "1px",
  },
  postHeading: {
    margin: "0px",
    padding: "0px",
  },
  postContent: {
    margin: "0px",
    padding: "0px",
    color: "#555",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100px",
    marginTop: "20px",
  },
  postLink: {
    textDecoration: "none",
    color: "#fff",
  },
};
