import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setComments } from "../slices/commentSlice";
import { AppDispatch, RootState } from "../store";
import { IComment } from "./TypeScript";

const SocketClient = () => {
  const dispatch: AppDispatch = useDispatch();
  const { socket } = useSelector((state: RootState) => state.socket);
  // Create Comment
  useEffect(() => {
    if (!socket) return;
    socket.on(
      "changeComment",
      (data: { comments: IComment[]; count: number }) => {
        dispatch(setComments(data));
      }
    );

    return () => socket.off("changeComment");
  }, [socket, dispatch]);
  return <div></div>;
};

export default SocketClient;
