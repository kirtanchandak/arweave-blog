import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const Home = () => {
  const { connected } = useConnection();

  return (
    <main>
      <Header />
      <div style={styles.div}>
        <h2>Welcome to BlinkBlog!</h2>
        {connected ? (
          <button style={styles.viewPostsButton}>
            <Link to="/view" style={styles.viewPostsLink}>
              View Posts
            </Link>
          </button>
        ) : (
          <ConnectButton />
        )}
      </div>
    </main>
  );
};

export default Home;

const styles = {
  div: {
    height: "calc(100vh - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  viewPostsButton: {
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  viewPostsLink: {
    color: "#fff",
    textDecoration: "none",
  },
};
