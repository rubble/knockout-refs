const ko = require("knockout");
const refs = require("../src/ref.js");

class Parent {
  close() {
    refs.form.clean();
  }
}

class NameForm {
  consturctor(params) {
    this.name = ko.observable(params.name);
  }

  clean() {
    this.name("");
  }
}

ko.components.register('parent', {
  viewModel: Parent,
  template: '<div data-bind="click: close"></div> <name-form params="name: \':)\'" data-bind="ref: \'form\'"></name-form>',
});

ko.components.register('name-form', {
  viewModel: NameForm,
  template: "<form>"
    + "<input type='text' data-bind='value: name'/>"
    + "</form>"
});


function loadFixture(path) {
  fixture.setBase('tests/fixtures');
  fixture.load(path);
  this.el = fixture.el.firstChild;
};

describe('ref', function() {
  it('should define refs', function() {
    loadFixture.call(this, 'form.html');
    ko.applyBindings({}, this.el);
    ko.tasks.runEarly();

    expect(ko.unwrap(refs.parent) instanceof Parent).toBe(true);
    expect(ko.unwrap(refs.form) instanceof NameForm).toBe(true);
  });
});

describe('refFn', function() {
  beforeEach(function() {
    this.cb = function() {};
    spyOn(this, 'cb');
  });

  it('should define refs', function() {
    loadFixture.call(this, 'form_refFn.html');
    ko.applyBindings({cb: this.cb}, this.el);
    ko.tasks.runEarly();

    expect(this.cb).toHaveBeenCalled();
  });
});
