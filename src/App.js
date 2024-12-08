import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BlogPostList from "./component/BlogsList";


function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<BlogPostList />}></Route>
            <Route path="*" element={<div>404 Not Found</div>}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
