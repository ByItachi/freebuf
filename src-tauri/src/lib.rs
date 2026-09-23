use std::io::{BufRead, BufReader, Write};
use std::net::TcpStream;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Mutex;
use std::time::Duration;

use tauri::{Manager, RunEvent, Url, WebviewUrl, WebviewWindowBuilder};

/// The bundled local Next.js server process; killed when the app exits.
pub struct ServerChild(pub Mutex<Option<std::process::Child>>);

const SPLASH_HTML: &str = "data:text/html,%3C!doctype%20html%3E%3Chtml%3E%3Cbody%20style%3D%22margin%3A0%3Bheight%3A100vh%3Bdisplay%3Aflex%3Balign-items%3Acenter%3Bjustify-content%3Acenter%3Bfont-family%3Asystem-ui%2Csans-serif%3Bbackground%3A%23fcfbf8%3Bcolor%3A%231c1c1c%22%3E%3Cdiv%20style%3D%22text-align%3Acenter%22%3E%3Cdiv%20style%3D%22font-size%3A24px%3Bfont-weight%3A600%22%3EManus%3C%2Fdiv%3E%3Cdiv%20style%3D%22margin-top%3A10px%3Bfont-size%3A13px%3Bcolor%3A%235f5f5d%22%3EStarting%20local%20server...%3C%2Fdiv%3E%3C%2Fdiv%3E%3C%2Fbody%3E%3C%2Fhtml%3E";

pub fn run() {
    let app = tauri::Builder::default()
        .manage(ServerChild(Mutex::new(None)))
        .setup(|app| {
            let handle = app.handle().clone();
            if let Err(e) = WebviewWindowBuilder::new(
                &handle,
                "splash",
                WebviewUrl::External(Url::parse(SPLASH_HTML).expect("valid splash url")),
            )
            .title("Manus")
            .inner_size(380.0, 200.0)
            .resizable(false)
            .decorations(false)
            .center()
            .build()
            {                    eprintln!("[manus] splash window: {e}");
            }
            std::thread::spawn(move || {
                if let Err(e) = boot(&handle) {
                    eprintln!("[manus] {e}");
                    let _ = show_error(&handle, &e);
                }
            });
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("failed to build the tauri application");

    app.run(|app, event| {
        if let RunEvent::Exit = event {
            if let Some(mut child) = app.state::<ServerChild>().0.lock().unwrap().take() {
                let _ = child.kill();
            }
        }
    });
}

/// Boots the bundled local server, waits for it, then opens the main window.
fn boot(app: &tauri::AppHandle) -> Result<(), String> {
    let port = pick_port();
    let entry = find_server_entry(app)?;
    let node = find_node_runtime(app)?;
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("app data dir: {e}"))?;
    std::fs::create_dir_all(&data_dir).map_err(|e| format!("create data dir: {e}"))?;
    let log_path = data_dir.join("server.log");

    let mut cmd = Command::new(node);
    cmd.arg("server.js")
        .current_dir(entry.parent().expect("server entry has a parent"))
        .env("PORT", port.to_string())
        .env("HOSTNAME", "127.0.0.1")
        .env("NODE_ENV", "production")
        // Single-user desktop app: fixed local admin password for /admin.
        .env("ADMIN_PASSWORD", "manus-local")
        .env("FREEBUFF_DATA_DIR", &data_dir);
    if let Some(standalone) = find_standalone_dir(app) {
        cmd.env("FREEBUFF_STANDALONE", standalone);
    }
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x0800_0000); // CREATE_NO_WINDOW
    }

    let mut child = cmd.spawn().map_err(|e| format!("spawn local server: {e}"))?;
    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    *app.state::<ServerChild>().0.lock().unwrap() = Some(child);

    let log = std::fs::File::create(&log_path).ok();
    let log_err = log.as_ref().and_then(|f| f.try_clone().ok());
    pump(stdout, log, "server");
    pump(stderr, log_err, "server");

    if !wait_ready(port) {
        return Err(format!(
            "local server did not become ready within 20s — see {}",
            log_path.display()
        ));
    }

    let url: Url = format!("http://127.0.0.1:{port}/")
        .parse()
        .expect("local url");
    WebviewWindowBuilder::new(app, "main", WebviewUrl::External(url))
        .title("Manus")
        .inner_size(1366.0, 860.0)
        .min_inner_size(960.0, 620.0)
        .build()
        .map_err(|e| format!("main window: {e}"))?;

    if let Some(splash) = app.get_webview_window("splash") {
        let _ = splash.close();
    }
    Ok(())
}

fn show_error(app: &tauri::AppHandle, msg: &str) -> tauri::Result<()> {
    let encoded: String = msg.bytes().map(|b| format!("%{b:02X}")).collect();
    let html = format!(
        "data:text/html,%3Chtml%3E%3Cbody%20style%3D%22font-family%3Asystem-ui%2Csans-serif%3Bpadding%3A28px%3Bbackground%3A%23fcfbf8%3Bcolor%3A%231c1c1c%22%3E%3Ch2%20style%3D%22font-weight%3A600%22%3EManus%20failed%20to%20start%3C%2Fh2%3E%3Cpre%20style%3D%22white-space%3Apre-wrap%3Bfont-size%3A13px%22%3E{}%3C%2Fpre%3E%3C%2Fbody%3E%3C%2Fhtml%3E",
        encoded
    );
    WebviewWindowBuilder::new(
        app,
        "error",
        WebviewUrl::External(Url::parse(&html).expect("valid error url")),
    )
    .title("Manus")
    .inner_size(580.0, 340.0)
    .build()?;
    if let Some(splash) = app.get_webview_window("splash") {
        let _ = splash.close();
    }
    Ok(())
}

fn pump(
    stream: Option<impl std::io::Read + Send + 'static>,
    mut log: Option<std::fs::File>,
    prefix: &'static str,
) {
    let Some(stream) = stream else { return };
    std::thread::spawn(move || {
        for line in BufReader::new(stream).lines().map_while(Result::ok) {
            eprintln!("[{prefix}] {line}");
            if let Some(f) = log.as_mut() {
                let _ = writeln!(f, "{line}");
            }
        }
    });
}

/// First free port in a dedicated range so we never clash with dev servers.
fn pick_port() -> u16 {
    (36412..=36442)
        .find(|p| std::net::TcpListener::bind(("127.0.0.1", *p)).is_ok())
        .unwrap_or(36412)
}

fn wait_ready(port: u16) -> bool {
    for _ in 0..200 {
        if TcpStream::connect(("127.0.0.1", port)).is_ok() {
            return true;
        }
        std::thread::sleep(Duration::from_millis(100));
    }
    false
}

fn find_server_entry(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(dir) = app.path().resource_dir() {
        // `../server/server.js` is bundled under a `_up_` prefix on Windows/macOS.
        candidates.push(dir.join("_up_").join("server").join("server.js"));
        candidates.push(dir.join("server").join("server.js"));
    }
    if let Ok(cwd) = std::env::current_dir() {
        // Dev layout: cwd is src-tauri, server lives at the repo root.
        candidates.push(cwd.join("server").join("server.js"));
        candidates.push(cwd.join("..").join("server").join("server.js"));
    }
    candidates
        .into_iter()
        .find(|c| c.is_file())
        .ok_or_else(|| "bundled server/server.js not found".to_string())
}

fn find_standalone_dir(app: &tauri::AppHandle) -> Option<PathBuf> {
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(dir) = app.path().resource_dir() {
        candidates.push(dir.join("bin").join("standalone"));
    }
    if let Ok(cwd) = std::env::current_dir() {
        candidates.push(cwd.join("bin").join("standalone"));
        candidates.push(cwd.join("..").join("bin").join("standalone"));
    }
    candidates.into_iter().find(|c| c.join("server.js").is_file())
}

fn find_node_runtime(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let name = if cfg!(windows) { "node.exe" } else { "node" };
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(dir) = app.path().resource_dir() {
        candidates.push(dir.join("bin").join("node").join(name));
    }
    if let Ok(cwd) = std::env::current_dir() {
        candidates.push(cwd.join("bin").join("node").join(name));
        candidates.push(cwd.join("..").join("bin").join("node").join(name));
    }
    candidates.into_iter().find(|c| c.is_file()).ok_or_else(|| {
        "bundled Node runtime not found — run `npm run desktop:prepare` first".to_string()
    })
}
