
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

function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
function getusr(){
xhttp = new XMLHttpRequest();
xhttp.onload = function() {
alert(this.responseText);
}
xhttp.open("POST", "/fn/usr", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
xhttp.send();
}


function signin(){
if(validateEmail(document.getElementById("mail").value) == false)
{
swal("Be concentrate!", "Please Check Your Email.",  "warning");
return false;
}
else if(document.getElementById("pass").value.length == 0)
{
swal("Be concentrate!", "Please Check Your Password.",  "warning");
return false;
}
else{
document.getElementById("loading").style.display="block";
const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
document.getElementById("loading").style.display="none";
if(this.responseText == "error")
{
swal("Oops!", "Invalid Email or password.",  "error");
}
else {
document.getElementById("form").action = "/dash";
document.getElementById("form").method = "POST";
document.cookie = "email="+document.getElementById("mail").value;
document.getElementById("form").submit();
}
}
xhttp.open("POST", "/login", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
xhttp.send("email="+document.getElementById("mail").value+"&&password="+document.getElementById("pass").value);
}
} //end signin


function register(){
if(document.getElementById("type").style.display == "none")
{
document.getElementById("btn-login").style.setProperty("display","none");
document.getElementById("forget").style.setProperty ("display","none");
document.getElementById("type").style.setProperty("display","block");
document.getElementById("info").style.setProperty("display","block");
document.getElementById("confpass").style.setProperty("display","block");
}

else {
let aux = true;
if(validateEmail(document.getElementById("mail").value) == false)
{
swal("Be concentrate!", "Please Check Your Email.",  "warning");
aux = false;
}
else if(document.getElementById("pass").value.length == 0)
{
swal("Be concentrate!", "Please Check Your Password.",  "warning");
aux = false;
}
else if(document.getElementById("pass").value != document.getElementById("confpass").value)
{
swal("Be concentrate!", "The password must be same",  "warning");
aux = false;
}
else if(document.querySelector('input[name="type"]:checked') == null)
{
swal("Be concentrate!", "Please check an account type",  "warning");
aux = false;
}
else if(document.querySelector('input[name="type"]:checked').value != "user")
{
if(document.getElementById("info").value.length == 0)
{
swal("Be concentrate!", "Station name or Car Id incorrect",  "warning");
aux = false;
}
}
if(aux) {
var xxhttp = new XMLHttpRequest();
xxhttp.onload = function() {
if(this.responseText == "error")
{
swal("Oops!","This email used in other account","error");
}
else if (this.responseText == "good"){
document.getElementById("form").action = "/dash";
document.getElementById("form").method = "POST";
document.cookie = "email="+document.getElementById("mail").value;
document.getElementById("form").submit();
}
}
xxhttp.open("POST", "/register", true);
xxhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
info = document.getElementById("info").value || "";
xxhttp.send("email="+document.getElementById("mail").value+"&&password="+document.getElementById("pass").value+"&&type="+document.querySelector('input[name="type"]:checked').value+"&&info="+info);
}
}

} //end register function



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

document.getElementById("type").addEventListener('click',function ()
{
if(document.getElementById("user").checked == true)
document.getElementById("info").style.setProperty("display","none");
else document.getElementById("info").style.setProperty("display","block");
});


document.getElementById("find").addEventListener('click',function ()
{
document.getElementById("pagecontent").innerHTML= "";
found = obj.filter(function(item) { return item.Begining === document.getElementById('StatelistFrom').value && item.Destination === document.getElementById("StatelistTo").value });
s = document.getElementById('pagecontent');
for(i = 0; i < found.length; i++)
{
st = station.filter(function(item){return item.journeyId === found[i]['_id']});
tk = ticket.filter((item) => item.journeyId === found[i]['_id']);
o = document.createElement('div');
o.classList.add("ticket");
o.innerHTML= '<table> <thead> <tr> <td  rowspan="3"><i class="fa-solid fa-van-shuttle fa-2xl"></i></td>  <td  colspan="2">'+ found[i]['Begining'] +' <i class="fa-solid fa-arrow-right-long fa-2xl"></i> '+ found[i]['Destination'] +' </td><td >'+ found[i]['Price']+'</td></tr> <tr> <td> '+st[0]["Begining"]+'</td><td> '+st[0]["Destination"]+'</td><td ><button class="btn btn-primary"  id="btn-buy"><i class="fa-solid fa-cart-shopping fa-xl"></i></button></td> </tr> <tr><td colspan="2">Car ID:<b>'+found[i]['CarId']+'</b></td><td>Number of clients: <b>'+tk.length+' /8</b></tr></thead></table>';
s.appendChild(o);
}
});


document.getElementById("StatelistFrom").setAttribute("onchange","changeoption(data[value])");
document.getElementById("StatelistTo").setAttribute("onchange","change()");
