extern crate native_windows_derive as nwd;
extern crate native_windows_gui as nwg;

use tokio::sync::mpsc::{self, Sender};

mod file_reader;
mod ui;
mod ws_handler;

const WS_ENDPOINT: &str = "ws://localhost:9001/";
#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel(32);

    ui::init();

    tokio::spawn(file_reader::start_file_watch(tx));
    tokio::spawn(ws_handler::connect(WS_ENDPOINT, rx));
}
