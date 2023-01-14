/*!
    An application that runs in the system tray.
    Requires the following features: `cargo run --example system_tray_d --features "tray-notification message-window menu cursor"`
*/
extern crate native_windows_derive as nwd;
extern crate native_windows_gui as nwg;

mod ui;

#[tokio::main]
async fn main() {
    ui::init();
}
