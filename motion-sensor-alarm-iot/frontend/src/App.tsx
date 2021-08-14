import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import DashboardPage from './components/pages/DashboardPage/DashboardPage';
import IndexPage from './components/pages/IndexPage/IndexPage';
import { checkSession } from './store/actionCreators'
// import io from 'socket.io-client'

interface IProps {
  isAuthenticated?: boolean,
  error?: string,
  isLoading?: boolean,
  onCheckSession?: () => void
}

const App: React.FC<IProps> = ({ onCheckSession, isAuthenticated, error, isLoading }) => {
  useEffect(() => {
    if (!isAuthenticated && !isLoading && !error ) {
      onCheckSession && onCheckSession()
    }
  }, [isAuthenticated, onCheckSession, isLoading, error])

  return (
    <main >
      {isLoading ? <p>Loading</p> : 
        isAuthenticated ? 
        <DashboardPage /> :
        <IndexPage />
      }
    </main>
  )
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        error: state.user.error,
        isLoading: state.user.loading
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onCheckSession: () =>  dispatch(checkSession()) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)