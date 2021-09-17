//https://www.bing.com/HPImageArchive.aspx?format=js&n=1&mkt=ja-JP
//Bing 今日の画像
fetch("https://www.bing.com/HPImageArchive.aspx?format=js&n=1&mkt=ja-JP").then(res => res.json()).then(data => {
    var url = data.images[0].url;
    if (data.images[0].url.startsWith("/")) url = "https://bing.com" + data.images[0].url;
    document.body.style.backgroundImage = `url("${url}")`;
    document.getElementById("background_copyright").innerHTML = data.images[0].copyright.replace(/, /, "<br>");
    document.getElementById("background_copyright").setAttribute("href", data.images[0].copyrightlink);
});
