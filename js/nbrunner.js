/* Functions used by player and runnr */
function getBrowserLanguage() {
  var userLang = navigator.language || navigator.userLanguage;
  var lang = userLang.substring(0,2);
  return lang;
}

function makeMenu() {
  var lang=getBrowserLanguage();
  $('head').first().append('<link rel="stylesheet" href="custom.css"');
  $('body').first().append('<script src="custom.js"></script>');
  // Add header lines
  var read=(lang == 'de')?'Lesen':'Read';
  var execute=(lang =='de')?'Ausführen':'Execute';
  var switchMode = (lang == 'de')?'Code ausblenden/einblenden':'Show / Hide Code';
  var seq = (lang == 'de')?'Code-Zellen in der gegebenen Reihenfolge ausführen!':'Execute Cells in the Sequence Given!';
  var saver=(lang == 'de')?'Speichern':'Save';
  var goSaveData=(lang == 'de')?'Daten speichern':'Save Data';
  var readButton='<a href="#" role="button" id="read-button" class="btn btn-primary" onclick="setView()">'+read+'</a>';
  var executeButton='<a href="#" role="button" id="execute-button" class="btn btn-primary" onclick="setExecute()">'+execute+'</a>';
  var paneButtons=(playerConfig.panes == 'Exec')?"":readButton+executeButton;
  var playerMenu='<div id="navbar">'+paneButtons+
  `<a href="#" role="button" class="btn btn-primary" onclick="toggleInput()">`+switchMode+`</a>
  <a href="#" role="button" class="btn btn-primary" onclick="saveHtml()">`+saver+`</a>
  <a id="evalWarning" href="#" role="button" class="btn btn-warning" style="display: none;">`+seq+`</a>
  <img src="`+playerConfig.playerPath+`/resources/logo.png" width="45px"
    style="float:right;"></img>
  </div>`;
  $('body').prepend(playerMenu);
  $('#main').addClass('belowMenu');
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

function saveHtml() {
  saveAddSageCells(".nb-code-cell",".sagecell_input,.sagecell_output");
  $('script').html().replace(/\u200B/g,'');
  var blob = new Blob(['<!DOCTYPE html>\n<html>\n<head>'+
  $('head').html()+
  '</head>\n<body>\n<div id="main">'+
  $('#main').html()+
  `</div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://sagecell.sagemath.org/embedded_sagecell.js"></script>
  <script src="`+playerConfig.playerPath+`/vendor/js/FileSaver.min.js"></script>
  <script src="`+playerConfig.playerPath+`/nbplayerConfig.js"></script>
  <script src="`+playerConfig.playerPath+`/js/nbrunner.min.js"></script>
  <script>
    playerConfig=`+JSON.stringify(playerConfig)+`;
    playerMode=`+JSON.stringify(playerMode)+`;
    makeMenu();
    localize();
    loadStatus();
    makeSageCells(playerConfig);
    launchPlayer();
  </script>
  </body></html>`], {type: "text/plain;charset=utf-8"});
  saveAs(blob, playerConfig.name+".html");
  let saveWarnMsg='Do NOT use this page anymore - open your saved copy or reload this page.';
  var lang=getBrowserLanguage();
  if (lang == 'de') saveWarnMsg='Bitte die Seite neu laden oder die gespeicherte Kopie öffnen.';
  $('#navbar').html('<div class="save-warning">'+saveWarnMsg+'</div>');
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

function saveAddSageCells(rootNode,delNode) {
  let cell = `
  <div class='compute'>
    <script type='text/x-sage'>1+1</script>
  </div>`;
  $(rootNode).each(function () {
    $(this).append(cell);
    let scScript=getSageInput($(this));
    scScript=scScript.replace(/\u200B/g,'')
    $(this).find('.compute script').text(scScript);
    if (delNode) $(this).find(delNode).remove();
    $(this).find('.compute').hide();
  });
}

//Configuring Player
let playerConfig={
  panes: "ExecRead",
  lang: "sage",
  linked: true,
  eval: false,
  hide: ["fullScreen"],
  execute: true,
  showRead: true,
  collapsable: false,
  playerPath: playerPath
}

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

// Views
//Switching input on/off
let playerMode={
  showSage: false, //true if execute mode on startup
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

function makeTransferData () {
  $('.nbdataIn,.nbdataOut').parents('.nb-cell').each(function () {
    let node=$(this);
    node.before('<div class="transferData"></div>');
    let rootNode=node.prev();
    let codeCell=node.next();
    node.appendTo(rootNode);
    codeCell.appendTo(rootNode);
    let msg="";
    if (rootNode.find('.nbdataOut').length) {
      rootNode.attr('id','transferDataOut');
      let lang=getBrowserLanguage();
      rootNode.append('<br/><p><input type="button" role="button" class="btn btn-primary status2Clipboard" onclick="status2ClipBoard()" value="Copy status to clipboard" /></p>');
      rootNode.append('<p><input type="button" role="button" class="btn btn-primary status2Storage" onclick="status2Storage()" value="Save status" /></p>');
      let nSucc=rootNode.find('.successor').length;
      if (nSucc) {
        rootNode.find('ul').children('a').remove();

        rootNode.append('<p id="contMsg">Continue reading:</p>');
        rootNode.append('<ul></ul>');

        let ulNode=rootNode.children().last();
        rootNode.find('.successor').each(function() {
          let url=$(this).find('a').first().attr('href');
          url=url.replace('ipynb','html');
          $(this).find('a').attr('href',url);
          $(this).appendTo(ulNode);
          $(this).append(' <input type="button" role="button" class="btn btn-primary openWithStatus" onclick="openWithStatus(\''+url+'?status=true\')" value="Open with current status" />');
        })
      }
    } else {
      rootNode.attr('id','transferDataIn');
    }
  })
}

// Usage: copyToClipboard(string)
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

function getStatus() {
  return $('#transferDataOut .sagecell_stdout').first().text();;
}

function openWithStatus(url) {
  let status=getStatus();
  if (status.length) {
    localStorage.setItem('mtStatus',status);
    window.open(url,'_blank');
  } else {
    let lang=getBrowserLanguage(), msg="";
    msg=(lang == 'de')?"Fehler: Die Statusberechnung wurde noch nicht ausgeführt":"Error: Status cell not yet executed";
    alert(msg);
  }
}

function status2ClipBoard () {
  let status=getStatus();
  let lang=getBrowserLanguage(), msg="";
  if ( ! status.length) {
    msg=(lang == 'de')?"Fehler: Die Statusberechnung wurde noch nicht ausgeführt":"Error: Status cell not yet executed";
    alert(msg);
  } else {
    msg=(lang=='de')?"Status in die Zwischenablage kopiert":"Status copied to clipboard";
    copyToClipboard(status);
    alert(msg);
  }
}

function status2Storage () {
  let statusId=GetURLParameterWithDefault('status',false);
  //For backwards compatibility:
  if ((!statusId) || (statusId.toString() == 'true')) statusId='mtStatus';
  if (statusId.toString() == "true") statusId='mtStatus';
  let status=getStatus();
  let lang=getBrowserLanguage(), msg="";
  if ( ! status.length) {
    msg=(lang == 'de')?"Fehler: Die Statusberechnung wurde noch nicht ausgeführt":"Error: Status cell not yet executed";
    alert(msg);
  } else {
    localStorage.setItem(statusId,status);
    msg=(lang=='de')?"Status gespeichert":"Status saved";
    alert(msg);
  }
}

// Reading status parameter and entering it into .nbDataIn
function GetURLParameterWithDefault(sParam, dValue) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam)
      {
          return decodeURIComponent(sParameterName[1]);
      }
  };
  return dValue;
};

function loadStatus () {
  let statusId=GetURLParameterWithDefault('status',false);
  if(statusId) {
    //For backwards compatibility:
  if (statusId.toString() == 'true') statusId='mtStatus';
    let status=localStorage.getItem(statusId);
    if (status) {
      $('.transferData').each(function () {
        let transferNode=$(this);
        if (transferNode.find('.nbdataIn').length) {
          transferNode.find('.nb-code-cell script').html(status+'\nprint("Status restored")');
        }
      });
    }
  }
}

// localisation of nb-specific UI elements on startup
function localize () {
  let translations = {
    ".status2Clipboard" : {
      'type' : 'value',
      'de' : "Status  in die Zwischenablage kopieren",
      'en' : "Copy status to clipboard"
    },
    ".loadStatus" : {
      'type': 'value',
      'de' : "Status laden",
      'en' : "Load status"
    },
    ".status2Storage" : {
      'type' : 'value',
      'de' : "Status speichern",
      'en' : "Save status"
    },
    "#contMsg" : {
      'type' : 'html',
      'de' : 'Weiterlesen:',
      'en' : 'Continue reading:'
    },
    '.openWithStatus' : {
      'type' : 'value',
      'de' : "Mit aktuellem Status öffnen",
      'en': "Open with current status"
    }
  };
  let lang=getBrowserLanguage();
  let trans=Object.keys(translations);
  for (let i=0;i<trans.length;i++) {
    let sel=trans[i];
    if (translations[sel][lang]) {
      if (translations[sel]['type'] == 'html') {
        $(sel).html(translations[sel][lang]);
      } else {
        $(sel).attr(translations[sel]['type'],translations[sel][lang]);
      }
    }
  }
}
