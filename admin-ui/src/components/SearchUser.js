import { Form } from "react-bootstrap";
const SearchUser = ({ searchUser }) => {
  return (
    <Form.Control
      type="text"
      placeholder="Search By Name, Email or Role"
      onChange={searchUser}
    />
  );
};

export default SearchUser;

