use std::fs;
use tokio::sync::mpsc::Sender;
const LIVE_DATA_DIR: &str =
    "C:\\Users\\drew\\Documents\\programming\\projects\\apex\\broadcast\\local\\mock";

pub async fn start_file_watch(tx: Sender<&str>) {
    println!("new Something");
}
