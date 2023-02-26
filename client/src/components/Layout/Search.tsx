import { useEffect, useState } from "react";
import { IBlogs } from "../../utils/TypeScript";
import CardHoriz from "../cards/CardHoriz";
import axios from "axios";

const Search = () => {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (search.length < 2) return;
        const res = await axios.get(
          `${process.env.REACT_APP_API}/search/blogs?title=${search}`,
          {
            headers: {
              authorization: JSON.parse(localStorage.user).access_token,
            },
          }
        );
        setBlogs(res.data);
      } catch (error) {
        console.log(error);
        setBlogs([]);
      }
    };
    fetchData();
  }, [search]);
  return (
    <div className="w-100 search position-relative">
      <input
        type="text"
        className="form-control form-control-md me-2 w-100 my-2"
        value={search}
        placeholder="Search For Blog Title"
        onChange={(e) => setSearch(e.target.value)}
      />
      {search.length >= 2 && (
        <div
          className="position-absolute pt-2 px-1"
          style={{
            background: "#eee",
            zIndex: 10,
            maxHeight: "calc(100vh - 100px)",
            overflow: "auto",
          }}
        >
          {blogs.length
            ? blogs.map((blog: IBlogs) => (
                <CardHoriz key={blog._id} blog={blog} />
              ))
            : "No Blogs"}
        </div>
      )}
    </div>
  );
};

export default Search;
