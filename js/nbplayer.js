function getBrowserLanguage() {
  var userLang = navigator.language || navigator.userLanguage;
  var lang = userLang.substring(0,2);
  return lang;
}

function makePlayer () {

  $('#controls').remove();
  $('#footer').remove();
  makeMenu();
  if (! playerConfig.execute) playerConfig.showRead=true;

  addSagecells(".nb-code-cell",".nb-input");
  makeSageCells(playerConfig);

  chapterize();
}

function makeMenu() {
  var lang=getBrowserLanguage();
  // Add header lines
  var read=(lang == 'de')?'Lesen':'Read';
  var execute=(lang =='de')?'Ausführen':'Execute';
  var switchMode = (lang == 'de')?'Code ausblenden/einblenden':'Show / Hide Code';
  var seq = (lang == 'de')?'Code-Zellen in der gegebenen Reihenfolge ausführen!':'Execute Cells in the Sequence Given!';
  var saver=(lang == 'de')?'Speichern':'Save';
  var playerMenu=`<div id="navbar">
  <a href="#" role="button" id="read-button" class="btn btn-primary" onclick="setView()">`+read+`</button>
  <a href="#" role="button" id="execute-button" class="btn btn-primary" onclick="setExecute()">`+execute+`</a>
  <a href="#" role="button" class="btn btn-primary" onclick="toggleInput()">`+switchMode+`</a>
  <a href="#" role="button" class="btn btn-primary" onClick="saveHtml()">`+saver+`</a>
  <a id="evalWarning" href="#" role="button" class="btn btn-warning" style="display: none;">`+seq+`</a>
  <img src="https://netmath.vcrp.de/downloads/Systeme/css/images/netmath-logo.png" width="45px"
    style="float:right;"></img>
  </div>`;
  $('body').prepend(playerMenu);
}

function saveHtml() {
  saveAddSageCells(".nb-code-cell",".sagecell_input,.sagecell_output");
  var blob = new Blob(['<!DOCTYPE html>\n<html>\n<head>'+
  $('head').html()+
  '</head>\n<body>\n<div id="main">'+
  $('#main').html()+
  `</div>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://sagecell.sagemath.org/embedded_sagecell.js"></script>
  <script src="js/FileSaver.min.js"></script>
  <script src="js/nbplayer.js"></script>
  <script>
    playerConfig=`+JSON.stringify(playerConfig)+`;
    playerMode=`+JSON.stringify(playerMode)+`;
    mtin=`+JSON.stringify(mtin)+`;
    mtout=`+JSON.stringify(mtout)+`;
    makeMenu();
    makeSageCells(playerConfig);
    launchPlayer();
  </script>
  </body></html>`], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "Output.html");
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

function getSageInput(rootNode) {
  let scScript='';
  rootNode.find('.CodeMirror-line').each(function () {
    scScript += $(this).text()+'\n';
  })
  return scScript;
}

function saveAddSageCells(rootNode,delNode) {
  let cell = `
  <div class='compute'>
    <script type='text/x-sage'>1+1</script>
  </div>`;
  $(rootNode).each(function () {
    $(this).append(cell);
    // commenting out figure commands to avoid character graphics. Octave cells will show only the last graphics
    //scScript = $(this).find(inNode).text().replace(/figure/g,"% figure");
    let scScript=getSageInput($(this))
    $(this).find('.compute script').text(scScript);
    if (delNode) $(this).find(delNode).remove();
    $(this).find('.compute').hide();
  });
}
/* addSageCells(
 * rootNode: Selector for node to which cell will be appended - codeCell
 * inNode: Selector for node from which script is taken - cellInput
 )
*/
function addSagecells(rootNode,inNode) {
  let cell = `
  <div class='compute'>
    <script type='text/x-sage'>1+1</script>
  </div>`;
  let scScript='';
  $(rootNode).each(function () {
    $(this).append(cell);
    // commenting out figure commands to avoid character graphics. Octave cells will show only the last graphics
    scScript = $(this).find(inNode).text().replace(/figure/g,"% figure");
    $(this).find('.compute script').text(scScript);
    $(this).find('.compute').hide();
  });
}

function makeSageCells(pC) {
  sagecell.makeSagecell({
    inputLocation: "div.compute",
    languages: [pC.lang],
    //languages: sagecell.allLanguages,
    //languages: ["maxima","sage","singular","r"],
    evalButtonText: (getBrowserLanguage() == 'de')?"Ausführen":"Execute",
    linked: pC.linked,
    autoeval: pC.eval,
	  hide: pC.hide
  });
}

// Views
//Switching input on/off
let playerMode={
  showSage: false,
  showNotebookInput: true,
  showSageInput: true
};

function launchPlayer () {
  if (playerMode.showSage) {
    setExecute();
  } else {
    setView();
  }
}

function setView () {
    $(".compute").hide();
    if (playerMode.showNotebookInput) {
      $(cellInput).show();
    }
    $(cellOutput).show();
    playerMode.showSage = false;
    $('#evalWarning').hide();
}

function setExecute () {
    $(cellInput).hide();
    $(cellOutput).hide();
    $(".compute").show();
    playerMode.showSage = true;
    $('#evalWarning').show();
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

// Personalization
// Preparation
var mtin={},mtout={};

function chapterize() {
  let curCnt2=0, curCnt3=0,curId2,curId3;
  $('.nb-worksheet').children().each(function () {
    let node=$(this);
    if (node.find('h2').length) {
      let heading=node.find('h2').first();
      //let headline=heading.html();
      curCnt2++;
      curCnt3=0;
      curId2="chapter_"+curCnt2;
      node.attr('mtheading',curId2);
      heading.append('<img src="resources/collapse.gif" onclick= "toggleChapter(\''+curId2+'\')">');
    } else if (node.find('h3').length) {
      let heading=node.find('h3').first();
      curCnt3++;
      curId3=curId2+"_"+curCnt3;
      node.attr('mtheading',curId3);
      node.attr('mtchapter',curId2);
      if (node.find('.mathtrek').length) {
        let mt=node.find('.mathtrek').first();
        mtin[curId3]=mt.attr('mtin').split(',').map(x => x.trim());
        mt.attr('mtout').split(',').map(x => x.trim()).forEach(function (f) {
          if (f in mtout) {
            mtout[f].push(curId3);
          } else {
            mtout[f]=[curId3]
          }
        })
      }
      heading.append('<img src="resources/collapse.gif" onclick= "toggleSection(\''+curId3+'\')">');
      //heading.html('<a role="button" href="javascript:$(\'.'+curId3+'\').toggle()">'+headline+'</a>');
    } else {
      node.attr('mtchapter',curId2);
      node.attr('mtsection',curId3);
    }
  });
  console.log(mtout);
}

function toggleChapter(chapterId) {
  $('.nb-cell[mtchapter='+chapterId+']').toggle()
}
function toggleSection(chapterId) {
  $('.nb-cell[mtsection='+chapterId+']').toggle()
}

var definedOps=[];

function isDefined(chapterId) {
  let inar=mtin[chapterId];
  for (let i=0;i<inar.length;i++) {
    if (inar[i] != "" & !definedOps.includes(inar[i])) return false;
  }
  return true;
}

function checkExpandable(chapterId) {
  let node=$('.'+chapterId+'_heading img').last().first()
  if (isDefined(chapterId)) {
    node.show();
  } else {
    node.hide();
  }
}

function toggleExpand(chapterId) {
  if ($('.'+chapterId).is(":visible").length) {
    // The chapter is expanded
    let cout=mtout[chapterId]
    $('.'+chapterId).hide();
    definedOps=definedOps.filter(function(op) {
      return (!cout.includes(op));
    })
  } else {
    $('.'+chapterId).show();
    definedOps.concat(mtout[chapterId]);
  };
  let i=0;
  $('.'+chapter_id+'_heading').siblings('.'+chapterId).each(function() {})
}
