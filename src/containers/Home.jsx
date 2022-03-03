import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Table } from 'antd'

import useData from '../hooks/useData'

const pageSize = 20
const baseURL = `https://5af71a21c222a90014dbda4f.mockapi.io/api/v1/records?limit=${pageSize}&page=`

const formatData = (data) => {
  if (Array.isArray(data)) {
    const fd = []
    data.forEach((item) => {
      const d = {
        key: item.id,
        date: item.date,
        title: item.title,
        amount: item.amount,
        id: item.id,
      }
      fd.push(d)
    })
    return fd
  } else {
    return []
  }
}
const columns = [
  {
    title: 'date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
]

// Table 作为 component，不同表的数据不同，data 作为 props 传下来
function Home() {
  let initialPage = 1
  const [searchParams] = useSearchParams()
  const pv = searchParams.get('p')
  if (pv) {
    // TODO: 类型转换安全性
    initialPage = Number(pv)
  }
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [endpoint, setEndpoint] = useState(baseURL + currentPage)
  const { data, isLoading, error } = useData(endpoint)
  const handleTurnToNextPage = (page) => {
    setEndpoint(baseURL + page)
    setCurrentPage(page)
    navigate(`?p=${page}`)
  }
  const navigate = useNavigate()

  if (error) {
    return <div>failed to load</div>
  }
  if (isLoading) {
    return <div>loading</div>
  }
  return (
    <div>
      <Table
        dataSource={formatData(data)}
        columns={columns}
        pagination={
          Array.isArray(data)
            ? {
                total: 50, // TODO: 需要单独字段
                pageSize, // TODO: custom
                position: 'both',
                onChange: handleTurnToNextPage,
                current: currentPage,
                // showQuickJumper: true,
                // showSizeChanger: true,
              }
            : false
        }
      />
    </div>
  )
}

export default Home
// https://etherscan.io/blocks
// https://ant.design/components/table-cn/
