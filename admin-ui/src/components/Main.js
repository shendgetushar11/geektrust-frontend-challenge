import "./Main.css";
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  Stack,
  Row,
  Col,
  Form,
  Container,
} from "react-bootstrap";
import axios from "axios";
import SearchUser from "./SearchUser";
import PaginateButtons from "./PaginateButtons";
import UpdateDetails from "./UpdateDetails";
import { apiEndPoint } from "../App";

function Main() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const didUserSearch = useRef(false);
  const [selectedId, setSelectedId] = useState([]);
  const [isAllSelectedRows, setIsAllSelectedRows] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const MAX_ENTRIES = 10;

  const changeDetails = (userId) => {
    setUpdateId(userId);
    setEditModal(true);
  };

  const onAllSelectedRows = (event) => {
    let newList = [...selectedId];
    if (event.target.checked) {
      setIsAllSelectedRows(true);
      newList = currentUsers.map((user) => user.id);
    } else {
      setIsAllSelectedRows(false);
      newList = [];
    }
    setSelectedId(newList);
  };

  const onRemove = (userId) => {
    const newList = users.filter((user) => user.id !== userId);
    setUsers(newList);
  };

  const onSelectedUser = (event) => {
    const userId = event.target.value;
    let newList = [...selectedId];

    if (event.target.checked) {
      newList = [...selectedId, userId];
    } else {
      setIsAllSelectedRows(false);
      newList.splice(selectedId.indexOf(userId), 1);
    }
    setSelectedId(newList);
  };

  const removeSelected = () => {
    const newList = users.filter((user) => !selectedId.includes(user.id));
    setUsers(newList);
    setIsAllSelectedRows(false);
  };

  //Function for searching the user.  
  const searchUser = (event) => {
    didUserSearch.current = true
    setSearch(event.target.value);

  };

  const filter = () => {
    setCurrentPageNumber(1)
    if (search !== "")  {
      const result = users.filter((item) => {
        if(item.email.includes(search) || item.name.includes(search) || item.role.includes(search)) {
            return item;
          }
         }
      );
      setFilteredUsers(result);
      console.log(result)
    } else {
      setFilteredUsers(users);
    }
  }; 

  //Function to make API call to the endpoint given to get the users data.
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiEndPoint);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.log("Error in getting the users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (didUserSearch.current) {
      filter()
       
      didUserSearch.current = false;
    }
  }, [search]);

  //pagination
  const indexOfLastUser = currentPageNumber * MAX_ENTRIES;
  const indexOfFirstUser = indexOfLastUser - MAX_ENTRIES;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / MAX_ENTRIES);

  const paginate = (pageNumber) => setCurrentPageNumber(pageNumber);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <SearchUser searchUser={searchUser} />
        </Col>
      </Row>
      <Row>
        <Col className="mt-2">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={onAllSelectedRows}
                    checked={isAllSelectedRows}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length ? (
                currentUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className={selectedId.includes(user.id) ? "bg-color" : ""}
                    >
                      <td>
                        <Form.Check
                          type="checkbox"
                          value={user.id}
                          onChange={onSelectedUser}
                          checked={selectedId.includes(user.id)}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Stack direction="horizontal" gap={2}>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => changeDetails(user.id)}
                          >
                            <i className="bi bi-pencil text-primary"></i>
                          </Button>

                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => onRemove(user.id)}
                          >
                            <i className="bi bi-person-x-fill text-danger"></i>
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No User Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      {currentUsers.length > 0 ? (
        <Row className="pt-2 pt-md-0">
          <Col xs="12" md="4">
            <Button
              variant="danger"
              size="sm"
              onClick={removeSelected}
              disabled={selectedId.length > 0 ? false : true}
            >
              Delete Selected
            </Button>
          </Col>
          <Col xs="12" md="8">
            <PaginateButtons
              currentPageNumber={currentPageNumber}
              paginate={paginate}
              totalPages={totalPages}
            />
          </Col>
        </Row>
      ) : (
        ""
      )}
      {editModal ? (
        <UpdateDetails
          users={users}
          setUsers={setUsers}
          userId={updateId}
          setEditModal={setEditModal}
          show={editModal}
          onHide={() => setEditModal(false)}
        />
      ) : (
        ""
      )}
    </Container>
  );
}

export default Main;
