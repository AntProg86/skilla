import React from 'react'

type contextProps = {
  doFetch: any,
}

const AppContext = React.createContext({} as contextProps)
export {
  contextProps,
  AppContext 
}