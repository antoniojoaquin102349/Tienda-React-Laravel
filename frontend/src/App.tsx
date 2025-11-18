import { createBrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/route";
import { createElement } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  const router = createBrowserRouter(
    routes.map((route)=>({ 
      ...route,
      element: route.isProtected ? (<ProtectedRoute children = {createElement(route.element)}/> 
      ) : (createElement(route.element)),
      children: route.children?.map((child)=>({
        ...child,
        element: child.isProtected ? (<ProtectedRoute children = {createElement(child.element)}/> 
        ) : (createElement(child.element)),
      })),
    }))
  );
  return(
    <Provider store={store}>
      <PersistGate persistor={persistor}/>
      <RouterProvider router={router} />
    </Provider>
  );
};   
export default App
