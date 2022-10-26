const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow, onlineStatusWindow
let isNowStandbyView = false

const ENDPOINT_PRD = `http://localhost:3000`

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // kiosk: true,  // Make menu bar invisible and non accessible
    fullscreen: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      devTools: true,
    },
  })

  mainWindow.on('closed', () => {
    app.quit()
  })

  onlineStatusWindow = new BrowserWindow({
    width: 0,
    height: 0,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  // eslint-disable-next-line node/no-path-concat
  onlineStatusWindow.loadURL(`file://${__dirname}/online-status.html`)

  ipcMain.on('online-status-changed', (_event, status) => {
    console.log(`status changed: ${status}`)
    if (status === 'online' && isNowStandbyView) {
      // A page is not shown by refresh even if Wi-Fi connection became successful.
      // So, close app so that this app would be re-launched by pm2
      mainWindow.close()
    }
  })

  loadApp()
}

const getEndpoint = () => {
  return ENDPOINT_PRD
}

const loadApp = () => {
  isNowStandbyView = false
  mainWindow.loadURL(`${getEndpoint()}`).catch((error) => {
    console.log(error)
    loadStandbyView()
  })
}

const loadStandbyView = () => {
  isNowStandbyView = true
  mainWindow.loadURL('file://' + __dirname + '/standby.html')
}

// To avoid error that WebGL is disabled on Mac Pro (Intel HD 3000).
// https://github.com/electron/electron/issues/8217#issuecomment-267545890
app.commandLine.appendSwitch('ignore-gpu-blacklist')

app.on('ready', createWindow)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
