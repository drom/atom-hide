<p align="center"><img src="logo.svg"/></p>

[![Version!](https://img.shields.io/apm/v/hide.svg?style=flat-square)](https://atom.io/packages/hide)
[![Linux](https://github.com/drom/atom-hide/actions/workflows/linux.yml/badge.svg)](https://github.com/drom/atom-hide/actions/workflows/linux.yml)
[![MacOS](https://github.com/drom/atom-hide/actions/workflows/macos.yml/badge.svg)](https://github.com/drom/atom-hide/actions/workflows/macos.yml)
[![Windows](https://github.com/drom/atom-hide/actions/workflows/windows.yml/badge.svg)](https://github.com/drom/atom-hide/actions/workflows/windows.yml)

Hardware Integrated Development Environment (hide)

### Install

```
apm i hide
```

### Features

* Based on [Atom text editor](https://atom.io)
* Source Editor Panel
  - Verilog / SyetemVeilog
    * [Tree Sitter Verilog](https://github.com/tree-sitter/tree-sitter-verilog)
      - Syntax highlighting
      - Code folding
      - Linter using [svlint](https://github.com/drom/svlint)
      - Diagnostics (errors, warnings)
  - FIRRTL
    * [Tree Sitter FIRRTL](https://github.com/chipsalliance/tree-sitter-firrtl)
      - Syntax highlighting
      - Diagnostics (errors, warnings)
  - SystemRDL
    * [Tree Sitter SystemRDL](https://github.com/SystemRDL/tree-sitter-systemrdl)
      - Syntax highlighting
      - Diagnostics (errors, warnings)

### TODO

* Source Editor Panel
  - Verilog / SyetemVeilog
    * Better Code folding
    * Auto-complete
    * Go to definition
    * Find references
    * Format source code
    * Type information on hover
    * Find references
    * [Verilog mode](https://www.veripool.org/wiki/verilog-mode)
  - VHDL
* Waveform Panel
  - [Wavedrom Zoom](https://github.com/wavedrom/zoom)
* Logic Schematic Panel
  - RTL viewer
* Outline view
