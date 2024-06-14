import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import { Outlet } from "react-router-dom";

const View = () => {
  const { connected } = useConnection();
  const processId = "5iK7nXtoUMWNCDtiOpwf75_ppw0v4LwusumyqiQdPq8";
  const [isFetching, setIsFetching] = useState(false);
  const [postList, setPostList] = useState();
  // const [authorList, setAuthorList] = useState();

  const syncAllPosts = async () => {
    // setIsFetching(true);
    if (!connected) {
      // setIsFetching(false);
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "List" }],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setPostList(filteredResult[0]);
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
      <div style={styles.parentDiv}>
        <h2>Welcome to the View Page</h2>
        {isFetching && <div>Fetching posts...</div>}
        <hr style={styles.horizontalRule} />
        {postList &&
          postList.map((post, index) => (
            <div key={index} style={styles.postDiv}>
              <a href={`/view/${post.ID}`} style={styles.postLink}>
                <h3 style={styles.postHeading}>{post.Title}</h3>
                <p style={styles.postContent}>{post.Author}</p>
                <p style={styles.postContent}>{post.ID}</p>
              </a>
            </div>
          ))}
        <hr style={styles.horizontalRule} />
      </div>
      <Outlet />
    </main>
  );
};

export default View;

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
  postDiv: {
    padding: "10px 20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "10px",
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
  postLink: {
    textDecoration: "none",
    color: "#555",
  },
};
