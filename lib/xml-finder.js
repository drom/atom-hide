'use strict';

const fs = require('fs-extra');
const path = require('path');
const onml = require('onml');

// const getDummy = path => ({type: 'module', name: path});

const extract = ml => {
  const stack = [{}];
  onml.traverse(ml, {
    enter: (n) => {
      if (n.name === 'cell') {
        const branch = {
          type: 'module',
          name: n.attr.name,
          mname: n.attr.submodname
        };
        stack.push(branch);
      }
    },
    leave: (n) => {
      if (n.name === 'cell') {
        const top = stack.pop();
        const head = stack[stack.length - 1];
        head.scopes = head.scopes || [];
        head.scopes.push(top);
      }
    }
  });
  return stack;
};

const getXML = (filePath, cb) => {
  fs.readFile(filePath, 'utf8').then((xml => {
    const ml = onml.parse(xml);
    const obj = extract(ml);
    const res = obj[0].scopes[0];
    cb(res);
  }));
};


module.exports = (curPath, cb) => {
  const path0 = path.resolve(curPath, 'top.xml');
  fs.access(path0, fs.constants.F_OK, err => {
    if (err) {
      const path1 = path.resolve(curPath, 'wavedrom', 'top.xml');
      fs.access(path1, fs.constants.F_OK, err => {
        if (err) {
          cb();
        } else {
          getXML(path1, cb);
        }
      });
    } else {
      getXML(path0, cb);
    }
  });
  return;
};
