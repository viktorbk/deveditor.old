'use strict'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
// const path = require('path')
// const url = require('url')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindows = []
let terminalWindows = []
let projectWindow = null

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const terminalURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/terminal`
  : `file://${__dirname}/index.html/#/terminal`

const projectURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/project`
  : `file://${__dirname}/index.html/#/project`

var menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New File...',
        accelerator: 'CmdOrCtrl+N',
        click () {
          createTerminalWindow()
        }
      },
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+Shift+N',
        click () {
          createWindow()
        }
      },
      {
        label: 'New Project',
        accelerator: 'CmdOrCtrl+Shift+P',
        click () {
          createProjectWindow()
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click () {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Terminal',
    submenu: [
      {
        label: 'New Terminal',
        accelerator: 'CmdOrCtrl+T',
        click () {
          createTerminalWindow()
        }
      }
    ]
  },
  {
    id: 'WIN',
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        click () {
          createTerminalWindow()
        }
      },
      {
        id: 'FRONT',
        label: 'Bring All to Front',
        click () {
          bringAllToFront()
        }
      },
      {
        type: 'separator'
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Documentation',
        click () {
          createTerminalWindow()
        }
      }
    ]
  }
]
function createWindow () {
  let mainWindow = new BrowserWindow({
    height: 1200,
    useContentSize: true,
    width: 2000,
    title: 'DevEditor'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindows.push(mainWindow)
}

function createTerminalWindow () {
  let size = mainWindows[0].getSize()
  let pos = mainWindows[0].getPosition()
  let height = 350
  console.log(pos)

  let terminalWindow = new BrowserWindow({
    width: size[0],
    height: height,
    title: 'Terminal'
  })

  terminalWindow.setPosition(pos[0] + 50, size[1] - height)
  terminalWindow.loadURL(terminalURL)

  terminalWindow.on('closed', () => {
    terminalWindow = null
  })

  terminalWindows.push(terminalWindow)
}

function createProjectWindow () {
  projectWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    title: 'New Project'
  })

  projectWindow.loadURL(projectURL)

  projectWindow.on('closed', () => {
    projectWindow = null
  })
}

ipcMain.on('project:close', (e, path) => {
  mainWindows[0].webContents.send('project:created', path)
  if(projectWindow) {
    projectWindow.close()
  }
})

function bringAllToFront () {
}

app.on('ready', () => {
  createWindow()
  setMenu()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindows.length === 0) {
    createWindow()
  }
})

function setMenu () {
  let template = menuTemplate
  if (process.platform === 'darwin') {
    template.unshift({label: 'asdf'})
  }
  var menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
