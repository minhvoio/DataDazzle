import "./App.css";
import DragComponent from "./DragDrop/DragComponent";

function App() {
  return (
    <div className="bg-slate-100 py-16">
      <div className="flex h-screen justify-center items-center px-5 ">
        <DragComponent />
      </div>
    </div>
  );
}

export default App;
