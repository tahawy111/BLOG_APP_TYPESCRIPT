import { ICreateBlogProps } from "./TypeScript";

export const validCreateBlog = ({
  user,
  title,
  content,
  description,
  thumbnail,
  category,
  createdAt,
}: ICreateBlogProps): string => {
  let err: string = "";
  if (title.trim().length < 10) {
    return (err = "Title must be at least 10 chars");
  } else if (title.trim().length > 50) {
    return (err = "Title is up to 50 characters long.");
  }

  if (description.trim().length < 50) {
    return (err = "Description has at least 50 characters.");
  } else if (description.trim().length > 200) {
    return (err = "Description is up to 200 characters long.");
  }

  if (content.trim().length < 2000) {
    return (err = "Content has at least 2000 characters.");
  }

  if (!thumbnail) {
    return (err = "Thumbnail cannot be left blank.");
  }

  if (!category) {
    return (err = "Category cannot be left blank.");
  }

  return err;
};
