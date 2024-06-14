import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = () => {
  const [draftContent, setDraftContent] = useState("");
  const [title, setTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const { connected } = useConnection();
  const processId = "5iK7nXtoUMWNCDtiOpwf75_ppw0v4LwusumyqiQdPq8";

  const createPost = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!connected) {
      return;
    }

    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Create-Post" },
          { name: "Content-Type", value: "text/html" },
          { name: "Title", value: title },
        ],
        data: draftContent,
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Post result", res);

      const postResult = await result({
        process: processId,
        message: res,
      });

      console.log("Post Created successfully", postResult);

      setDraftContent("");
      setTitle("");
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
  };

  return (
    <form>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={styles.titleInput}
      />
      <ReactQuill
        theme="snow"
        value={draftContent}
        onChange={setDraftContent}
      />
      {isPosting && <div>Posting...</div>}
      <button
        style={styles.button}
        type="submit"
        disabled={isPosting || (title == "" && draftContent == "")}
        onClick={(e) => createPost(e)}
      >
        Create Post
      </button>
    </form>
  );
};

export default Editor;

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "200px",
    marginTop: "20px",
  },
  titleInput: {
    marginBottom: "20px",
    width: "200px",
    border: "2px solid #ccc",
    borderRadius: "4px",
    padding: "4px 2px",
  },
};
