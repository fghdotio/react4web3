import { Link, Routes, Route } from 'react-router-dom'
import { Button } from 'antd'

import { useGlobalState, setGlobalState, globalFields } from '../models'

import Home from './Home'
import About from './About'
import Ether from './Ether'

import routes from '../utils/routes'

import './App.scss'

function App() {
  return (
    <div>
      <Link to={routes.home}>go home</Link>
      <Link to={routes.about}>go to about</Link>
      <Link to={routes.ether}>go to ether</Link>

      <StringContainer />
      <NumberContainer />

      <Routes>
        <Route path={routes.home} element={<Home />}></Route>
        <Route path={routes.about} element={<About />}></Route>
        <Route path={routes.ether} element={<Ether />}></Route>
      </Routes>
    </div>
  )
}

function StringContainer() {
  const [currentString] = useGlobalState(globalFields.STRING)
  const handleSuffix = () => {
    setGlobalState(globalFields.STRING, currentString + '$')
  }
  return (
    <p>
      {currentString}
      <Button onClick={handleSuffix}>Suffix $</Button>
    </p>
  )
}

function NumberContainer() {
  const [currentNumber] = useGlobalState(globalFields.NUMBER)
  const handleSetNumber = () => {
    setGlobalState(globalFields.NUMBER, currentNumber + 1)
  }
  return (
    <p>
      {currentNumber}
      <Button onClick={handleSetNumber}>Add 1</Button>
    </p>
  )
}

export default App
