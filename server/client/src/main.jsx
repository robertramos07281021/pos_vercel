import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { createRoutesFromElements, Route, RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login.jsx'
import AdminRoute from './pages/AdminRoute/AdminRoute.jsx'
import Products from './pages/AdminRoute/Products.jsx'
import Transaction from './pages/AdminRoute/Transaction.jsx'
import Transactions from './pages/AdminRoute/Transactions.jsx'
import Dashboard from './pages/AdminRoute/Dashboard.jsx'
import Sales from './pages/AdminRoute/Sales.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
      
      <Route path="/"  element={<Login/>}/>
      <Route path='' element={<AdminRoute/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/transaction" element={<Transaction/>}/>
        <Route path="/transactions" element={<Transactions/>}/>
        <Route path="/sales" element={<Sales/>}/>
      </Route>
    </Route>




  )
)


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  
)
