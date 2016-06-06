/*!
 * Copyright (c) 2016 Rubble LTD. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (factory) {
  if (typeof require === "function" && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object") {
    // CommonJS module
    module.exports = factory(require("knockout"));
  } else if (typeof define === "function" && define.amd) {
    // AMD anonymous module
    define(["knockout"], factory);
  } else {
    // No module loader (plain <script> tag) - put directly in global namespace
    factory(window.ko);
  }
})(function (ko) {
  "use strict";

  function getComponentForNode(element, allBindings, bindingContext) {
    // knockout does not give access to the component from the element on
    // which component binding is defined, one has to use a child element.
    if ("component" in allBindings()) {
      var node = element.children[0];
      return node ? ko.contextFor(node).$component : bindingContext.$component;
    } else return bindingContext.$component;
  };

  ko.bindingHandlers.ref = {
    refs: {},
    update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      // Use update, so this code will update the reference also when
      // a component binding is changing, this avoids keeping a reference to
      // a component that otherwise could be garbage collected.
      if (!("component" in allBindings())) {
        if (console.warn) console.warn("ref binding should be used together with a component binding, " + "otherwise you might leak memory if the component binding can change dynamically.");
      }
      var refs = ko.bindingHandlers.ref.refs,
          ref = ko.unwrap(valueAccessor());
      ko.tasks.schedule(function () {
        // this task runs after a task that loads the component
        var component = getComponentForNode(element, allBindings, bindingContext);
        // keep track of components inside observables, this allows the user to
        // subscribe if a component is changing.
        refs[ref] = refs.hasOwnProperty(ref) ? refs[ref](component) : ko.observable(component);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
          return delete refs[ref];
        });
      });
    },
    after: ['component']
  };

  ko.bindingHandlers.refFn = {
    init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var _ko$unwrap = ko.unwrap(valueAccessor());

      var callback = _ko$unwrap.callback;
      var ref = _ko$unwrap.ref;
      // apply bindings, so that we can schedule a task after.  Components are
      // loaded asynchronously and we need to run this code in a task that is
      // scheduled after all tasks that set the references (in the ref binding).

      ko.applyBindingsToDescendants(bindingContext, element);
      ko.tasks.schedule(function () {
        // this task will be executed after the reference `ref` was set
        callback(ko.bindingHandlers.ref.refs[ref]);
      });
      return { controlsDescendantBindings: true };
    },
    after: ['ref']
  };

  return ko.bindingHandlers.ref.refs;
});