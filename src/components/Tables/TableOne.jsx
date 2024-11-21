import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FormDialog from "../Maps/FormDialog";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const TableOne = ({ page, rowsPerPage }) => {
  const [paginatedData, setPaginatedData] = useState([]);

  const [value, setValue] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [result, setResult] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [open, setOpen] = useState(false);

  const [showHidePassword, setShowHidePassword] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const [copySuccess, setCopySuccess] = useState({});

  //useEffect for pagination
  useEffect(() => {
    const updatedData = Array.isArray(
      searchQuery && searchQuery.trim() !== "" ? result : value
    )
      ? (searchQuery && searchQuery.trim() !== "" ? result : value).slice(
          page * rowsPerPage,
          (page + 1) * rowsPerPage
        )
      : [];
    setPaginatedData(updatedData);
  }, [value, result, searchQuery, page, rowsPerPage]);

  // search user
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(`${baseUrl}/api/v1/searchUser/`, {
          params: {
            name: searchQuery,
            page: page + 1,
            pageSize: rowsPerPage,
          },

          headers: {
            Authorization: `${token}`,
            Accept: "application/json, text/plain, */*",
          },
        });
        console.log("search response", response.data);
        setResult(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [searchQuery, page, rowsPerPage]);

  
  const isClickedIcon = (id) => {
    setShowHidePassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe).then(() => {
        setCopySuccess((prev) => ({
          ...prev,
          [copyMe]: "Copied",
        }));
        setTimeout(() => {
          setCopySuccess((prev) => {
            const newState = { ...prev };
            delete newState[copyMe];
            return newState;
          });
        }, 1000);
      });
    } catch (err) {
      setCopySuccess((prev) => ({
        ...prev,
        [copyMe]: "Failed to copy",
      }));
      console.log(err);
    }
  };

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
      user.name.includes(searchQuery);
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
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(`${baseUrl}/api/v1/AllUsers`, {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json, text/plain, */*",
          },
        });
        const sortedData = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log(response.data);
        setValue(sortedData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  async function deleteUser(id) {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/deleteUser/${id}`,
        {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json, text/plain, */*",
          },
        }
      );
      const confirmation = confirm(
        `Are you sure you want to delete this user ${id} ?`
      );
      if (!confirmation) {
        return;
      }
      console.log(response.data);
      console.log("Is value an array:", Array.isArray(response.data.data));
      console.log("Before delete", value);

      setValue((prevValue) =>
        Array.isArray(prevValue)
          ? prevValue.filter((user) => user.id !== id)
          : []
      );
      console.log("after delete", value);
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
        const token = localStorage.getItem("authToken");
        const response = await axios.put(
          `${baseUrl}/api/v1/updateUser/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
              Accept: "application/json, text/plain, */*",
            },
          }
        );

        setValue((prev) => {
          console.log("before the update", prev);
          const newList = prev.map((user) =>
            user.id === editingId ? { ...user, ...response.data.data } : user
          );

          console.log("after the update", newList);

          return newList.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
        });

        setTimeout(() => {
          window.location.reload();
        }, 700);

        toast.success("User updated successfully");
      } else {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          `${baseUrl}/api/v1/signup`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
              Accept: "application/json, text/plain, */*",
            },
          }
        );
        setValue((prev) => {
          const newList = [response.data.data, ...prev];
          console.log(newList);
          return newList.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        });

        toast.success("User added successfully");
      }
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("User Add failed!");
    }
  };

  // const paginatedData = Array.isArray(
  //   searchQuery && searchQuery.trim() !== "" ? result : value
  // )
  //   ? (searchQuery && searchQuery.trim() !== "" ? result : value).slice(
  //       page * rowsPerPage,
  //       (page + 1) * rowsPerPage
  //     )
  //   : [];

  return (
    <div className="rounded-sm border  border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <ToastContainer
        autoClose={1500}
        hideProgressBar={false}
        pauseOnHover={true}
        draggable={true}
      />
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
                {showHidePassword[item.id]
                  ? item.password.slice(0, 10) + "..."
                  : "**********"}
              </p>
              <p className="text-meta-3 mb-2">
                {showHidePassword[item.id] ? (
                  <VisibilityIcon
                    onClick={() => {
                      isClickedIcon(item.id);
                    }}
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => {
                      isClickedIcon(item.id);
                    }}
                  />
                )}
              </p>

              <button
                onClick={() => {
                  copyToClipboard(item.password);
                }}
              >
                <ContentCopyIcon />
                {copySuccess[item.password] && (
                  <span>{copySuccess[item.password]}</span>
                )}
              </button>
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
