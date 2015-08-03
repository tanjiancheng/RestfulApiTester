var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');

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

