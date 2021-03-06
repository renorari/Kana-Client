/*
    Kana Client
    Version 0.0.1
    KanaのElectronクライアントアプリ
*/

const { app, BrowserWindow, Menu, shell, screen } = require("electron");
const path = require("path");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: screen.getPrimaryDisplay().size.width / 1.2,
        minWidth: 300,
        height: screen.getPrimaryDisplay().size.height / 1.2,
        minHeight: 200,
        title: "Kana",
        backgroundColor: "#000000",
        autoHideMenuBar: true,
        icon: "iconfiles/icon.png",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
    });

    const openExternalLinksInOSBrowser = (event, url) => {
        if (url.match(/.*localhost.*/gi) === null && (url.startsWith('http:') || url.startsWith('https:'))) {
            event.preventDefault();
            shell.openExternal(url);
        }
    };
    mainWindow.webContents.on('new-window', openExternalLinksInOSBrowser);
    mainWindow.webContents.on('will-navigate', openExternalLinksInOSBrowser);
    mainWindow.setMenu(Menu.buildFromTemplate([]));
    mainWindow.loadURL("https://kana.renorari.net/app/");

    //mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
