export default class CSS {
  constructor(_cssData) {
    this.import(_cssData);
  }

  import (_cssData) {
    this.id = _cssData._id;
    this.name = _cssData.name;
    this.css = _cssData.css;
    this.serviceId = _cssData.serviceId;
  }

  export (_cssData) {
    return {
      name: this.name,
      css: this.css
    }
  }
}