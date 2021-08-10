import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Notifications from '../../molecules/Notifications/Notifications'
import Settings from '../../molecules/Settings/Settings'
import DashboardHeader from '../../organisms/DashboardHeader/DashboardHeader'
import Footer from '../../organisms/Footer/Footer'
import OauthBoard from '../../organisms/OauthBoard/OauthBoard'
import GitLabPage from '../GitLabPage/GitLabPage'
import './DashboardPage.css'

interface IProps {
    tokens: {
      hasGithubToken: boolean,
      hasBitbucketToken: boolean,
      hasGitlabToken: boolean,
    }
}

const DashBoardPage: React.FC<IProps> = ({tokens}) => {
    return (
        <>
            <DashboardHeader />
            <main className="DashboardPage">
                <Router>
                    <div className="DashboardPage__content"> 
                        <Switch >
                            <Route exact path="/">
                                <OauthBoard tokens={tokens}/>
                            </Route>
                            <Route path="/gitlab">
                                <GitLabPage />
                            </Route>
                            <Route path="/notifications">
                                <Notifications />
                            </Route>
                            <Route path="/settings">
                                <Settings tokens={tokens}/>
                            </Route>
                        </Switch>
                    </div>
                    <Footer />
                </Router>
            </main>
        </>
    )
}

export default DashBoardPage