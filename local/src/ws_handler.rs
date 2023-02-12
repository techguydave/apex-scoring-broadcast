use crate::ws_handler::Message::{Close, Text};
use futures_util::{
    stream::{SplitSink, SplitStream},
    SinkExt, StreamExt, TryFutureExt,
};
use json::JsonValue;
use tokio::{
    net::TcpStream,
    sync::mpsc::{Receiver, Sender},
};
use tokio_tungstenite::{
    connect_async,
    tungstenite::{Error, Message},
    MaybeTlsStream, WebSocketStream,
};
use url::Url;

#[derive(Debug, Clone)]
pub struct WsMessage {
    pub msg_type: String,
    pub body: JsonValue,
}

impl WsMessage {
    pub fn noop() -> WsMessage {
        WsMessage {
            msg_type: String::from("noop"),
            body: object! {},
        }
    }
    pub fn new(msg_type: String, body: JsonValue) -> WsMessage {
        WsMessage {
            msg_type: msg_type,
            body: body,
        }
    }
    pub fn from_json(msg: &str) -> WsMessage {
        let value = json::parse(msg).unwrap();
        WsMessage::new(value["type"].to_string(), value["body"].clone())
    }
    pub fn to_json_message(&self) -> String {
        json::stringify(object! {
            "type": self.msg_type.clone(),
            "body": self.body.clone()
        })
    }
}

pub struct WsConnection {
    username: String,
    key: String,
    hostname: String,
    write: SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>,
    connected: bool,
}

impl WsConnection {
    pub async fn connect(
        url: &str,
        tx: Sender<WsMessage>,
        mut rx: Receiver<WsMessage>,
        username: String,
        key: String,
        hostname: String,
    ) {
        println!("{}, {}, {}", username, key, hostname);

        let parsed_url = Url::parse(url).expect("Invalid Url");
        let (socket, _) = connect_async(parsed_url).await.expect("Count not connect");
        println!("Connected to server");
        let (write, mut read) = socket.split();

        let mut connection = WsConnection {
            username: username.clone(),
            key: key.clone(),
            hostname: hostname.clone(),
            write: write,
            connected: false,
        };

        connection
            .send_message(WsMessage::new(
                String::from("auth"),
                object! {username: username, key: key, hostname: hostname},
            ))
            .await
            .unwrap();

        loop {
            tokio::select! {
                result = rx.recv() => {
                    match result {
                        Some(msg) => {
                            if connection.connected {
                                connection.send_message(msg).await.unwrap();
                            }
                        }
                        None => {
                            println!("Error recevin ws to send");
                        }
                    }
                }
                result = read.next() => {
                    match result {
                        Some(msg) => {
                            match msg.unwrap() {
                                Text(msg) => {
                                    let msg = WsMessage::from_json(&msg);
                                    match msg.msg_type.as_str() {
                                        "auth_accepted" => {
                                            println!("Auth Accepted");
                                            connection.connected = true;
                                        }
                                        "auth_denied" => {
                                            break;
                                        }
                                        _ => {
                                            tx.send(msg);
                                        }
                                    }
                                }
                                Close(_) => {
                                    break;
                                }
                                t => {println!("Recieved invalid message {:?}", t)}
                            }
                        }
                        None => {}
                    }
                }
            }
        }
    }
    async fn send_message(&mut self, msg: WsMessage) -> Result<(), Error> {
        self.write.send(Message::text(msg.to_json_message())).await
    }
}
