import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

function Loading() {
  const { loading } = useSelector((state: RootState) => state.global);
  return (
    <div
      className={`${
        loading ? "d-flex" : "d-none"
      } position-fixed w-100 h-100 text-center loading justify-content-center align-items-center`}
      style={{
        background: "#0007",
        color: "white",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
    // <div className="d-flex justify-content-center align-items-center w-100 h-100">
    //   <Spinner animation="border" role="status">
    //     <span className="visually-hidden">Loading...</span>
    //   </Spinner>
    // </div>
  );
}

export default Loading;
