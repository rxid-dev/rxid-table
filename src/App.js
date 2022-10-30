import React, { Fragment } from "react";
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

  const model = useTable({
    columns: [
      {
        header: "Name",
        field: "name",
      },
      {
        header: "Username",
        field: "username",
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
    ],
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
  });

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

  return (
    <div className="App">
      <div className="container py-4">
        <h1>React Table Tutorial</h1>
        <h4>Create reusable table component on react app</h4>
        <RxidTable
          model={postModel}
          stringUrl="https://jsonplaceholder.typicode.com/posts"
        />
        <br />
        <br />
        <RxidTable
          model={model}
          actions={userAction}
          stringUrl="https://jsonplaceholder.typicode.com/users"
        />
        <br />
        <br />
        <RxidTable model={carModel} />
      </div>
    </div>
  );
}

export default App;
