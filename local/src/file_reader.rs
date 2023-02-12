use notify::DebouncedEvent::{Create, NoticeWrite, Write};
use notify::{watcher, RecursiveMode, Watcher};
use std::fs;
use std::path::PathBuf;
use std::sync::mpsc::channel;
use std::time::Duration;
use tokio::sync::broadcast::Sender;

use crate::ws_handler::WsMessage;
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

    async fn start_poll(&mut self, path: &PathBuf, tx: &Sender<WsMessage>) {
        match fs::read_to_string(path) {
            Ok(contents) => {
                if self.cursor == 0 {
                    println!("New File {}", path.to_str().unwrap());
                }
                for (i, x) in contents.lines().into_iter().enumerate() {
                    if i >= self.cursor {
                        println!("Print Line {}: {}", self.cursor, x);
                        tx.send(WsMessage::new(String::from("event"), x.to_string().into()))
                            .await
                            .unwrap();
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

pub fn start_file_watch(tx: Sender<WsMessage>) {
    println!("Watching dir");
    // Create a channel to receive the events.
    let (sender, receiver) = channel();

    // Create a watcher object, delivering debounced events.
    // The notification back-end is selected based on the platform.
    let mut watcher = watcher(sender, Duration::from_secs(1)).unwrap();

    // Add a path to be watched. All files and directories at that path and
    // below will be monitored for changes.
    watcher
        .watch(LIVE_DATA_DIR, RecursiveMode::Recursive)
        .unwrap();

    let mut live_file = LiveFile::new(PathBuf::new());

    loop {
        match receiver.recv() {
            Ok(event) => match &event {
                Create(path) | Write(path) | NoticeWrite(path) => {
                    if !live_file.is_same(path.to_path_buf()) {
                        live_file = LiveFile::new(path.to_path_buf());
                    }
                    live_file.start_poll(path, &tx).await;
                }
                _ => (),
            },
            Err(e) => println!("watch error: {:?}", e),
        }
    }
}
