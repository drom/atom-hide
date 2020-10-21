'use strict';

const { CompositeDisposable } = require('atom');
const React = require('react');
const ReactDOM = require('react-dom');

const { reEl } = require('@wavedrom/inspect');
const $ = React.createElement;

const El = reEl(React);

function App (props) {
  return $(El, Object.assign({depth: 0}, props));
}

module.exports = class Inspector {

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('wavedrom', 'inspect');
    // this.element.setAttribute('style', 'overflow: auto;');
    ReactDOM.render(
      $(App, {type: 'module', name: 'undefined'}),
      this.element
    );
    this.subscriptions = new CompositeDisposable();
  }

  update(element) {
    return tree => {
      if (tree) {
        ReactDOM.render(
          $(App, tree),
          element
        );
      }
    };
  }

  getTitle() {
    return 'Hierarchy';
  }

  getElement() {
    return this.element;
  }

  destroy() {
    this.subscriptions.dispose();
    this.element.remove();
  }

  // onDidDestroy(callback)
  // serialize()

  getURI() {
    return 'atom://wavedrom-inspect';
  }

  getLongTitle() {
    return 'hierarchy inspector';
  }

  // onDidChangeTitle

  getIconName() {
    return 'list-unordered';
  }

  // onDidChangeIcon(callback)

  getDefaultLocation() {
    // return atom.config.get('hide-inspector.position').toLowerCase();
    return 'left';
  }

  getAllowedLocations() {
    return ['left', 'right'];
  }

  isPermanentDockItem() {
    return true;
    // return !atom.config.get('hide-inspector.closeable');
  }

  // save() {}
  // saveAs(path)
  // getPath()
  // isModified()
  // onDidChangeModified()
  // copy()
  // getPreferredWidth()
  // onDidTerminatePendingState(callback)
  // shouldPromptToSave()

  unfocus() {
    atom.workspace.getCenter().activate();
  }

  hasFocus() {
    return document.activeElement === this.element;
  }

  toggleFocus() {
    if (this.hasFocus()) {
      this.unfocus();
    } else {
      this.show();
      this.element.focus();
    }
  }

  toggle() {
    atom.workspace.toggle(this);
  }

  hide() {
    atom.workspace.hide(this);
  }

  show() {
    atom.workspace.open(this, {
      searchAllPanes: true,
      activatePane: false,
      activateItem: false
    }).then(() => {
      atom.workspace.paneContainerForURI(this.getURI()).show();
    });
  }

};

/* eslint-env browser */
/* global atom */
