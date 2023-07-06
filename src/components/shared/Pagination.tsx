import { Pagination } from 'antd'
import React from 'react'

function CustomPagination({total}) {
  return (
    <Pagination total={total} />

  )
}

export default CustomPagination