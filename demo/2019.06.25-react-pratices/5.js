import { Component } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';

function fetchedUserInfo(data) {
	return {
		type: 'FETCH_USER_INFO',
		payload: data	
	};
}

function fetchUserInfo() {
	return function(dispatch) {
		fetch('/cgi-bin/userinfo')
			.then(res => res.json())
			.then(data => dispatch(fetchedUserInfo(data)));
	};
}

class UserInfo extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount () {
		this.props.fetchUserInfo();	
	}
	render() {
		const { nick } = this.props;
		return (
			<div>{nick}</div>
		);
	}
}

class Profile extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount () {
		this.props.fetchUserInfo();	
	}
	render() {
		const { nick } = this.props;
		return (
			<div>{nick}</div>
		);
	}
}

function mapStateToProps(state) {
    let { nick } = state;
    return {
        nick: nick        
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchUserInfo: () => {
            dispatch(fetchUserInfo());
        }
    }
}

/**
 * 问题：通过connect将 <UserInfo /> 与 action/state 关联起来
 * 1、在顶层引入对应的 action/reducer
 * 2、破坏了一个container，多个 dumb component 的实践
 * 3、子组件dispatch调用，引发子container的重新render，同时也会引发root container 重新render
 * 4、[重点] UserInfo、Profile 中，均 dispatch(fetchUserInfo())，导致 CGI 被重复调用
 */
class App extends Component {
	render() {		
		return (
			<div>
				<ConnectedUserInfo />
                <ConnectedProfile />
			</div>
		);
	}
}

let ConnectedUserInfo = connect(mapStateToProps, mapDispatchToProps)(UserInfo);
let ConnectedProfile = connect(mapStateToProps, mapDispatchToProps)(UserInfo);
let ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>
);