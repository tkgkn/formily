import { connect, mapProps } from '@formily/react'
import { Transfer as NextTransfer } from '@alifd/next'

export const Transfer = connect(
  NextTransfer,
  mapProps({
    extract: 'dataSource',
  })
)

export default Transfer
