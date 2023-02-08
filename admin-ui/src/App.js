import Main from "./components/Main"
import "./App.css"

export const apiEndPoint = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"; 

function App() {
  return (
    <div className="App">
      <h1 className="main-heading">Admin UI Challenge</h1>
      <Main />
    </div>
  );
}

export default App;