# Knockout refs

Knockout, by default, does not give a way to access child components from their
parents.  This is sometimes desireble.  This simple knockout plugin solves this
problem in a similar way that
[React](https://facebook.github.io/react/docs/more-about-refs.html) does.


## Usage

On your child component element define a ref:

```
<div data-bind="click: callback">
  <child data-bind="ref: 'child'></child>
</div>
```

Then the instance governing the `<child>` element you can find in
`ko.bindingHandlers.ref.refs` (or if you use browserify
`const refs = require("knockout-refs")`);

In this example it will be `ko.unwrap(ko.bindingHandlers.ref.refs.child)`.  
References are packed inside an observable, and you can subscribe to it, the
instance will change, whenever the component governing the child will change
( this might be useful, when you use some kind of routing that change the
component of the top most element).

**Note** that references are created after parent is instantiated, so you
cannot access them when parent component's custructor is called (as in React,
where you cannot access refs in `render` method).

There is also `refFn` binding which accepts as its arguments an object `{ref:
string: callback: function}`.  The callback is called asynchronously, since
first knockout has to instantiate all the children which is after the parent is
instantiated.  Sinve `refFn` controls descendant bindings you cannot use on any
other element that does the same, for example on any other element which has
a component binding (e.g.  a knockout custom element).


## Final remarks

Often by moving 'state' up the component tree you can avoid using this
approach, though sometimes a cleaner approach is to have some public methods on
the child accessible by the parent.
