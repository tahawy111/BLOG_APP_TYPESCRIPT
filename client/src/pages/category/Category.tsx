import React, { useEffect, useState } from "react";
import { ICategory, IFormEvent } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../../slices/categorySlice";
import { startLoading, stopLoading } from "../../slices/globalSlice";
import Layout from "../../components/Layout";
import "./category.css";
import { Helmet } from "react-helmet-async";

export interface IUserLogin {
  account: string;
  password?: string;
}
const Category = () => {
  const [name, setName] = useState("");
  const [edit, setEdit] = useState<ICategory | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(startLoading());
    dispatch(getCategory()).then(() => {
      dispatch(stopLoading());
    });
  }, [dispatch]);

  useEffect(() => {
    if (edit) setName(edit.name);
  }, [edit]);

  const { categories } = useSelector((state: RootState) => state.category);

  const submitHandler = (e: IFormEvent) => {
    e.preventDefault();

    if (edit) {
      if (edit?.name === name) return;

      dispatch(startLoading());
      dispatch(updateCategory({ _id: edit._id, name })).then(() => {
        dispatch(stopLoading());
        setName("");
        setEdit(null);
      });
    } else {
      dispatch(startLoading());
      dispatch(createCategory(name)).then(() => {
        dispatch(stopLoading());
        setName("");
      });
    }
  };

  const handleDelete = (id: string) => {
    dispatch(startLoading());
    dispatch(deleteCategory(id)).then(() => {
      dispatch(stopLoading());
    });
  };
  return (
    <Layout>
      <Helmet>
        <title>Category</title>
      </Helmet>
      <div className="category">
        <form onSubmit={submitHandler}>
          <label htmlFor="category">Category</label>

          <div className="d-flex align-items-center">
            {edit && (
              <i onClick={() => setEdit(null)} className="fas fa-times me-2" />
            )}
            <input
              type="text"
              name="category"
              id="category"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button type="submit">{edit === null ? "Create" : "Update"}</button>
          </div>
        </form>

        <div>
          {categories !== null &&
            categories.map((category: ICategory) => (
              <div className="category_row" key={category._id}>
                <p className="m-0 text-capitalize" key={category._id}>
                  {category.name}
                </p>

                <div>
                  <i
                    onClick={() => setEdit(category)}
                    className="fas fa-edit mx-2 text-warning"
                  />
                  <i
                    onClick={() => handleDelete(category._id)}
                    className="fas fa-trash-alt text-danger"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Category;
