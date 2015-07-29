(function () {
    var React = require("react");
    require('./UserAccount.less');

    var ProfileCard = require('../partComponents/ProfileCard.jsx');

    var User = React.createClass({

        render() {
            return (
                <div className='UserAccount'>
                    <div className='wrapper'>
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
