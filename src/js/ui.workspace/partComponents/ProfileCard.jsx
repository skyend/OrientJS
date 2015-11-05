(function () {
    require('./ProfileCard.less');
    var React = require("react");

    var ProfileCard = React.createClass({

        render() {

            return (
                <div className="ProfileCard">
                    <div className='picture'>

                    </div>
                </div>
            );
        }
    });


    module.exports = ProfileCard;

})();
