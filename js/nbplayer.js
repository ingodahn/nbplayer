
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Initializing player according to cookie
function initializePlayer () {
  var mv=getCookie('sageLang');
  if (mv == "") mv = 'sage';
  $('#sageLang').find("option[value='"+mv+"']").prop('selected',true);
  mv=getCookie('sageCellsType');
  if (mv == "") mv = 'linked';
  $('#sageCellsType').find("option[value='"+mv+"']").prop('selected',true);
  mv=getCookie('playerPanes');
  if (mv == "") mv = 'ExecRead';
  $('#playerPanes').find("option[value='"+mv+"']").prop('selected',true);
}

initializePlayer();

function makePlayer () {
  /* Removing a-tags with empty content generated by nbviewer */
 $('a').each(function() {
  if ($(this).text().match(/^\s*$/)) {
    $(this).remove();
  }
});
  $('#controls').remove();
  $('#footer').remove();
  makeMenu();
  addSagecells(".nb-code-cell",".nb-input");
  makeTransferData();
  makeSageCells(playerConfig);
  if (playerConfig.collapsable) chapterize();
  if (playerConfig.execute) setExecute();
}





if (GetURLParameterWithDefault('level','user') != 'expert') {
  $('.expertMode').hide();
} else {
  $('.noExpertMode').hide();
}

$("#sageLang").change(function() {
  playerConfig.lang=$("#sageLang").val();
  document.cookie="sageLang="+playerConfig.lang;
});
$("#sageCellsType").change(function() {
  var cellType=$('#sageCellsType option').filter(':selected').val();
  switch (cellType) {
    case 'auto': {
      playerConfig.linked=false;
      playerConfig.eval=true;
      break;
    }
    case 'single': {
      playerConfig.linked=false;
      playerConfig.eval=false;
      break;
    }
    default: {
      playerConfig.linked=true;
      playerConfig.eval=false;
    }
  }
  document.cookie="sageCellsType="+cellType;
});
$("#collapsable").change(function() {
  playerConfig.collapsable=($("#collapsable").is(':checked'))?true:false;
});
$("#playerPanes").change(function() {
  var panes=$("#playerPanes option").filter(':selected').val();
  playerConfig.panes=panes;
  playerConfig.execute=(panes=="ReadExec")?false:true;
  playerConfig.showRead=(panes == "Exec")?false:true;
  document.cookie="playerPanes="+panes;
})
/* addSageCells(
 * rootNode: Selector for node to which cell will be appended - codeCell
 * inNode: Selector for node from which script is taken - cellInput
 )
*/
function addSagecells(rootNode,inNode) {
  var cell = `
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
      getInterface(node,curId2);
      heading.append('<img src="./resources/collapse.gif" onclick= "toggleChapter(\''+curId2+'\')">');
    } else if (node.find('h3').length) {
      let heading=node.find('h3').first();
      curCnt3++;
      curId3=curId2+"_"+curCnt3;
      node.attr('mtheading',curId3);
      node.attr('mtchapter',curId2);
      getInterface(node,curId3);
      heading.append('<img src="./resources/collapse.gif" onclick= "toggleSection(\''+curId3+'\')">');
    } else {
      node.attr('mtchapter',curId2);
      node.attr('mtsection',curId3);
    }
  });
  checkInterfaceConsistency();
}

function getInterface(node,chapterId) {
  if (node.find('.mathtrek').length) {
    let mt=node.find('.mathtrek').first();
    mtin[chapterId]=mt.attr('mtin').split(',').map(x => x.trim());
    mtout[chapterId]=mt.attr('mtout').split(',').map(x => x.trim());
  }
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
