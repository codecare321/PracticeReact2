import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
const TableOne = ({ page, rowsPerPage }) => {
  const [value, setValue] = useState([]);
  console.log("Current value state:", value);

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

  const paginatedData = value.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  console.log("Paginated data:", paginatedData);

  return (
    <div className="rounded-sm border  border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="text-center text-[30px] mb-6 text-xl font-semibold text-black dark:text-white">
        User Lists
      </h4>
      {/* <hr style="border: 1px solid #000; margin: 10px 0;" /> */}
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

      {/* Table Data */}
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
              <button className="border rounded-lg bg-red-500 p-2 mr-3">
                Delete
              </button>
              <button className="border rounded-lg bg-yellow-400 p-2">
                Update
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
