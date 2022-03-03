import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url) => axios.get(url).then((res) => res.data)

function useData(endpoint) {
  const { data, error } = useSWR(endpoint, fetcher)
  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export default useData
