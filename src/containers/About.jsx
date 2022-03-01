import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from 'antd'

function About() {
  const [user, setUser] = useState(null)
  const loadUser = async () => {
    const data = await axios.get('https://randomuser.me/api/')
    if (data.status === 200) {
      setUser(data.data.results[0])
    }
  }

  const [count, setCount] = useState(1)
  const syncAddCount = () => {
    setCount((prevCount) => prevCount + 1)
  }
  const asyncAddCount = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCount((prevCount) => prevCount + 1)
  }

  return (
    <div>
      <p>{count}</p>
      <Button type="primary" onClick={syncAddCount}>
        sync add 1
      </Button>
      <Button type="primary" onClick={asyncAddCount}>
        async add 1
      </Button>
      <Button type="primary" onClick={loadUser}>
        load random user
      </Button>
      {user && <div>{user.email}</div>}
    </div>
  )
}

export default About
