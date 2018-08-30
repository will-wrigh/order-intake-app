        const infoWindowBtn = document.getElementById('info-window-id')
        infoWindowBtn.addEventListener('click', function (event) {

          let win = new BrowserWindow({ width: 200, height: 600})
          console.log('hey')
            win.loadURL('file://' + __dirname + '/moreInfo.html');
              win.on('close', function () { win = null })
              win.show()
            });

        }