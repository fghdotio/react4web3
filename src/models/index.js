import { createGlobalState } from 'react-hooks-global-state'

const globalFields = {
  ADDRESS: 'address',
  NUMBER: 'number',
  STRING: 'string',
}

const { setGlobalState, useGlobalState } = createGlobalState({
  [globalFields.ADDRESS]: null,
  [globalFields.NUMBER]: 1,
  [globalFields.STRING]: 'hhh',
})

export { useGlobalState, setGlobalState, globalFields }
