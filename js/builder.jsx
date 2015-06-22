/**
 * Created by seonwoong on 15. 6. 16..
 */

var BuildMode = React.createClass({
    render: function () {
        return (
            <div className="accordion">
                <dl>
                    <dt className="title"><a href="#accordion1" aria-expanded="false"
                                             aria-controls="accordion1">LAYOUT</a></dt>
                    <dd className="item" id="accordion1" aria-hidden="true">
                        <div className="grid" draggable="true">Grid 1</div>
                        <div className="grid" draggable="true">Grid 2</div>
                    </dd>
                    <dt className="title"><a href="#accordion2" aria-expanded="false"
                                             aria-controls="accordion2">PLAIN</a>
                    </dt>
                    <dd className="item" id="accordion2" aria-hidden="true">
                        <div>Title</div>
                        <div>Address</div>
                        <div>Form</div>
                    </dd>
                </dl>
            </div>);
        //<div className="accordion">
        //    <dl>
        //        <dt><a href="#accordion1" aria-expanded="false" aria-controls="accordion1"
        //               className="accordionTitle js-accordionTrigger">LAYOUT</a></dt>
        //        <dd className="accordionItem is-collapsed" id="accordion1" aria-hidden="true">
        //            <p className="grid">Grid 1</p>
        //            <p className="grid">Grid 2</p>
        //        </dd>
        //        <dt><a href="#accordion2" aria-expanded="false" aria-controls="accordion2"
        //               className="accordionTitle js-accordionTrigger">PLAIN</a></dt>
        //        <dd className="accordionItem is-collapsed" id="accordion2" aria-hidden="true">
        //            <p>Title</p>
        //
        //            <p>Address</p>
        //
        //            <p>Form</p>
        //        </dd>
        //    </dl>
        //</div>);
    }
});

var DeviceViewMode = React.createClass({
    render: function () {
        return (
            <div id="device-mode" className="device-mode">
                <dt>DEVICE MODE</dt>
                <dd>Desktop <i className="fa fa-desktop"></i></dd>
                <dd>Tablet <i className="fa fa-tablet"></i></dd>
                <dd>Mobile <i className="fa fa-mobile"></i></dd>
            </div>
        )
    }
});

$(function () {
    setDnd();
    console.log("ready!");
    $("#menu-list li a").on("click", function (e) {
        $("#menu-list a").find("span.select").remove();
        $("#menu-list a").removeClass("active");
        $(e.target).addClass("active");
        $(this).append("<span class='glyphicon glyphicon-triangle-left select'></span>");
    });
    $("#menu-1").on("click", function () {
        React.render(
            <BuildMode />, document.getElementById('side-contents')
        );
    });
    $("#menu-2").on("click", function () {
        React.render(
            <DeviceViewMode />, document.getElementById('side-contents')
        );
    });

});