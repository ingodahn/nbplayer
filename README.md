# READ ME

Notebook-Player is a tool to convert Jupyter notebooks into dynamic HTML pages using SageCell.

## Installation

Copy the following into the repository folder.
* FileSaver.min.js and nbpreview.js from the respective GitHub repository into vendor/js
* nbpreview.css and notebook.css from the nbpreview repo into the folder vendor/css
* The folder js and css from the nbpreview repo into nbplayer/vendor

## Usage

Open index.html in the project folder. Make the required player settings for the web page to be generated and load the Jupyter notebook file.

Create the intended view and save the file.

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