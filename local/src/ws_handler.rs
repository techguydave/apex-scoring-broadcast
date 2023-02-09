use tokio::sync::mpsc::Receiver;
use tokio_tungstenite::{
    connect_async,
    tungstenite::{Error, Result},
};
use url::Url;
pub async fn connect(url: &str, rx: Receiver<&str>) -> Result<()> {
    let parsed_url = Url::parse(url).expect("Invalid Url");
    let (mut socket, _) = connect_async(parsed_url).await?;

    Ok(())
}
