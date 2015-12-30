export default class JS {
  constructor(_cssData) {
    this.import(_cssData);
  }

  import (_cssData) {
    this.id = _cssData._id;
    this.name = _cssData.name;
    this.js = _cssData.js;
    this.serviceId = _cssData.serviceId;
  }

  export (_cssData) {
    return {
      name: this.name,
      js: this.js
    }
  }
}