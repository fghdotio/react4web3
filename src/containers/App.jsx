import { Link, Routes, Route } from 'react-router-dom'

import Home from './Home'
import About from './About'

import routes from '../utils/routes'

import './App.scss'

function App() {
  return (
    <div>
      <Link to={routes.home}>go home</Link>
      <br />
      <Link to={routes.about}>go to about</Link>

      <Routes>
        <Route path={routes.home} element={<Home />}></Route>
        <Route path={routes.about} element={<About />}></Route>
      </Routes>
    </div>
  )
}

export default App
