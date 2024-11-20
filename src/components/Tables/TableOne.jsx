import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

import FormDialog from "../Maps/FormDialog";
const TableOne = ({ page, rowsPerPage }) => {
  const [value, setValue] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [result, setResult] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const handleClickOpen = (editingItem = null) => {
    if (editingItem) {
      // Edit mode
      setIsEditing(true);
      setEditingId(editingItem.id);
      setFormData({
        name: editingItem.name,
        email: editingItem.email,
        password: editingItem.password,
        retypePassword: editingItem.password,
      });
    } else {
      // Add mode
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        retypePassword: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      retypePassword: "",
    });
  };

  // const handleUserInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchInputChange = (event) => {
    console.log("search event", event.target.value);
    setSearchQuery(event.target.value);

    const filterData = value.filter((user) => {
      user.name.includes(setSearchQuery);
    });

    setResult(filterData);
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setFormData({ ...user, retypePassword: "" });
    setIsEditing(true);
    setOpen(true);
  };

  const baseUrl = "http://localhost:3000";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/AllUsers`);
        console.log(response.data);
        setValue(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  async function deleteUser(id) {
    try {
      const response = await axios.delete(`${baseUrl}/api/v1/deleteUser/${id}`);
      const confirmation = confirm(
        `Are you sure you want to delete this user ${id} ?`
      );
      if (!confirmation) {
        return;
      }
      console.log(response.data);
      console.log("Is value an array:", Array.isArray(response.data.data));

      setValue((prevValue) =>
        Array.isArray(prevValue)
          ? prevValue.filter((user) => user.id !== id)
          : []
      );
    } catch (err) {
      console.log(err);
    }
  }
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("All fields are required");
      return;
    }

    if (!isEditing && formData.password !== formData.retypePassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      if (isEditing) {
        const response = await axios.put(
          `${baseUrl}/api/v1/updateUser/${editingId}`,
          formData
        );
        setValue((prev) => {
          const updatedList = prev.map((user) =>
            user.id === editingId ? { ...user, ...response.data.data } : user
          );

          return updatedList.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
        });
        alert("User updated successfully");
      } else {
        const response = await axios.post(`${baseUrl}/api/v1/signup`, formData);
        setValue((prev) => {
          const newList = [response.data.data, ...prev];
          console.log(newList);
          return newList.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        });
        alert("User added successfully");
      }
      handleClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  const paginatedData = Array.isArray(result)
    ? result.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/searchUser/`, {
          params: {
            name: searchQuery,
            page: page + 1,
            pageSize: rowsPerPage,
          },
        });
        console.log("search response", response.data);
        setResult(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div className="rounded-sm border  border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className=" text-[30px] mb-6 text-xl font-semibold text-black dark:text-white">
        User Lists
      </h4>
      <div className="">
        <h4 className="flex items-center relative justify-center  text-center text-[18px] mb-6 text-xl font-semibold text-black dark:text-white">
          <input
            type="search"
            name="text"
            className="border rounded p-[2px]"
            onChange={handleSearchInputChange}
            value={searchQuery}
          />

          <div className="absolute right-0">
            <FormDialog
              handleSubmit={handleSubmit}
              handleClickOpen={() => handleClickOpen()}
              handleClose={handleClose}
              handleInputChange={handleInputChange}
              formData={formData}
              open={open}
              isEditing={isEditing}
            />
          </div>
        </h4>
      </div>

      <hr />
      <div className="grid grid-cols-3 sm:grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 p-2.5 xl:p-5">
        <div>
          <h5 className="text-sm font-medium uppercase">ID</h5>
        </div>
        <div className="text-center">
          <h5 className="text-sm font-medium uppercase">Name</h5>
        </div>
        <div className="text-center">
          <h5 className="text-sm font-medium uppercase">Email</h5>
        </div>
        <div className="text-center">
          <h5 className="text-sm font-medium uppercase">Password</h5>
        </div>

        <div className="text-center">
          <h5 className="text-sm font-medium uppercase">Actions</h5>
        </div>
      </div>

      <hr />

      {paginatedData.length > 0 ? (
        paginatedData.map((item) => (
          <div
            className="grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark p-2.5 xl:p-5"
            key={item.id}
          >
            <div className="flex items-center gap-3">
              <p className="text-black dark:text-white">{item.id}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-black dark:text-white">{item.name}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-black dark:text-white">{item.email}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-meta-3">
                {item.password.slice(0, 10) + "..."}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <button
                className="border rounded-lg bg-red-500 p-2 mr-3"
                onClick={() => deleteUser(item.id)}
              >
                Delete
              </button>

              <button
                onClick={() => handleEditClick(item)}
                className="border rounded-lg bg-yellow-500 p-2 mr-3"
              >
                Edit
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default TableOne;

TableOne.propTypes = {
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
