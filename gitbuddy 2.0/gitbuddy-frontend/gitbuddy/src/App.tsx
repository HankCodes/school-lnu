import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import IndexHero from './components/molecules/IndexHero/IndexHero';
import IndexHeader from './components/organisms/IndexHeader/IndexHeader';
import SignupForm from './components/organisms/SignupForm/SignupForm';
import IndexPage from './components/pages/IndexPage/IndexPage'
import DashboardPage from './components/pages/DashboardPage/DashboardPage'
import Loader from './components/molecules/Loader/Loader';
import * as actions from './store/actionCreators'


interface IProps {
    isAuthenticated?: boolean, 
    email?: string,
    firstName?: string,
    gitUserProfiles: any,
    tokens: {
      hasGithubToken: boolean,
      hasBitbucketToken: boolean,
      hasGitlabToken: boolean,
    },
    error?: string, 
    isLoading?: boolean,
    onUrlHasToken: (token: string) => void,
    onCheckSession?: () => void,
    onGetGitUserProfile: () => void
}

const App: React.FC<IProps> = ({ 
  tokens,
  gitUserProfiles,
  onGetGitUserProfile, 
  onUrlHasToken, 
  onCheckSession, 
  email, 
  firstName, 
  isAuthenticated, 
  isLoading, 
  error}) => {
  useEffect(() => {
    if (!isAuthenticated && !error) {
      onCheckSession && onCheckSession()
    }

    // TODO replace for a more generic solution
    if (!tokens.hasGitlabToken && !error) {
      const token = (window.location.search.match(/token=([^&]+)/) || [])[1] 

      if (token) {
        onUrlHasToken(token)
      }
    }
    
    if (tokens.hasGitlabToken && !isLoading && !gitUserProfiles.gitlab && !error) {
      onGetGitUserProfile()
    }
  })

  return (
    <>
    { isLoading ? 
        <Loader /> : 
          isAuthenticated ?
          <DashboardPage tokens={tokens}/> :
          <IndexPage Header={IndexHeader} Left={IndexHero} Right={SignupForm} />
    }
    </>
  ) 
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        email: state.user.email,
        firstName: state.user.firstName, 
        gitUserProfiles: state.user.gitUserProfiles,
        tokens: {
          hasGitlabToken: state.user.hasGitlabToken,
          hasGithubToken: state.user.hasGithubToken,
          hasBitbucketToken: state.user.hasBitbucketToken,
        },
        error: state.user.error,
        isLoading: state.user.loading
    }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onCheckSession: () => dispatch(actions.checkSession()),
    onUrlHasToken: (token: string) => dispatch(actions.urlHasToken(token)),
    onGetGitUserProfile: () => dispatch(actions.getGitUserProfile())   
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
