# READ ME

Notebook-Player is a tool to convert Jupyter notebooks into dynamic HTML pages using SageCell.

## Online Instance

There is an [instance of Notebook Player online](https://dahn-research.eu/nbplayer), provided for free conversion of Jupyter notebooks.

## Installation

*** Local: *** Clone this repo and launch index.html

*** On Server: *** Clone this repo on server. Edit nbplayerConfig.js, replacing `'.'` with the URL of your installation

Replace `resources/logo.png` if you want another logo.

## Usage

Open index.html in the project folder. Make the required player settings for the web page to be generated and load the Jupyter notebook file.

Create the intended view and save the file.

A stylesheet `custom.css` and a Javascript file `custom.js` in the same directory as the output html file can be used to modify the output further.

## Input and Output Cells

As linked SageCells must be evaluated one after another, it is recommended to split notebooks with many code cells into a set of smaller notebooks. These pages can be brought together again with the [Notebook Site](https://github.com/ingodahn/nbsite) software.

Input and output cells make it possible to transfer basic data from one notebook player file to another.

See explanation on `index.html` and in the included sample notebbok `Sample.ipynb`.

### Known Issues

After saving the resulting html view, the page in the player is no longer functional. In order to generate an alternative view, the page must be reloaded.

### License: CC-BY-SA