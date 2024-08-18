const { app, BrowserWindow, session, ipcMain, dialog, shell } = require("electron");
const contextMenu = require("electron-context-menu");
const DiscordRPC = require("discord-rpc");
const Store = require("electron-store");
const promptInjection = require("./promptinjection");
const titlebar = require("./titlebar");
const path = require("path");

const store = new Store();
contextMenu({
  showSelectAll: false,
  showSearchWithGoogle: false,
  showInspectElement: false,

  append: (defaultActions, params, browserWindow) => [
    {
      label: "Force Reload",
      click: () => {
        browserWindow.webContents.reloadIgnoringCache();
      },
    },
    {
      label: "Clear IndexedDB",
      click: () => {
        dialog
          .showMessageBox({
            type: "question",
            buttons: ["Yes", "No"],
            title: "Clear IndexedDB",
            message:
              "Are you sure you want to clear IndexedDB? This should only be used if something is broken as it will delete your local save file.\nThis will also clear the cache and Local Storage.",
          })
          .then((result) => {
            if (result.response == 0) {
              dialog
                .showMessageBox({
                  type: "warning",
                  buttons: ["Yes", "No"],
                  title: "Clear IndexedDB",
                  message:
                    "ATTENTION: THIS WILL DELETE YOUR LOCAL SAVE FILE.\nAre you sure you want to continue?",
                })
                .then((result) => {
                  if (result.response == 0) {
                    session.defaultSession
                      .clearStorageData({
                        storages: ["indexdb", "cache", "localstorage"],
                      })
                      .then(() => {
                        browserWindow.webContents.reloadIgnoringCache();
                      });
                  }
                });
            }
          });
      },
    },
    {
      label: "Open Developer Tools",
      click: () => {
        browserWindow.webContents.openDevTools();
      },
    },
    {
      label: "Zoom In",
      click: () => {
        browserWindow.webContents.send("zoomin");
      },
    },
    {
      label: "Zoom Out",
      click: () => {
        browserWindow.webContents.send("zoomout");
      },
    },
  ],
});

var client = new DiscordRPC.Client({ transport: "ipc" });
client.login({ clientId: "1028080411772977212" }).catch(console.error);

const mappedIcons = [
  "amillusion",
  "answeredprayers",
  "braingirl",
  "deepdreams",
  "flow",
  "someday",
  "unevendream",
  "yno-logo",
  "yume2kki",
  "yumenikki",
  "mumarope",
  "genie",
  "mikan",
  "2kki",
  "yume",
  "prayers",
  "muma",
  "dreamgenie",
  "mikanmuzou",
  "ultraviolet",
  "sheawaits",
  "oversomnia",
  "yumetsushin",
  "nostalgic",
  "collectiveunconscious",
];

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1052,
    height: 768 + 30, // 30px for titlebar
    title: "Yume Nikki Online Project",
    icon: "logo.png",
    resizable: true,
    frame: true,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      backgroundThrottling: false
    },
  });
  var loopInterval = null;
  win.setMenu(null);
  win.setTitle("Yume Nikki Online Project");

  win.on("closed", () => {
    saveSession();
    client.clearActivity();
    clearInterval(loopInterval);
    client.destroy();
    win.destroy();
  });

  win.webContents.on("did-finish-load", () => {
    promptInjection(win); // Custom prompt hack
    win.webContents
      .executeJavaScript(`if (document.title != "Yume Nikki Online Project") {
      document.getElementById('content').style.overflow = 'hidden'
      document.querySelector('#content')?.scrollTo(0,0)}`); // Disable scroll ingame
  });

  win.webContents.on('devtools-opened', () => {
    win.webContents.send('log-app-version', app.getVersion());
  });

  // open wiki links in a web browser for better readability, but open maps in a new electron window
  // https://pradyothkukkapalli.com/tech/open-external-urls-electron/
  win.webContents.setWindowOpenHandler((details) => {
    var url = details.url;
    if (url.startsWith("https://yume.wiki") && !url.endsWith(".png")) {
      shell.openExternal(details.url); // Open URL in user's browser.
      return { action: "deny" }; // Prevent the app from opening the URL.
    }
    return { action: "allow" };
  });

  win.webContents.on("did-start-loading", () => {
    titlebar(win); // Custom titlebar hack
  });

  win.loadURL("https://ynoproject.net/").then(() => {
    loopInterval = setInterval(() => {
      clientLoop(win);
      // win.webContents.openDevTools();
    }, 1000);
  });
};

var isMax = false;

app.whenReady().then(() => {
  // Load login session from disk
  if (store.has("ynoproject_sessionId")) {
    session.defaultSession.cookies.set({
      url: "https://ynoproject.net",
      name: "ynoproject_sessionId",
      value: store.get("ynoproject_sessionId"),
      sameSite: "strict",
    });
  }
  ipcMain.on("minimize", () => {
    BrowserWindow.getFocusedWindow().minimize();
  });
  ipcMain.on("maximize", () => {
    if (isMax) {
      BrowserWindow.getFocusedWindow().unmaximize();
    } else {
      BrowserWindow.getFocusedWindow().maximize();
    }
    isMax = !isMax;
  });
  createWindow();
});

function clientLoop(win) {
  const web = win.webContents;
  web.executeJavaScript(`document.title`).then((title) => {
    let splitTitle = title.split(" Online ");
    if (splitTitle[1]?.trim() == "- YNOproject") {
      if (splitTitle[0].trim() == "ゆめ2っき") {
        updatePresence(web, "Yume 2kki");
      } else {
        updatePresence(web, splitTitle[0].trim());
      }
    } else {
      updatePresence(web);
    }
  });
}

function isConnected(text) {
  let privatemodes = [
    "وضع الخاص",
    "Private Mode",
    "Private Mode",
    "Private Mode",
    "Mode privé",
    "Private Mode",
    "プライベートモード",
    "비공 개 모드",
    "Tryb prywatny",
    "Modo Privado",
    "Private Mode",
    "Приватный режим",
    "Private Mode",
    "Riêng tư",
    "私密模式",
  ];
  let connecteds = [
    "متصل",
    "Verbunden",
    "Connected",
    "Conectado",
    "Connecté(e)",
    "Connesso",
    "接続済み",
    "연결됨",
    "Połączony",
    "Conectado",
    "Conectat",
    "В сети",
    "Bağlı",
    "Đã kết nối",
    "已连接",
  ];

  if (privatemodes.includes(text) || connecteds.includes(text)) {
    return true;
  }
  return false;
}

function retryConnection(err) {
  console.log("Retry IPC");
  console.log(err);
  client = new DiscordRPC.Client({ transport: "ipc" });
  client.login({ clientId: "1028080411772977212" }).catch(console.error);
}

function updatePresence(web, gamename = null) {
  web.executeJavaScript("window.onbeforeunload=null;");
  console.log("Update Presence");
  console.log(gamename);

  if (gamename == null) {
    client
      .setActivity({
        largeImageKey: "yno-logo",
        largeImageText: "Yume Nikki Online Project",
        details: "Choosing a game...",
        instance: false,
        buttons: [{ label: "Play YNOproject", url: `https://ynoproject.net/` }],
      })
      .catch(retryConnection);
  } else {
    web
      .executeJavaScript(
        `
        (function() {
          var querys = document.querySelector("#locationText").querySelectorAll("span") // This seems to be the new location format for C.U.
          if (querys == null || querys.length < 1) {
            querys = document.querySelector("#locationText").querySelectorAll("a") // and this is the old format for other games
          }

          if (querys == null || querys.length < 1)
          {
            currentLocation = "Unknown";
          }
          else
          {
            for (i = 0; i < querys.length; i++)
            {
              isPowerOfTwo = (i % 2) == 0;
              currentLocation = (!isPowerOfTwo ? "(" : "") + querys.item(i).textContent + (!isPowerOfTwo ? ")" + (i + 1 == querys.length ? "" : " |") : "") + " ";
            }
          }

          return {
            name: window.location.pathname.replaceAll('/', ''),
            currentLocation,
            connected: document.querySelector("#connStatusText")?.textContent,
            url: document.URL
          }
        })()
      `
      )
      .then((data) => {
        const condensedName = gamename
          .toLowerCase()
          .replace(" ", "")
          .replace(".", "");
        let buttonGame = gamename;

        // There is a length limit for activity buttons of 32 chars
        // so we need to shorten the game name
        if (gamename == "Collective Unconscious") {
          buttonGame = "C.U.";
        } else if (gamename.length > 32) {
          buttonGame = gamename.slice(0, 28) + "...";
        }

        let activityButtons = [
          { label: "Play " + buttonGame + " online", url: data.url },
        ];
        client
          .setActivity({
            largeImageKey: mappedIcons.includes(condensedName)
              ? condensedName + "-icon"
              : `https://ynoproject.net/images/door_${data.name}.gif`,
            largeImageText: gamename,
            smallImageKey: "yno-logo",
            smallImageText: "Yume Nikki Online Project",
            details: "Dreaming on " + gamename,
            state: isConnected(data.connected)
              ? data.currentLocation
              : "Disconnected",
            instance: false,
            buttons: activityButtons,
          })
          .catch(retryConnection);
      });
  }
}

function saveSession() {
  session.defaultSession.cookies
    .get({ url: "https://ynoproject.net" })
    .then((cookies) => {
      const sess = cookies.find(
        (cookie) => cookie.name == "ynoproject_sessionId"
      );
      if (sess) store.set("ynoproject_sessionId", sess.value);
    });
}
