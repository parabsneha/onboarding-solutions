import React, { Component, Suspense } from 'react'
import { HashRouter, BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const ViewData = React.lazy(() => import('./views/ViewData/ViewData'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Landing = React.lazy(() => import('./views/pages/landing/Landing'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const PageApp = React.lazy(() => import('./components/App'))
const ViewAllBlogs = React.lazy(() => import('./views/Blogs/ViewAllBlogs'))

class App extends Component {
  render() {
    return (
      // <HashRouter>
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/blogs" name="Blogs" element={<ViewAllBlogs />} />
            <Route exact path="/appage" name="Login Page" element={<PageApp />} />
            <Route exact path="/ViewData" name="users" element={<ViewData />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path="/" name="Landing" element={<Landing />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
        </BrowserRouter>
      //  {/* </HashRouter> */}
    )
  }
}

export default App
