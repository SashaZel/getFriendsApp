const app = document.querySelector('#app');
const root = ReactDOM.createRoot(app);

class UserCard extends React.Component {
    render() {
        const eMail = (<p><em>{ this.props.userData.email }</em></p>);
        const showLocation = this.props.showLocation;
        return (
            <div>
                <p>
                    <img src={this.props.userData.picture.large} />
                </p>
                <p>UserCard of <strong>{this.props.userData.name.first}</strong></p>
                { eMail }
                {showLocation &&
                  <p>{this.props.userData.location.city}, {this.props.userData.location.country}</p>
                }
                <button 
                    style={this.props.showDelButton ? {display: 'block'} : {display: 'none'}}
                    onClick={this.props.delFriend} 
                    value={this.props.userData.login.username}
                >Delete Friend</button>
            </div>
        );
    }
}

class SearchBar extends React.Component {
    render() {
        return (
            <div>
                <form>
                    <input
                      type="checkbox"
                      checked={this.props.showLocation}
                      onChange={this.props.onShowLocationChange} />
                    Show location
                </form>
                <button onClick={this.props.getNewUser}>Met New Friend</button>
                <button onClick={this.props.addFriend}>Add to Friends</button>
            </div>
        );
    }
}

class FriendsList extends React.Component {
    
    render() {
        const friendsDisplay = [];
        this.props.myFriends.forEach((friend) => {
            friendsDisplay.push(<UserCard 
              userData={friend} 
              delFriend={this.props.delFriend}
              showDelButton={true}
              showLocation={this.props.showLocation}
              key={friend.login.username}
            />);
        });
        return (
            <div>{ friendsDisplay }</div>
        );
    }
}

class MainFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            showLocation: true,
            myFriends: [],
            userData: {} 
        };
        this.getNewUser = this.getNewUser.bind(this);
        this.addFriend = this.addFriend.bind(this);
        this.delFriend = this.delFriend.bind(this);
        this.onShowLocationChange = this.onShowLocationChange.bind(this);
    }

    async getNewUser() {
        const res = await fetch('https://randomuser.me/api/');
        const newUser = await res.json();
        //console.log(JSON.stringify(newUser.results[0]));
        this.setState({
            isLoaded: true,
            userData: newUser.results[0]
        });
    }

    addFriend() {
        this.setState(state => {
            if (state.myFriends.includes(state.userData)) {
                return;
            }
            return state.myFriends.push(state.userData);
        });
    }

    delFriend(e) {
        this.setState(state => ({myFriends: state.myFriends.filter(friend => friend.login.username !== e.target.value)}));
    }

    onShowLocationChange(e) {
        console.log('fire onShowLocationChange', e.target.checked);
        this.setState((state => {
            return { showLocation: e.target.checked};
        }));
    }

    componentDidMount() {
        this.getNewUser();
    }

    render() {
        if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        } else {
           return (
               <div>
                <UserCard 
                    userData={this.state.userData}
                    showDelButton={false}
                    showLocation={this.state.showLocation} />
                <SearchBar 
                    getNewUser={this.getNewUser}  
                    addFriend={this.addFriend}
                    showLocation={this.state.showLocation}
                    onShowLocationChange={this.onShowLocationChange}/>
                <FriendsList 
                    myFriends={this.state.myFriends} 
                    delFriend={this.delFriend}
                    showLocation={this.state.showLocation} />
                </div>
            ); 
        }
        
    }
}

root.render(<MainFrame />);