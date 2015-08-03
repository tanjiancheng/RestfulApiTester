var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');
var dialog = require('dialog');

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width:960,
        height:640,
        fullscreen:false,
        resizable:false
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Open Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: function() {
                        mainWindow.openDevTools({
                            detach: true
                        });
                    }
                },
                {
                    label: 'Load Config File',
                    accelerator: 'Command+O',
                    click: function() {
                        dialog.showOpenDialog(mainWindow, {
                            filters: [
                                {name: 'Json', extensions: ['json']}
                            ]
                        }, function(filename) {
                            if (typeof filename != 'object' || filename.length == 0) {
                                return;
                            }

                            if (typeof mainWindow.webContents != 'object') {
                                return;
                            }

                            var script = 'setConfigFile('+JSON.stringify(filename[0])+')';
                            mainWindow.webContents.executeJavaScript(script);
                        });
                    }
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function() {
                        mainWindow.close();
                    }
                }
            ]
        }
    ]));

    mainWindow.loadUrl('file://' + __dirname + '/index.html');
});

