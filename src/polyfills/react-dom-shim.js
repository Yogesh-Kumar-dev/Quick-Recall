// react-dom compatibility shim for React 19 (ESM form).
//
// React 19 removed `findDOMNode`, but `react-transition-group@4` (a transitive dep of several
// @leafygreen-ui components, including the always-mounted LeafygreenProvider) still calls
// `ReactDOM.findDOMNode(this)` whenever a <Transition> is used without `nodeRef` — crashing with
// "findDOMNode is not a function".
//
// next.config.ts aliases the exact specifier `react-dom$` to THIS module. We re-export the entire
// real react-dom surface (`export *`, so nothing Next/React needs is dropped) and overlay a working
// `findDOMNode` on the DEFAULT export — which is what `import ReactDOM from 'react-dom'` binds to and
// what react-transition-group reads `.findDOMNode` from. The real module is imported via its concrete
// path so the `react-dom$` alias doesn't loop back to this shim.

import * as RealReactDOM from 'react-dom-original';

// Keep every named export intact (createPortal, flushSync, createRoot, version, the react-internal
// preinit/preload helpers, etc.) without hand-maintaining the list.
export * from 'react-dom-original';

function findHostNode(fiber) {
  let node = fiber;
  while (node) {
    const sn = node.stateNode;
    if (sn && (sn.nodeType === 1 || sn.nodeType === 3)) return sn; // Element or Text
    const child = findHostNode(node.child);
    if (child) return child;
    node = node.sibling;
  }
  return null;
}

function findDOMNodeImpl(instance) {
  if (instance == null) return null;
  if (instance.nodeType === 1 || instance.nodeType === 3) return instance; // already a DOM node
  const fiberKey = Object.keys(instance).find((k) => k.startsWith('__reactFiber$'));
  const fiber = instance._reactInternals || instance._reactInternalFiber || (fiberKey ? instance[fiberKey] : null);
  return fiber ? findHostNode(fiber) : null;
}

// The real react-dom is CJS; under webpack interop its surface is on `.default` (or the namespace).
const real = RealReactDOM.default && typeof RealReactDOM.default === 'object' ? RealReactDOM.default : RealReactDOM;

// Named export — covers `import { findDOMNode } from 'react-dom'` and webpack readers that resolve a
// default import to the namespace binding.
export const findDOMNode = typeof real.findDOMNode === 'function' ? real.findDOMNode : findDOMNodeImpl;

// Default export = the real react-dom object with findDOMNode guaranteed present. RTG does
// `import ReactDOM from 'react-dom'` then `ReactDOM.findDOMNode(this)`, so it reads this object.
export default new Proxy(real, {
  get(target, prop, receiver) {
    if (prop === 'findDOMNode') {
      return typeof target.findDOMNode === 'function' ? target.findDOMNode : findDOMNodeImpl;
    }
    return Reflect.get(target, prop, receiver);
  }
});
