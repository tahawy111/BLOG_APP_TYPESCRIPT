import React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "../components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <Helmet>
        <title>404 | Not Found</title>
      </Helmet>
      <h1
        className="text-secondary"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 70px)",
        }}
      >
        404 | Not Found
      </h1>
    </Layout>
  );
};

export default NotFound;
