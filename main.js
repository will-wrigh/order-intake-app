const electron = require('electron')

const app = electron.app

const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1100, 
    height: 800,
    webPreferences: {
      // devTools: true
    }
})
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })

   globalShortcut.register('f5', function() {
    console.log('f5 is pressed')
    mainWindow.reload()
  })
  // globalShortcut.register('CommandOrControl+R', function() {
  //   console.log('CommandOrControl+R is pressed')
  //   mainWindow.reload()
  // })
  
}

app.on('ready', createWindow)

app.on('window-all-closed', function () { //more osx
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () { //for osx
  if (mainWindow === null) {
    createWindow()
  }
})
