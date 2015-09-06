var ReasonCodes = {
  "has_not_parent": "has_not_parent",
  "is_ghost": "is_ghost"
};



var Returns = function() {
  this.result;
  this.reasonCode;
  this.detail;

  this.setResult = function(_result) {
    this.result = _result;
  };

  this.setReasonCode = function(_reasonCode) {
    if (ReasonCodes[_reasonCode] !== undefined) {
      this.reasonCode = _reasonCode;
    } else {
      throw new Error("Reason Code is invailid");
    }
  };

  this.setDetail = function(_detail) {
    this.detail = _detail;
  };
}

Returns.ReasonCodes = ReasonCodes;

module.exports = Returns;