import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route
} from 'react-router-dom';
import Welcome from './components/pages/welcome/Welcome';
import TableSearch from './components/pages/tableSearch/TableSearch';
import Root from './components/pages/Root';
// const router = createBrowserRouter(
//   [
//     {
//       path: '/',
//       element: <Welcome />,
//       children: [
//         {
//           path: 'tables',
//           element: <TableSearch />
//         }
//       ]
//     }
//   ],
//   { basename: '/home' }
// );

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/login" element={<Welcome />} />
      <Route path="/tables" element={<TableSearch />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
