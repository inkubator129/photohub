import React from 'react';
import cookie from 'react-cookie';
import { Link } from 'react-router';

import LoginPage from './authentication/login_page';
import Dashboard from './dashboard/dashboard';
import Header from './header/header';



export default class Homepage extends React.Component {

    componentWillMount(){
        this.state = {credInfo:cookie.load('credInfo')};
    }
    onLogin(token, user) {
        cookie.save('credInfo', token , { path: '/' });
        cookie.save('user', user , { path: '/' });
        this.setState({credInfo: token });
    }

    render(){
        if (!this.state.credInfo){
            return <LoginPage onSuccess={this.onLogin.bind(this)}/>;
        }
        return (
            <div>
                <Header />
                <Dashboard />
                {/*<div className="upload-icon">*/}
                    {/*<Link to="/upload" style={{color:'black', textDecoration: 'none'}}*/}
                          {/*className='glyphicon glyphicon-plus clickable' />*/}
                {/*</div>*/}
            </div>
            );
    }

}
