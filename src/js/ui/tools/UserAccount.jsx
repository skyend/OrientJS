(function () {
    var React = require("react");
    require('./UserAccount.less');

    var ProfileCard = require('../partComponents/ProfileCard.jsx');

    var User = React.createClass({
        mixins: [require('../reactMixin/EventDistributor.js')],

        landScapeMode(){
            this.emit("WantMaxWidth");
        },
        
        resize(){

        },

        render() {
            return (
                <div className='UserAccount'>
                    <div className='wrapper'>
                        <div className='tool-head'>
                            <ul>
                                <li onClick={this.landScapeMode}> FullSize </li>
                            </ul>
                        </div>
                        <div className='user-profile'>
                            <ProfileCard />
                        </div>

                    </div>
                </div>
            );
        }
    });

    module.exports = User;
})();
