var newP, newT, divSel, newBtDel, newBtT
var Malt = function(name, dbFG, lovi, flavor, dp, character, ppg){
  this.name = name || 'Not Specified';
  this.dbFG = dbFG;
  this.ppg = this.ppgCalc();
}
Malt.prototype.ppgCalc = function(){
  this.ppg = Math.round10((1 + (this.dbFG / 100) * 0.04621), -3);
  if(isNaN(this.ppg) == true){
    this.ppg = 0
  }
  return this.ppg
}

function dbfgCalc() {
  var malt = new Malt($('#NewMaltIn').val(), $('#DBFG').val());
  if(malt.ppg <= 0){
    alert("Please supply a number greater than 0 for Dry basis, fine grind.");
  }
  else{
    clearTextInput();
    createElement(malt);
  }
}
function clearTextInput(){
  $('#DBFG').val('');
  $('#NewMaltIn').val('');
}

function createElement(malt) {
  divSel = document.getElementById('data')
  newP = document.createElement('li');
  newT = document.createTextNode(malt.name + ": " + malt.ppg + " PPG");
  newBtDel = document.createElement('button');
  newBtDel.setAttribute("onclick", "deleteElement(this.parentNode.id)");
  newBtDel.innerHTML = "Delete";
  newP.appendChild(newT);
  newP.appendChild(newBtDel);
  newP.setAttribute("id", malt.name);
  divSel.appendChild(newP);
}
function deleteElement(name) {
  divSel = document.getElementById(name);
  divSel.parentNode.removeChild(divSel);
}
function clearAll(){
  $('li').remove();
}
var main = function() {
  $('#ppgdata').addClass('hidden');
  $('ul').sortable({
    appendTo: document.body,
  });
  $("#DBFG").focus();
  $(document).keypress(function(key){
    if(key.which == 13){
      $("#DBFG").focus();
      $('#ppgdata').removeClass('hidden');
      return dbfgCalc();
    }
  })
}
$(main);
