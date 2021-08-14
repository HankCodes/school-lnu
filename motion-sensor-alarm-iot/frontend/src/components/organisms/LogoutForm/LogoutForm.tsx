import React from 'react';
import * as actions from '../../../store/actionCreators'
import { connect } from 'react-redux'
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton';
import './LogoutForm.css'

interface IProps {
    onLogout: () => void 
}

const LogoutForm:React.FC<IProps> = ({ onLogout }) => {

    return (
        <div className="LogoutForm">
            <h2>Log out?</h2>
            <StandardButton buttonType="button" value="Log out" onClickHandler={onLogout} />
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        error: state.user.error,
        isLoading: state.user.loading
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onLogout: () =>  dispatch(actions.logout()) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutForm)