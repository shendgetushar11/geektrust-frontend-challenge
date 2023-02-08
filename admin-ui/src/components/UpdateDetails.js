import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const UpdateDetails = ({ users, setUsers, userId, setEditModal, ...props }) => {
  const userToEdit = users.find((user) => user.id === userId);

  const [formValue, setFormValue] = useState({
    name: userToEdit.name,
    email: userToEdit.email,
    role: userToEdit.role,
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  };
  const { name, email, role } = formValue;

  const submitHandler = () => {
    const newList = users.map((item) => {
      if (item.id === userId) {
        return { ...item, ...formValue };
      }
      return item;
    });
    setUsers(newList);
    setEditModal(false);
  };

  return (
    <Modal {...props} size="sm" centered>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              id="name"
              placeholder="Name"
              onChange={handleChange}
              value={name}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              id="email"
              placeholder="Email Address"
              onChange={handleChange}
              value={email}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              id="role"
              placeholder="Role"
              onChange={handleChange}
              value={role}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={() => setEditModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={submitHandler}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateDetails;