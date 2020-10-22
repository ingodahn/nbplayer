function makePlayer () {
  // Add header lines
  var userLang = navigator.language || navigator.userLanguage;
  var lang = userLang.substring(0,2);
  var read=(lang == 'de')?'Lesen':'Read';
  var execute=(lang =='de')?'Ausführen':'Execute';
  var switchMode = (lang == 'de')?'Code ausblenden/einblenden':'Show / Hide Code';
  var seq = (lang == 'de')?'Code-Zellen in der gegebenen Reihenfolge ausführen!':'Execute Cells in the Sequence Given!';
  $('#controls').remove();
  $('#footer').remove();
  $('body').prepend(`<div id="navbar">
  <a href="#" role="button" id="read-button" class="btn btn-primary" onclick="setView()">`+read+`</button>
  <a href="#" role="button" id="execute-button" class="btn btn-primary" onclick="setExecute()">`+execute+`</a>
  <a href="#" role="button" class="btn btn-primary" onclick="toggleInput()">`+switchMode+`</a>
  <a id="evalWarning" href="#" role="button" class="btn btn-warning" style="display: none;">`+seq+`</a>
  <img src="https://netmath.vcrp.de/downloads/Systeme/css/images/netmath-logo.png" width="45px"
    style="float:right;"></img>
</div>`);
  if (! playerConfig.execute) playerConfig.showRead=true;
  addSagecells();
  sagecell.makeSagecell({
    inputLocation: "div.compute",
    languages: [playerConfig.lang],
    //languages: sagecell.allLanguages,
    //languages: ["maxima","sage","singular","r"],
    evalButtonText: (lang == 'de')?"Ausführen":"Execute",
    linked: playerConfig.linked,
    autoeval: playerConfig.eval,
	  hide: playerConfig.hide
  });
}

// Sticky navbar
window.onscroll = function () {
  scrollFunction();
};
// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function scrollFunction() {
  var navbar = document.getElementById("navbar");

  // Get the offset position of the navbar
  var sticky = navbar.offsetTop;
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}

//Configuring Player
let playerConfig={
  lang: "sage",
  linked: true,
  eval: false,
  hide: ["fullScreen"],
  execute: false,
  showRead: true
}

$("#sageLang").change(function() {
  playerConfig.lang=$("#sageLang").val();
});
$("#sageLinked").change(function() {
  playerConfig.linked=($("#sageLinked").is(':checked'))?true:false;
});
$("#sageEval").change(function() {
  playerConfig.eval=($("#sageEval").is(':checked'))?true:false;
});
$("#sageExecute").change(function() {
  playerConfig.execute=($("#sageExecute").is(':checked'))?true:false;
});
$("#sageShowRead").change(function() {
  playerConfig.showRead=($("#sageShowRead").is(':checked'))?true:false;
});

// Transferring input
let cellInput=".nb-input",cellOutput=".nb-output";
let codeCell=".nb-code-cell"

function addSagecells() {
  let cell = `
  <div class='compute'>
    <script type='text/x-sage'>1+1</script>
  </div>`;
  let scScript='';
  $(codeCell).each(function () {
    $(this).append(cell);
    // commenting out figure commands to avoid character graphics. Octave cells will show only the last graphics
    scScript = $(this).find(cellInput).text().replace(/figure/g,"% figure");
    $(this).find('.compute script').text(scScript);
    $(this).find('.compute').hide();
  });
}

// Views
//Switching input on/off
let playerMode={
  showSage: false,
  showNotebookInput: true,
  showSageInput: true
};

function setView () {
  if (playerMode.showSage) {
    $(".compute").hide();
    if (playerMode.showNotebookInput) {
      $(cellInput).show();
    }
    $(cellOutput).show();
    playerMode.showSage = false;
    $('#evalWarning').hide();
  }
}

function setExecute () {
  if (! playerMode.showSage) {
    $(cellInput).hide();
    $(cellOutput).hide();
    $(".compute").show();
    playerMode.showSage = true;
    $('#evalWarning').show();
  }
}

function toggleInput () {
  if (playerMode.showSage) {
    $(".compute .sagecell_input").toggle();
    playerMode.showSageInput = ! playerMode.showSageInput;
  } else {
    $(cellInput).toggle();
    playerMode.showNotebookInput = ! playerMode.showNotebookInput;
  }
}
