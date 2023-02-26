import ReactQuill from "react-quill";
import { useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { checkImage, imageUpload } from "../../utils/imageUpload";
import { startLoading, stopLoading } from "../../slices/globalSlice";
interface Props {
  body: string;
  setBody: (blog: string) => void;
}

const Quill: React.FC<Props> = ({ body, setBody }) => {
  const modules = {
    toolbar: { container },
  };
  const quillRef = useRef<any>();

  const dispatch = useDispatch<AppDispatch>();

  // Custom Image
  const handleChangeImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async () => {
      const files = input.files;
      console.log(files);
      if (!files) return toast.error("File doesn't exist");
      const file = files[0];
      const check = checkImage(file);
      if (check) return toast.error(check);
      dispatch(startLoading());
      const photo = await imageUpload(file);

      const quill = quillRef.current;
      const range = quill?.getEditor().getSelection()?.index;
      if (range !== undefined) {
        quill?.getEditor().insertEmbed(range, "image", `${photo.url}`);
      }

      dispatch(stopLoading());
    };
  }, [dispatch]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    let toolbar = quill.getEditor().getModule("toolbar");
    toolbar.addHandler("image", handleChangeImage);
  }, [handleChangeImage]);

  return (
    <div>
      <ReactQuill
        value={body}
        theme="snow"
        modules={modules}
        placeholder="Write Something..."
        onChange={(e) => setBody(e)}
        ref={quillRef}
      ></ReactQuill>
    </div>
  );
};

let container = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean", "link", "image", "video"],
];

export default Quill;
