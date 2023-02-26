import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TextField, Autocomplete } from "@mui/material";
import {
  ICategory,
  ICreateBlogProps,
  InputChange,
} from "../../utils/TypeScript";

interface Props {
  blog: ICreateBlogProps;
  setBlog: (blog: ICreateBlogProps) => void;
}

const CreateForm: React.FC<Props> = ({ blog, setBlog }) => {
  const { category } = useSelector((state: RootState) => state);
  const capitalize = (str: string) => {
    return str
      .split(" ")
      .map(
        (word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };
  const handleChangeInput = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    if (target.type === "file") {
      target?.files &&
        setBlog({
          ...blog,
          [target.name]: {
            preview: URL.createObjectURL(target?.files[0]),
            file: target?.files[0],
          },
        });
    } else {
      setBlog({ ...blog, [target.name]: target.value });
    }
  };

  const selectArr =
    category.categories === null
      ? []
      : category?.categories.map((cat: ICategory) => {
          return { label: capitalize(cat.name), value: cat };
        });
  return (
    <form>
      <div className="form-group position-relative">
        <input
          type="text"
          placeholder="Title"
          name="title"
          className="form-control"
          value={blog.title}
          onChange={handleChangeInput}
          maxLength={50}
        />
        <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: 3 }}
        >
          {blog.title.length}/50
        </small>
      </div>
      <div className="form-group position-relative my-3">
        <input
          type="file"
          name="thumbnail"
          onChange={handleChangeInput}
          className="form-control"
          accept="image/*"
        />
      </div>
      <div className="form-group position-relative">
        <textarea
          className="form-control"
          style={{ resize: "none" }}
          maxLength={200}
          name="description"
          value={blog.description}
          onChange={handleChangeInput}
          rows={4}
        />
        <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: 3 }}
        >
          {blog.description.length}/200
        </small>
      </div>

      <div className="form-group position-relative">
        {category.categories === null ? (
          "Loading Categories"
        ) : (
          <Autocomplete
            disablePortal
            options={selectArr}
            isOptionEqualToValue={(option: any, value: any) =>
              option.iso === value.iso
            }
            sx={{ width: "100%" }}
            onChange={(_, newValue: any) =>
              setBlog({ ...blog, category: newValue?.value })
            }
            renderInput={(params) => (
              <TextField {...params} label="Categories" />
            )}
          />
        )}
        {/* <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: 3 }}
        >
          0/50
        </small> */}
      </div>
    </form>
  );
};

export default CreateForm;
