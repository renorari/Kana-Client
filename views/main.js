//Bing 今日の画像
fetch("https://www.bing.com/HPImageArchive.aspx?format=js&n=1&mkt=ja-JP").then(res => res.json()).then(data => {
    var url = data.images[0].url;
    if (data.images[0].url.startsWith("/")) url = "https://bing.com" + data.images[0].url;
    document.body.style.backgroundImage = `url("${url}")`;
    document.getElementById("background_copyright").innerHTML = data.images[0].copyright.replace(/, /, "<br>");
    document.getElementById("background_copyright").setAttribute("href", data.images[0].copyrightlink);
}).catch(error => {
    console.error(error);
    document.getElementById("background_copyright").remove();
    document.body.style.backgroundImage = `url("./background.svg")`;
});



//ヘルプアイテムの押されたときのやつ
$(".help_item")[0].onclick = () => {
    $("input")[0].value = "こんにちは";
    send();
};
$(".help_item")[1].onclick = () => {
    $("input")[0].value = "5分のタイマーをセットして";
    send();
};
$(".help_item")[2].onclick = () => {
    $("input")[0].value = document.getElementById("wikipedia_random").innerHTML + "について調べて";
    send();
};
$(".help_item")[3].onclick = () => {
    $("input")[0].value = "2^6を計算して";
    send();
};

var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//必要なやつ（）
var url = "https://kana.renorari.net/api/api.json";
var userid = "";
var password = "";
var customize_url = "none";
//送信のやつ
var before = "";
function send() {
    if ($("#input")[0].value == "") return;
    if ($("#input")[0].value == before) return;
    before = $("#input")[0].value;
    fetch(url, { "method": "POST", "body": `message=${encodeURI($("#input")[0].value)}&id=${encodeURI(userid)}&password=${encodeURI(password)}&customize_url=${encodeURI(customize_url)}` }).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return res.text();
        };
    }).then((data) => {
        if (typeof data == "object") {
            $("#welcome")[0].style.display = "none";
            $("#reply")[0].innerHTML = data.reply.replace(/\n/g, "<br>");
            //$("#input")[0].value = "";
        } else {
            console.error(data);
            $("#welcome")[0].style.display = "none";
            $("#reply")[0].innerHTML = data.replace(/\n/g, "<br>");
        };
    }).catch(error => {
        console.error(error);
        $("#welcome")[0].style.display = "none";
        $("#reply")[0].innerHTML = `エラーが発生しました。<br>エラー: ${error}`.replace(/\n/g, "<br>");
    });
};
$("#input")[0].onkeydown = send;
//ログイン
$("#main").fadeOut(0);
$("#login_btn")[0].onclick = () => login($("#login_id")[0].value, $("#login_password")[0].value);
function login(t_id, t_password) {
    fetch(url, { "method": "POST", "body": `message=${encodeURI("login_test")}&id=${encodeURI(t_id)}&password=${encodeURI(t_password)}&customize_url=${encodeURI(customize_url)}` }).then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            return res.text();
        };
    }).then(async (data) => {
        if (typeof data == "object") {
            $("#login_status")[0].innerHTML = data.extension.login.name + "としてログインしました。";
            userid = t_id;
            password = t_password;
            localStorage.setItem("login_info", JSON.stringify({ "userid": userid, "password": password }));
            $("#login_ui").fadeOut(1000);
            await wait(1000);
            $("#main").fadeIn(500);
        } else {
            console.error(data);
            $("#login_status")[0].innerHTML = data.replace(/\n/g, "<br>");
        };
    }).catch(error => {
        console.error(error);
        $("#login_status")[0].innerHTML = "ログインに失敗しました。<br>エラー: " + error.replace(/\n/g, "<br>");
    });
};
$("#logout_btn")[0].onclick = () => logout();
async function logout() {
    userid = "";
    password = "";
    $("#main").fadeOut(1000);
    await wait(1000);
    $("#login_ui").fadeIn(500);
    $("#login_status")[0].innerHTML = "Kanaを利用するには、ログインが必要です。";
};

if (localStorage.getItem("login_info")) {
    $("#login_id")[0].value = JSON.parse(localStorage.getItem("login_info")).userid;
    $("#login_password")[0].value = JSON.parse(localStorage.getItem("login_info")).password;
};