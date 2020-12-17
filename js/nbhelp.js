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


if (GetURLParameterWithDefault('level','user') != 'expert') {
  $('.expertMode').hide();
} else {
  $('.noExpertMode').hide();
}