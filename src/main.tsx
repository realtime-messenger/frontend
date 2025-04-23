import {StrictMode, useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {SingleRoute} from "./types";
import {checkIfLoggedIn, delay, refreshAccessToken, timeToExpireAccess} from "./utils/utils.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthContext} from './context/contexts';
import {
  loggedInDesktopRoutes,
  loggedInMobileRoutes,
  loggedOutDesktopRoutes,
  loggedOutMobileRoutes
} from "./router/router.tsx";
import {StompSessionProvider} from "react-stomp-hooks";
import {getSTOMPurl} from "./api/routes/websocket.ts";

const getRoutes = (isLogged: boolean, isMobile: boolean) => {
  if (isMobile) {
    if (isLogged) {
      return loggedInMobileRoutes
    }
    else {
      return loggedOutMobileRoutes
    }
  } else {
    if (isLogged) {
      return loggedInDesktopRoutes
    }
    else {
      return loggedOutDesktopRoutes
    }
  }
}

const renderRoutes = (routes: SingleRoute[]) => (
  <Routes>
    {
      routes.map(
        (route: SingleRoute) => <Route path={route.path} element={route.element}/>
      )
    }
  </Routes>
)


export const App = () => {
  const [isLogged, setIsLogged] = useState(checkIfLoggedIn());
  const [isMobile, setIsMobile] = useState(false);

  const routes: SingleRoute[] = getRoutes(isLogged, isMobile);

  useEffect(() => {
    const isMobileTemp =  /Android|iPhone/i.test(navigator.userAgent)
    setIsMobile(isMobileTemp)
  }, [])


  useEffect(() => {
    const refresher = async () => {
      while (checkIfLoggedIn()) {
        if (timeToExpireAccess() < 30) {
          await refreshAccessToken()
        }
        setIsLogged(true)
        await delay(15000)
      }
      setIsLogged(false)
    }
    refresher()
  }, [isLogged])


  return (
    <AuthContext.Provider value={{isLogged, setIsLogged}}>
      <StompSessionProvider
        url={getSTOMPurl()}
      >
        <BrowserRouter>
          {
            renderRoutes(routes)
          }
        </BrowserRouter>
      </StompSessionProvider>
    </AuthContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
