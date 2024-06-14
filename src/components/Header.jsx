import { ConnectButton } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";

const Header = () => {
  const navLinks = [
    {
      title: "View",
      path: "/view",
    },
    {
      title: "Create",
      path: "/create",
    },
  ];
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.title}>
        <h1>BlinkBlog</h1>
      </Link>
      <div>
        {navLinks.map((link) => {
          return (
            <Link key={link.title} to={link.path} style={styles.nav}>
              {link.title}
            </Link>
          );
        })}
      </div>
      <ConnectButton
        profileModal={true}
        showBalance={false}
        showProfilePicture={true}
      />
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    textDecoration: "none",
    color: "#000",
  },
  nav: {
    textDecoration: "none",
    color: "#000",
    margin: "10px",
  },
};

export default Header;
