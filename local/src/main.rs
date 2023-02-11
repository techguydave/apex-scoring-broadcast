use std::{path::Path, time::Duration};

use tokio::{
    sync::mpsc::{self, Sender},
    time::sleep,
};

mod file_reader;
mod ws_handler;

const WS_ENDPOINT: &str = "ws://localhost:9001/";
#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel(32);

    tokio::spawn(ws_handler::connect(WS_ENDPOINT, rx));
    tokio::spawn(async { file_reader::start_file_watch(tx) });

    loop {
        sleep(Duration::from_secs(10)).await;
    }
    println!("hi")
}
