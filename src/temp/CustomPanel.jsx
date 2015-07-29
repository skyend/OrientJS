var React = require("react");
module.exports = React.createClass({
    render: function () {
        return (
            <div id="side-contents" className="side-contents">
                <div className="accordion">
                    <dl>
                        <dt>
                            <a href="#accordion1" aria-expanded="false" aria-controls="accordion1"
                                className="accordionTitle js-accordionTrigger">LAYOUT</a>
                        </dt>
                        <dd className="accordionItem is-collapsed" id="accordion1" aria-hidden="true">
                            <p id="grid">Grid 1</p>

                            <p>Grid 2</p>
                        </dd>
                        <dt>
                            <a href="#accordion1" aria-expanded="false" aria-controls="accordion1"
                                className="accordionTitle js-accordionTrigger">PLAIN</a>
                        </dt>
                        <dd className="accordionItem is-collapsed" id="accordion2" aria-hidden="true">
                            <p>Title</p>

                            <p>Address</p>

                            <p>Form</p>
                        </dd>
                    </dl>
                </div>
            </div>
        )
    }
});