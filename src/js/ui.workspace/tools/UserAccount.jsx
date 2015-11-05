(function () {
    var React = require("react");
    require('./UserAccount.less');

    var ProfileCard = require('../partComponents/ProfileCard.jsx');

    var User = React.createClass({
        mixins: [require('../reactMixin/EventDistributor.js')],


        render() {
            console.log('tool width', this.props.width);
            var wide = false;
            var rootClasses = ['UserAccount', 'white'];

            if (this.props.width > 210) {
                rootClasses.push('wide');
            }

            return (
                <div className={rootClasses.join(' ')}>
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
