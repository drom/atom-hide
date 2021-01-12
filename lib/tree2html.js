'use strict';

const logidrom = require('logidrom');
const onml = require('onml');
const grafter = require('./logidrom-grafter.js');

module.exports = root => {
  const assign = [];
  const rec = node => {
    let children = [];
    for (let i = 0; i < node.childCount; i++) {
      children.push(rec(node.child(i)));
    }
    switch (node.type) {

    case 'rtlWireOp':
    case 'rtlExtractOp':
    case 'rtlSZExtOp':
      return node.text;

    case 'valueId':
      console.log(node.child(1).text);
      return node.child(1).text;

    case 'valueIdList':
      return children.filter((_, i) => !(i & 1));

    case 'opResult':
    case 'opResultList':
    case 'customOperation':
    case 'standardFormat':
      return children[0];

    case 'namedArgument':
      assign.push([node.firstChild.child(1).text, ['input', '>']]);
      return;

    case 'rtlConstantOp':
      return [
        node.operationNode.text,
        node.valueNode.firstChild.firstChild.text
      ];

    case 'rtlUTBinRTLOp':
      return [
        node.operationNode.text,
        node.lhsNode.child(1).text,
        node.rhsNode.child(1).text
      ];

    case 'rtlVariadicRTLOp':
    case 'rtlUTVariadicRTLOp':
      return [node.operationNode.text].concat(children[1]);

    case 'rtlICmpOp': return [
      node.predicateNodes[1].text,
      node.lhsNode.child(1).text,
      node.rhsNode.child(1).text
    ];

    case 'rtlUnaryI1ReductionRTLOp': return [
      node.operationNode.text,
      node.inputNode.child(1).text
    ];

    case 'rtlMuxOp':
      return ['mux', children[1], children[3], children[5]];

    case 'rtlFormat':
      return children[2];

    case 'operation':
      children = children.filter(e => e);
      if (children.length > 0) {
        assign.push(children);
      }
      return;
    }
  };
  rec(root);

  const assign1 = grafter(assign);
  let ml;
  try {
    ml = logidrom.renderAssign(0, {assign: assign1});
  } catch (err) {
    return JSON.stringify(assign1, null, 2);
  }
  return onml.stringify(ml);
};

/* eslint complexity: [1, 50] */
