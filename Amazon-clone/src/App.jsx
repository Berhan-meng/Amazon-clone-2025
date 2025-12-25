// import ComponentA from "./ComponentA";
// import ComponentB from "./ComponentB";
// import Landing from "./Pages/Landing/Landing";
import Routing from "./Routing";
// import { ThemeProvider } from "./ContextProvider";
import {
  DataContext,
  // DataProvider,
} from "./assets/Components/DataProvider/DataProvider";
import { useContext, useEffect } from "react";
import { Type } from "./Utility/action.type";
import { auth } from "./Utility/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      dispatch({
        type: Type.SET_USER,
        user: authUser || null,
      });
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Routing />;
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
    
  // <ThemeProvider>
  //   <ComponentA />
  //   <ComponentB />
  // </ThemeProvider>
}

export default App;
