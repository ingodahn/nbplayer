# READ ME

Notebook-Player is a tool to convert Jupyter notebooks into dynamic HTML pages using SageCell.

## Installation

*** Local: *** Clone this repo and launch index.html

*** On Server: *** Checkout branch release, replace installation path in index.html, js/nbrunner.js, nbplayer.js - minify those files.

## Usage

Open index.html in the project folder. Make the required player settings for the web page to be generated and load the Jupyter notebook file.

Create the intended view and save the file.

To support Expanding/Collapsing of sections, call the page with parameter level=expert.

***Note:*** Select Expanding/Collapsing of Sections only if your notebook has aside of all h3 nodes metadata of the following form

`<span class="mathtrek" mtin=",-separated list of operators and variables that must be defined before code cells are executed" mtout=",-separated list of operators and variables that will be defined after code cells are executed">`

A stylesheet `custom.css` in the same directory as the output html file can be used to style the output.

## Input and Output Cells

Input and output cell make it possible to transfer data from one notebook player to another.

### Output Cells

Output cells have a markdown cell, giving some explanations, and a code cell printing the commands to instantiate key variables with their current values. Note that only literal values, no objects or plots, can be saved.

Output markdown cells must have a node of the form `<span class="nbdataOut"></span>` This node may contain a node `<ul></ul>` with child nodes `<li class="successor"><a>...</a></li>` where the `<a></a>` node links to a notebook with an input cell using these variables.

### Input Cells

Input cells have a markdown cell, giving some explanations, and a code cell executing the commands to instantiate key variables with specific values.

Input markdown cells must contain a node `<span class="nbdataIn"></span>`.

### Known Issues

After saving the resulting html view, the page in the player is no longer functional. In order to generate an alternative view, the page must be reloaded.

### License: CC-BY-SA