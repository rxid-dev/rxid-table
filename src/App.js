import React, { Fragment, useEffect } from "react";
import "./App.css";
import { RxidTable, useTable } from "./rxid-table";

function App() {
  const cars = [
    {
      id: 1,
      name: "BWM",
      color: "Black",
    },
    {
      id: 2,
      name: "Marzedes Benz",
      color: "Red",
    },
  ];

  const postModel = useTable({
    columns: [
      {
        header: "Judul",
        field: "title",
      },
      {
        header: "Artikel",
        field: "body",
      },
    ],
  });

  const userAction = (record) => {
    return (
      <Fragment>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleView(record)}
        >
          <em className="fas fa-search"></em>
        </button>
        <button
          className="btn btn-sm btn-warning mx-2"
          onClick={() => handleEdit(record)}
        >
          <em className="fas fa-pen"></em>
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDelete(record)}
        >
          <em className="fas fa-trash"></em>
        </button>
      </Fragment>
    );
  };

  const badges = [
    "bg-primary",
    "bg-secondary",
    "bg-info",
    "bg-success",
    "bg-warning",
    "bg-danger",
  ];

  const userServerModel = useTable({
    columns: [
      {
        header: "Name",
        field: "name",
      },
      {
        header: "Username",
        field: "username",
        component: (record) => {
          const background = badges[(record.id - 1) % 6];
          return (
            <>
              <span className={"badge " + background}>
                {record.username || ""}
              </span>
            </>
          );
        },
      },
      {
        header: "Status",
        field: "status",
        component: (record) => {
          return (
            <>
              <span
                className={
                  "badge " +
                  (record.status === 1
                    ? "bg-success"
                    : record.status === 2
                    ? "bg-danger"
                    : "bg-secondary")
                }
              >
                {record.status === 1
                  ? "Verified"
                  : record.status === 2
                  ? "Banned"
                  : "Not Verified"}
              </span>
            </>
          );
        },
      },
      {
        header: "Email",
        field: "email",
      },
      {
        header: "Phone Number",
        field: "phone",
      },
      {
        header: "Website",
        field: "website",
      },
      {
        header: "City",
        field: "address.city",
      },
      {
        header: "Street",
        field: "address.street",
      },
      {
        header: "Suite",
        field: "address.suite",
      },
      {
        header: "Zip Code",
        field: "address.zipcode",
      },
      {
        header: "Aksi",
        component: userAction,
        sortable: false,
        options: {
          header: {
            className: "mx-auto",
          },
        },
      },
    ],
    perPage: 5,
  });

  const userClientModel = useTable({
    columns: [
      {
        header: "Name",
        field: "name",
      },
      {
        header: "Username",
        field: "username",
        component: (record) => {
          const background = badges[(record.id - 1) % 6];
          return (
            <>
              <span className={"badge " + background}>
                {record.username || ""}
              </span>
            </>
          );
        },
      },
      {
        header: "Email",
        field: "email",
      },
      {
        header: "Phone Number",
        field: "phone",
      },
      {
        header: "Website",
        field: "website",
      },
      {
        header: "City",
        field: "address.city",
      },
      {
        header: "Street",
        field: "address.street",
      },
      {
        header: "Suite",
        field: "address.suite",
      },
      {
        header: "Zip Code",
        field: "address.zipcode",
      },
      {
        header: "Aksi",
        component: userAction,
        sortable: false,
        options: {
          header: {
            className: "mx-auto",
          },
        },
      },
    ],
    perPage: 5,
  });

  const carModel = useTable({
    columns: [
      {
        header: "Name",
        field: "name",
      },
      {
        header: "Color",
        field: "color",
      },
    ],
    records: cars,
    perPage: 1,
    totalRecord: cars.length,
  });

  useEffect(() => {
    fetch("http://localhost:3001/users").then(async (successRepsonse) => {
      const result = await successRepsonse.json();
      userClientModel.setRecords(result);
    });
  }, []);

  const handleDelete = (record) => {
    console.log("Info: Come from handleDelete");
    console.log(record);
  };

  const handleEdit = (record) => {
    console.log("Info: Come from handleEdit");
    console.log(record);
  };

  const handleView = (record) => {
    console.log("Info: Come from handleView");
    console.log(record);
  };

  const handleAddUser = () => {
    const user = {
      id: Math.ceil(Math.random() * 1000),
      name: "New Data",
      username: "newData",
      email: "newData@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496",
        },
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
      status: 1,
      createdAt: Date.now(),
    };

    fetch("http://localhost:3001/users", {
      method: "POST",
      // mode: 'cors',
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(user),
    }).then((response) => {
      console.log("INFO: I am in");
      console.log(response);
      userServerModel.reload();
    });
  };

  return (
    <div className="App">
      <div className="container py-4">
        <h1>React Table Tutorial</h1>
        <h4>Create reusable table component on react app</h4>{" "}
        <div className="mb-4 mt-3">
          <select
            className="form-select"
            onChange={(e) => {
              userServerModel.setCustomData({
                status: e.target.value,
              });
            }}
          >
            <option value="">Pilih Status</option>
            <option value={0}>Not Verified</option>
            <option value={1}>Verified</option>
            <option value={2}>Banned</option>
          </select>
          <button className="btn btn-primary mt-3" onClick={handleAddUser}>
            Add New
          </button>
        </div>
        <RxidTable
          model={userServerModel}
          stringUrl="http://localhost:3001/users"
        />
        <br />
        <br />
        <RxidTable model={userClientModel} />
        <br />
        <br />
        <RxidTable model={postModel} stringUrl="http://localhost:3001/posts" />
        <br />
        <br />
        <RxidTable model={carModel} />
      </div>
    </div>
  );
}

export default App;
