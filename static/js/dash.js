
function ObjectId(id)
{
return ""+id;
}

function changeoption(tab) {
document.getElementById("StatelistTo").removeAttribute("disabled");
for(x in tab)
{
s = document.getElementById('StatelistTo');
o = document.createElement('option');
o.value = tab[x];
o.innerHTML = tab[x];
s.appendChild(o);
}
}

function strToObj(str){
return eval('('+str+')');
}

function change(){
document.getElementById("find").removeAttribute("disabled");
}

function buy(id){
xhttp = new XMLHttpRequest();
xhttp.onload = function() {
swal("Good job!","Your ticket id is:\n"+this.responseText,"success");
}
t = ticket.filter((item) => (""+item.date).indexOf((new Date()).toLocaleDateString()) != -1);
xhttp.open("POST", "/buy", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
xhttp.send("dt="+(new Date()).toLocaleString()+"&&id="+id+"&&pl="+(t.length + 1));
}

function search(){
document.getElementById("pagecontent").innerHTML= "";
found = obj.filter(function(item) {
return item.Begining === document.getElementById('StatelistFrom').value && item.Destination === document.getElementById("StatelistTo").value;
});

s = document.getElementById('pagecontent');
for(i = 0; i < found.length; i++)
{
st = station.filter(function(item){return item.journeyId === found[i]['_id']});
tk = ticket.filter((item) => item.journeyId === found[i]['_id']);
o = document.createElement('div');
o.classList.add("ticket");
o.innerHTML= '<table> <thead> <tr> <td  rowspan="3"><i class="fa-solid fa-van-shuttle fa-2xl"></i></td>  <td  colspan="2">'+ found[i]['Begining'] +' <i class="fa-solid fa-arrow-right-long fa-2xl"></i> '+ found[i]['Destination'] +' </td><td >'+ found[i]['Price']+'</td></tr> <tr> <td> '+st[0]["Begining"]+'</td><td> '+st[0]["Destination"]+'</td><td ><button class="btn btn-primary" onclick="buy(this.id)" id='+found[i]["_id"]+'><i class="fa-solid fa-cart-shopping fa-xl"></i></button></td> </tr> <tr><td colspan="2">Car ID:<b>'+found[i]['CarId']+'</b></td><td>Number of clients:'+tk.length+' /8</tr></thead></table>';
s.appendChild(o);
}

} //end function search

function checkticket()
{
elem = document.getElementById("wrp");
elem.innerHTML = "";
newelem = document.createElement('div');
newelem.innerHTML = "<h1 align='center'>Check Ticket</h1><br><input id='ticketId' class='form-control' style='width:45%;margin:auto;' type='text' placeholder='Put your Ticket ID'/><br><div class='text-center'><button id='check' class='btn btn-primary' onclick='check()'>Check</button></div><br><div id='pagecontent'></div>";
elem.appendChild(newelem);
}


function dashboard(){
location.reload();
}

function check(){
t = ticket.filter((item) => item._id === document.getElementById("ticketId").value);
jid = t[0]['journeyId'];
places = ticket.filter((item) => item.journeyId === jid).length;
carId = obj.filter((item) =>  item._id === jid);
carId = carId[0]['CarId'];
if(document.getElementById("ticketId").value.length == 0)
{
swal("Be concentrate!", "Please Check Your Ticket ID.",  "warning");
}
else if(t.length == 0){
swal("Oops!", "This Id does not exist",  "error");
}
else{
info = obj.filter((item) => item._id === t[0]['journeyId']);
document.getElementById("pagecontent").innerHTML = "<table id='customers'> <tr> <th>Attributes</th><th>Data</th></tr><tr><td>Tiket Id:</td> <td>"+t[0]['_id']+"</td></tr><tr> <td>Date:</td><td>"+t[0]['date']+"</td></tr><tr><td>Trajectory:</td> <td>"+info[0]['Begining']+" ---> "+info[0]['Destination']+" </td></tr><tr><td>Number of booked seats:</td><td><b>"+places+"/8</b></td></tr><tr><td>Car Id:</td><td>"+carId+"</tr></table>";
}
}

function rate(){
elem = document.getElementById("wrp");
elem.innerHTML = "";
newelem = document.createElement('div');
newelem.innerHTML = "<h1 align='center'>Rate:</h1><br><input id='carId' class='form-control' style='width:45%;margin:auto' placeholder='Put the ID of car'/><br><div class='text-center'> <input  type=radio name=rate id=good value=good> <label  for=good style=color:blue;font-size:20px;font-family:Wingdings>J</label> <input  type=radio name=rate id=average value=average> <label  for=average style=color:blue;font-size:20px;font-family:Wingdings>K</label> <input  type=radio name=rate id=bad value=bad> <label  for=bad style=color:blue;font-size:20px;font-family:Wingdings>L</label><br><button class='btn btn-primary' onclick='sendrate()'>Rate</button></div><br><div id='pagecontent'></div>";
elem.appendChild(newelem);
}

function sendrate(){
if (document.getElementById("carId").value.length == 0){
swal("Be concentrate!","Insert The Card Id",  "warning");
}
else if(document.querySelector('input[name="rate"]:checked') == null)
{
swal("Be concentrate!", "Please check your rate", "warning");
}
else
{
xhttp = new XMLHttpRequest();
xhttp.onload = function() {
if(this.responseText == "good")
swal("Good job!","Your have rated successfuly","success");
}
xhttp.open("POST", "/rate", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8")
xhttp.send("rate="+document.querySelector('input[name="rate"]:checked').value);
}
}

function settings()
{
elem = document.getElementById("wrp");
elem.innerHTML = "";
newelem = document.createElement('div');
newelem.innerHTML ='<h1 align="center">Settings</h1><br><h5> Change Your password: </h5><input id="cupass" class="form-control" style="width:45%;margin:auto;" type="password" placeholder="Put your current password"><br><input id="newpass" class="form-control" style="width:45%;margin:auto;" type="password" placeholder="Put your new password"><br><input id="newpass2" class="form-control" style="width:45%;margin:auto;" type="password" placeholder="Reput your new password"><br><div class="text-center"><button id="check" class="btn btn-primary" onclick="Save()">Save</button></div>';
elem.appendChild(newelem);
}

function Save(){
if (document.getElementById("cupass").value.length == 0)
{
swal("Be concentrate!","Put your current pass",  "warning");
}
else if (document.getElementById("newpass").value.length == 0)
{
swal("Be concentrate!","Put your current pass",  "warning");
}
else if (document.getElementById("newpass").value != document.getElementById("newpass2").value)
{
swal("Be concentrate!","The new password must be same",  "warning");
}
else{
xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function() {
if(this.responseText == "good") {
swal("Good job!","Your have rated successfuly","success");
}
else {
swal("Oops","The current password incorrect\n"+this.responseText,"error");
}
}
xmlhttp.open("POST", "/update", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8")
xmlhttp.send("oldpass="+document.getElementById('cupass').value+"&&newpass="+document.getElementById('newpass').value);
}
} // end of save function


function journeyView()
{
elem = document.getElementById("wrp");
elem.innerHTML = "";
newelem = document.createElement('div');
newelem.innerHTML = '<h1 align="center">Dashboard</h1><br><h5>Add Journey: </h5><br><input type="text" class="form-control" placeholder="Put the Begining" id="begin" style="width:45%;margin:auto;" onkeydown="if(event.keyCode==13){addjourney();}"><br><input type="text" class="form-control" placeholder="Put the Destination" id="dest" style="width:45%;margin:auto;" onkeydown="if(event.keyCode==13){addjourney();}"><br><input type="text" class="form-control" placeholder="Put the price" id="price" style="width:45%;margin:auto;" onkeydown="if(event.keyCode==13){addjourney();}"><br><input type="text" class="form-control" placeholder="Put the CarId" id="carId" style="width:45%;margin:auto;" onkeydown="if(event.keyCode==13){addjourney();}"><br><input type="text" class="form-control" placeholder="Put the Name of station" id="stat" style="width:45%;margin:auto;" onkeydown="if(event.keyCode==13){addjourney();}"><br><input type="text" class="form-control" placeholder="Put the Name of station destination" id="dest-stat" style="width:45%;margin:auto;" onkeydown="if(event.keyCode==13){addjourney();}"><br><div class="text-center"><button id="add" class="btn btn-primary" onclick="addjourney()">Add</button></div>';
elem.appendChild(newelem);
}

function  addjourney(){
if (document.getElementById("begin").value == ""){
swal("Be concentrate!", "Please the begining place", "warning");
}
else if (document.getElementById("dest").value == ""){
swal("Be concentrate!", "Please the destination place", "warning");
}
else if (document.getElementById("price").value == ""){
swal("Be concentrate!", "Please the price", "warning");
}
else if (document.getElementById("carId").value == ""){
swal("Be concentrate!", "Please the begining place", "warning");
}
else if (document.getElementById("stat").value == ""){
swal("Be concentrate!", "Please the station name", "warning");
}
else if (document.getElementById("dest-stat").value == ""){
swal("Be concentrate!", "Please the station name (destination)", "warning");
}
else{
xreqhttp = new XMLHttpRequest();
xreqhttp.onload = function(){
if (this.responseText == "good") {
swal("Good job!", "You have add a journey successfully", "success");
}
}
xreqhttp.open("POST", "/add", true);
xreqhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
xreqhttp.send("dt="+new Date().toLocaleDateString()+"&&begin="+document.getElementById("begin").value+"&&dest="+document.getElementById("dest").value+"&&price="+document.getElementById("price").value+"&&carId="+document.getElementById("carId").value+"&&stat="+document.getElementById("stat").value+"&&dest-stat="+document.getElementById("dest-stat").value);

}
}

reqhttp = new XMLHttpRequest();
reqhttp.onload = function(){
if (this.responseText != "user") {
const list = document.getElementById("menu");
list.removeChild(list.children[1]);
list.removeChild(list.children[1]);
list.removeChild(list.children[1]);
journeyView();
}
}
reqhttp.open("POST", "/type", true);
reqhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
reqhttp.send();


xhttp = new XMLHttpRequest();
xhttp.onload = function() {
obj = this.responseText.substring(this.responseText.indexOf(":")+1,this.responseText.indexOf("station")-3);
obj = strToObj(obj);
station = this.responseText.substring(this.responseText.indexOf("station") + 9, this.responseText.indexOf("ticket") - 3);
station = strToObj(station);
ticket = this.responseText.substring(this.responseText.indexOf("ticket") + 9, this.responseText.length - 1);
ticket = strToObj(ticket);
data = {};
for(i=0;i<obj.length;i++) {
if(data[obj[i]['Begining']])
{
if(data[obj[i]['Begining']].indexOf(obj[i]['Destination']) == -1)
{
data[obj[i]['Begining']].push(obj[i]['Destination']);
}}
else
{
data[obj[i]['Begining']] = [];
data[obj[i]['Begining']].push(obj[i]['Destination']);
}
}
for (x in data)
{
select = document.getElementById('StatelistFrom');
var opt = document.createElement('option');
opt.value = x;
opt.innerHTML = x;
select.appendChild(opt);
}
}

xhttp.open("GET", "/fn/var", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
xhttp.send();



