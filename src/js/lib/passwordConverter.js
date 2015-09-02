var $ = require('jquery');
var jQuery = require('jquery');

String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
}

var browser = (function () {
    var s = navigator.userAgent.toLowerCase();
    var match = /(webkit)[ \/](\w.]+)/.exec(s) ||
        /(opera)(?:.*version)?[ \/](\w.]+)/.exec(s) ||
        /(msie) ([\w.]+)/.exec(s) ||
        /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
        [];
    return {name: match[1] || "", version: match[2] || "0"};
}());

(function ($) {
    $.extend($.fn, {
        caret: function (start, end) {
            var elem = this[0];

            if (elem) {
                // get caret range
                if (typeof start == "undefined") {
                    if (elem.selectionStart != undefined) {
                        start = elem.selectionStart;
                        end = elem.selectionEnd;
                    }
                    else if (document.selection) {
                        var val = this.val();
                        var range = document.selection.createRange().duplicate();
                        range.moveEnd("character", val.length)
                        start = (range.text == "" ? val.length : val.lastIndexOf(range.text));

                        range = document.selection.createRange().duplicate();
                        range.moveStart("character", -val.length);
                        end = range.text.length;
                    }
                }
                // set caret range
                else {
                    var val = this.val();

                    if (typeof start != "number") start = -1;
                    if (typeof end != "number") end = -1;
                    if (start < 0) start = 0;
                    if (end > val.length) end = val.length;
                    if (end < start) end = start;
                    if (start > end) start = end;

                    elem.focus();

                    if (elem.selectionStart) {
                        elem.selectionStart = start;
                        elem.selectionEnd = end;
                    }
                    else if (document.selection) {
                        var range = elem.createTextRange();
                        range.collapse(true);
                        range.moveStart("character", start);
                        range.moveEnd("character", end - start);
                        range.select();
                    }
                }

                return {start: start, end: end};
            }
        }
    });
})(jQuery);

$.fn.passwordConverter = function (options) {
    var defaults = {
        duration: 3000,
        mask: '\u25CF'
    };
    var values = Array();
    this.each(function () {
        var ret = {
            pass: null,
            text: null,
            focused: false,
            timeout: null,
            opts: null,

            maskNow: function (ival) {
                clearTimeout(ret.timeout);
                if (ret.opts.mask != null) {
                    var vl;
                    var ss = ret.text.caret().start;
                    if ($.isArray(ival)) {
                        vl = ret.opts.mask.repeat(ival[0])
                            + ret.text.val().substring(ival[0], ival[1])
                            + ret.opts.mask.repeat(ret.text.val().length - ival[1]);
                    } else {
                        vl = ret.opts.mask.repeat(ret.text.val().length);
                    }
                    if (vl != ret.text.val()) {
                        ret.text.removeAttr("lastpos").val(vl);
                    }
                    if (ret.focused) {
                        ret.text.caret(ss, ss);
                    }
                }
            },

            reMask: function (ival) {
                if (ret.opts.mask == null) return;
                ret.maskNow(ival);
                if ($.isArray(ival)) {
                    ret.timeout = setTimeout(ret.maskNow, ret.opts.duration);
                }
            },

            unMask: function () {
                clearTimeout(ret.timeout);
                ret.opts.mask = null;
                ret.text.val(ret.pass.val());
            }
        }
        ret.opts = $.extend(defaults, options);
        ret.pass = $(this);
        var caretMoved = true;

        function sel(ev) {
            if (!caretMoved && (browser.name == 'safari' || browser.name == 'webkit')) {
                caretMoved = true;
                ret.text.change();
            }
            var el = $(ev.target);
            var range = el.caret();
            if (range.start != range.end) {
                el.attr("lastpos", range.start + "," + range.end)
            } else {
                el.removeAttr("lastpos");
            }
        }

        var ieChange = function (ev) {
            if (event.propertyName == "value") {
                ret.text.unbind("propertychange").change();
            }
        }
        if (browser.name == 'msie') {
            var htm = this.outerHTML.replace("password", "text");
            ret.text = $(htm).val(ret.pass.val()).bind("propertychange", ieChange);
            ret.pass.closest("form").submit(function () {
                ret.text.attr("disabled", "disabled");
            });
        } else ret.text = ret.pass.clone().removeAttr('data-reactid').attr("type", "text");
        //} else ret.text = ret.pass.clone().attr("type", "text");
        var last = null;
        ret.text.attr("autocomplete", "off").removeAttr("name").change(function (evt) {
            if (last == ret.text.val()) return;
            var t = last = ret.text.val();
            var tr = ret.pass.val();
            var lp = ret.text.attr("lastpos");
            if (lp == null) {
                lp = $(evt.target).caret().end - (t.length - tr.length);
            } else {
                lp = lp.split(",");
                tr = tr.substring(0, parseInt(lp[0])) + tr.substring(parseInt(lp[1]));
                lp = parseInt(lp[0]);
            }
            var added = t.length - tr.length;
            if (added > 0) {
                tr = tr.substring(0, lp) + t.substring(lp, lp + added) + tr.substring(lp);
                ret.reMask([lp, lp + added]);
            } else
                tr = tr.substring(0, lp + added) + tr.substring(lp);
            ret.pass.val(tr);
            //ret.text.attr("real", tr).attr("autocomplete", "off").removeAttr("lastpos");
            ret.text.attr("autocomplete", "off").removeAttr("lastpos");
            if (browser.name == 'msie') ret.text.bind("propertychange", ieChange);
        }).keyup(sel).mouseup(sel).select(sel)
            .bind("input", function () {
                if (browser.name == 'opera' || browser.name == 'mozilla') ret.text.change();
                else caretMoved = false;
            })
            .focus(function () {
                ret.focused = true;
            }).blur(function () {
                ret.focused = false;
            })
        ret.pass.after(ret.text).hide().removeAttr("id");
        ret.reMask();
        values.push(ret);
    });
    values = $(values);
    values.$ = this;
    return values;
};
