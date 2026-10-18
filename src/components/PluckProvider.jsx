import { createContext, useContext, useMemo, useRef } from 'react'

const PluckContext = createContext(null)

// Lets the Home landing intercept piano nav clicks so the character can pluck
// the matching string before the page changes. A registered handler returns
// true when it takes over the navigation; with no handler (any other page),
// keys navigate as plain links.
export function PluckProvider({ children }) {
  const handler = useRef(null)
  const value = useMemo(
    () => ({
      register(fn) {
        handler.current = fn
        return () => {
          if (handler.current === fn) handler.current = null
        }
      },
      pluck(key) {
        return handler.current ? handler.current(key) === true : false
      },
    }),
    [],
  )
  return <PluckContext.Provider value={value}>{children}</PluckContext.Provider>
}

export function usePluck() {
  return useContext(PluckContext)
}
