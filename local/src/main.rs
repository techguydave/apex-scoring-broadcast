use std::io::{self, Write};

use tokio::sync::broadcast;

mod file_reader;
mod ws_handler;
use gethostname::gethostname;

#[macro_use]
extern crate json;

const WS_ENDPOINT: &str = "ws://localhost:3000/live/write";
#[tokio::main]
async fn main() {
    println!("Overstat.gg Live Data Client");

    print!("Username: ");
    io::stdout().flush().unwrap();
    let mut username = String::new();
    io::stdin().read_line(&mut username).unwrap();

    print!("API Key: ");
    io::stdout().flush().unwrap();
    let mut key = String::new();
    io::stdin().read_line(&mut key).unwrap();

    let hostname = gethostname().into_string().unwrap();

    let (tx, rx) = broadcast::channel(32);

    tokio::spawn(async { file_reader::start_file_watch(tx) });

    ws_handler::WsConnection::connect(
        WS_ENDPOINT,
        tx,
        rx,
        username.trim().to_owned(),
        key.trim().to_owned(),
        hostname.trim().to_owned(),
    );
}
