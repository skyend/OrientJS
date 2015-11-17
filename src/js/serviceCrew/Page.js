class Page {
  constructor(_contextController, _pageDataObject) {
    this.contextController = _contextController;


    this.import(_pageDataObject);
  }

  import (_pageDataObject) {
    let data = _pageDataObject || {};

    this.id = _pageDataObject._id || undefined;
  }

  export () {
    return {
      _id: this.id
    };
  }
}

export default Page;