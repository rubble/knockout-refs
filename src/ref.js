(function(factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
      // CommonJS module
      module.exports = factory(require("knockout"));
    } else if (typeof define === "function" && define.amd) {
      // AMD anonymous module
      define(["knockout"], factory);
    } else {
      // No module loader (plain <script> tag) - put directly in global namespace
      factory(window.ko);
    }
})(function(ko) {
  "use strict";

  function getComponentForNode(element, allBindings, bindingContext) {
    // knockout does not give access to the component from the element on
    // which component binding is defined, one has to use a child element.
    if ("component" in allBindings()) { 
      const node = element.children[0];
      return node ? ko.contextFor(node).$component : bindingContext.$component;
    } else
      return bindingContext.$component;
  };

  ko.bindingHandlers.ref = {
    refs: {},
    update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
      // Use update, so this code will update the reference also when
      // a component binding is changing, this avoids keeping a reference to
      // a component that otherwise could be garbage collected.
      if (!("component" in allBindings())) {
        if (console.warn)
          console.warn(
            "ref binding should be used together with a component binding, "
            + "otherwise you might leak memory if the component binding can change dynamically."
          );
      }
      const refs = ko.bindingHandlers.ref.refs,
        ref = ko.unwrap(valueAccessor());
      ko.tasks.schedule(() => {
        // this task runs after a task that loads the component
        const component = getComponentForNode(element, allBindings, bindingContext);
        // keep track of components inside observables, this allows the user to
        // subscribe if a component is changing.
        refs[ref] = refs.hasOwnProperty(ref) ? refs[ref](component) : ko.observable(component);
        ko.utils.domNodeDisposal.addDisposeCallback(
          element, () => delete refs[ref]
        );
      });
    },
    after: ['component'],
  };

  ko.bindingHandlers.refFn = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
      const {callback, ref} = ko.unwrap(valueAccessor());
      // apply bindings, so that we can schedule a task after.  Components are
      // loaded asynchronously and we need to run this code in a task that is
      // scheduled after all tasks that set the references (in the ref binding).
      ko.applyBindingsToDescendants(bindingContext, element);
      ko.tasks.schedule(() => {
        // this task will be executed after the reference `ref` was set
        callback(ko.bindingHandlers.ref.refs[ref]);
      });
      return {controlsDescendantBindings: true};
    },
    after: ['ref'],
  };

  return ko.bindingHandlers.ref.refs;
});
