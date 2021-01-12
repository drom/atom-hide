'use strict';

const { CompositeDisposable } = require('atom');
const tree2html = require('./tree2html.js');

const render = (element, editor) => {
  const tree = editor.languageMode.tree;
  element.innerHTML = tree2html(tree.rootNode);
};

const uriForEditor = editor =>
  `hide-schematic://editor/${editor.id}`;

const removeSchematicPreview = editor => {
  const uri = uriForEditor(editor);
  const previewPane = atom.workspace.paneForURI(uri);
  if (previewPane != null) {
    previewPane.destroyItem(previewPane.itemForURI(uri));
    return true;
  } else {
    return false;
  }
};

const addSchematicPreview = editor => {
  const uri = uriForEditor(editor);
  const previousActivePane = atom.workspace.getActivePane();
  atom.workspace
    .open(uri, {
      searchAllPanes: true,
      split: 'right'
    })
    .then(function () {
      previousActivePane.activate();
    });
};

exports.toggle = () => {
  // const activeItem = atom.workspace.getActivePaneItem();
  const editor = atom.workspace.getActiveTextEditor();
  if (editor == null) { return; }
  if (editor.getGrammar().scopeName !== 'source.mlir') { return; }

  if (!removeSchematicPreview(editor)) {
    console.log('ADDING!!!!!!!!!!!!!!!!!!');
    return addSchematicPreview(editor);
  } else {
    console.log('REMOVED!!!!!!!!!!!!!!');
  }
};

exports.Schematic = class Schematic {

  constructor ({ editorId }) {
    this.editorId = editorId;

    for (const editor of atom.workspace.getTextEditors()) {
      if (editor.id === editorId) {
        this.editor = editor;
        break;
      }
    }
    this.element = document.createElement('div');
    this.element.classList.add('wavedrom', 'schematic');
    this.subscriptions = new CompositeDisposable();
    const update = this.update(this.element, this.editor);
    this.subscriptions.add(
      this.editor.buffer.onDidStopChanging((/* event */) => update())
    );
    update();
  }

  update (element, editor) {
    return () => {
      render(element, editor);
    };
  }

  getTitle() {
    if (this.editor != null) {
      const title = this.editor.getTitle();
      console.log(title);
      return `${title} Schematic`;
    } else {
      return 'NaN Schematic';
    }
  }

  getElement() {
    return this.element;
  }

  destroy() {
    this.subscriptions.dispose();
    this.element.remove();
    this.editor == null;
  }

  // onDidDestroy(callback)
  // serialize()

  getURI() {
    return uriForEditor(this.editor);
  }

  getLongTitle() {
    return 'schematic inspector';
  }

  // onDidChangeTitle

  getIconName() {
    return 'markdown';
  }

  // onDidChangeIcon(callback)

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

  toggleFocus () {
    if (this.hasFocus()) {
      this.unfocus();
    } else {
      this.show();
      this.element.focus();
    }
  }

  hide() {
    atom.workspace.hide(this);
  }

  show () {
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
