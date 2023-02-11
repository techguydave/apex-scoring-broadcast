use notify::DebouncedEvent::{Create, NoticeWrite, Write};
use notify::{watcher, RecursiveMode, Watcher};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::mpsc::channel;
use std::time::Duration;
use tokio::sync::mpsc::Sender;
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

    fn read_live_file(&mut self, path: &PathBuf, tx: &Sender<&str>) {
        println!("CUROSOR {}", self.cursor);
        match fs::read_to_string(path) {
            Ok(contents) => {
                if self.cursor == 0 {
                    println!("New File {}", path.to_str().unwrap());
                }
                let iter = contents.lines();
                for (i, x) in iter.into_iter().enumerate() {
                    if i >= self.cursor {
                        println!("Print Line {}: {}", self.cursor, x);
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

pub fn start_file_watch(tx: Sender<&str>) {
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

    let mut liveFile = LiveFile::new(PathBuf::new());

    loop {
        match receiver.recv() {
            Ok(event) => match &event {
                Write(path) | NoticeWrite(path) => {
                    if !liveFile.is_same(path.to_path_buf()) {
                        liveFile = LiveFile::new(path.to_path_buf());
                    }
                    liveFile.read_live_file(path, &tx);
                }
                Create(path) => {
                    println!("Notice create {}", path.to_str().unwrap());
                }
                _ => (),
            },
            Err(e) => println!("watch error: {:?}", e),
        }
    }
}
