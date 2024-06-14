import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect";
import Editor from "../components/Editor";

const Create = () => {
  const { connected } = useConnection();
  const processId = "5iK7nXtoUMWNCDtiOpwf75_ppw0v4LwusumyqiQdPq8";
  const [isFetching, setIsFetching] = useState(false);
  const [authorList, setAuthorList] = useState([]);

  const activeAddress = useActiveAddress();

  const syncAllAuthors = async () => {
    if (!connected) {
      // setIsFetching(false);
      return;
    }

    try {
      const res = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "AuthorList" }],
        anchor: "1234",
      });
      console.log("Dry run Author result", res);
      const filteredResult = res.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered Author result", filteredResult);
      setAuthorList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }

    // setIsFetching(false);
  };

  const registerAuthor = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register" }],
      data: "",
      signer: createDataItemSigner(window.arweaveWallet),
    });

    console.log("Register Author result", result);

    const registerResult = await result({
      process: processId,
      message: res,
    });

    console.log("Registered successfully", registerResult);

    if (registerResult[0].Messages[0].Data === "Successfully Registered.") {
      syncAllAuthors();
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllAuthors();
    console.log("This is active address", activeAddress);
    console.log(
      "Includes author",
      authorList.some((author) => author.PID === activeAddress)
    );

    setIsFetching(false);
  }, [connected]);

  return (
    <main>
      <Header />
      <div style={styles.parentDiv}>
        <h2>Welcome to create</h2>
        {isFetching && <div>Fetching posts...</div>}
        <hr style={styles.horizontalRule} />
        {authorList.some((author) => author.PID === activeAddress) ? (
          <Editor />
        ) : (
          <button style={styles.button} onClick={registerAuthor}>
            Register
          </button>
        )}
      </div>
    </main>
  );
};

export default Create;

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
  button: {
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100px",
  },
};
