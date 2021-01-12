'use strict';

module.exports = bush => {
  const usage = {};
  bush.map(op => {
    const [name, body] = op;
    if (usage[name] !== undefined) {
      console.warn('redefinition of ' + name);
    } else {
      usage[name] = {body, count: 0};
    }

    for (let i = 1; i < body.length; i++) {
      const arg = body[i];
      const usable = usage[arg];
      if (usable === undefined) {
        console.warn('used but undefined: ' + arg);
      } else {
        usable.count++;
      }
    }

  });

  const bush2 = bush.reduce((res, op) => {
    const [name, body] = op;
    for (let i = 1; i < body.length; i++) {
      const arg = body[i];
      const usable = usage[arg];
      if (usable && usable.count === 1) {
        body[i] = [arg, usable.body];
      }
    }
    if (usage[name].count !== 1) { res.push(op); }
    return res;
  }, []);

  return bush2;
};
