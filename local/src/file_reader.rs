use crate::ws_handler::WsMessage;
use tokio::sync::mpsc;

use notify::EventKind::{Create, Modify};
use notify::RecursiveMode;
use notify::Watcher;
use std::fs;
use std::path::Path;
use std::path::PathBuf;
use tokio::sync::mpsc::{Receiver, Sender};
const LIVE_DATA_DIR: &str =
    "C:\\Users\\drew\\Documents\\programming\\projects\\apex\\broadcast\\server\\mock\\live";

struct LiveFile {
    cursor: usize,
    file: PathBuf,
}

impl LiveFile {
    fn new(path: PathBuf) -> Self {
        LiveFile {
            file: path,
            cursor: 0,
        }
    }

    fn is_same(&self, other: PathBuf) -> bool {
        self.file.to_str().unwrap() == other.to_str().unwrap()
    }

    async fn read_file_contents(&mut self, tx: &Sender<WsMessage>) {
        match fs::read_to_string(&self.file) {
            Ok(contents) => {
                for (i, x) in contents.lines().into_iter().enumerate() {
                    if i >= self.cursor {
                        //println!("Print Line {}: {}", self.cursor, x);
                        tx.send(WsMessage::new("livedata".to_string(), x.into()))
                            .await;
                        self.cursor = i + 1;
                    }
                }
            }
            Err(err) => {
                println!("Error reading file {}", err);
            }
        }
    }
}

pub async fn start_file_watch(tx: Sender<WsMessage>, mut rx: Receiver<WsMessage>) {
    println!("Starting watch");
    let (watch_tx, mut watch_rx) = mpsc::channel(1);

    let mut watcher = notify::recommended_watcher(move |res| {
        futures::executor::block_on(async {
            watch_tx.send(res).await.unwrap();
        })
    })
    .unwrap();

    watcher
        .watch(Path::new(LIVE_DATA_DIR), RecursiveMode::NonRecursive)
        .unwrap();

    let mut live_file = LiveFile::new(PathBuf::new());

    loop {
        tokio::select! {
        event = watch_rx.recv() => {
            match event.unwrap() {
                Ok(event) => {
                    let paths = event.paths;
                    match event.kind {
                        Create(_) | Modify(_) => {
                            if !live_file.is_same(paths[0].clone()) {
                                live_file = LiveFile::new(paths[0].clone());
                            }
                            live_file.read_file_contents(&tx).await;
                        }
                        _ => {}
                    }
                }
                Err(e) => {
                    println!("Error with event {}", e)
                }
            }
        }
        msg = rx.recv() => {
            match msg.unwrap_or_else(|| WsMessage::noop()).msg_type.as_str() {
                "request_full" => {
                    live_file.cursor = 0;
                }
            _ => {}
            }
        }


        }
    }
}
