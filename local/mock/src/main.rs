use std::fs;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::thread;
use std::time::{Duration, SystemTime};

#[macro_use]
extern crate json;

fn remove_extra_comma(str: &str) -> &str {
    str.trim_end_matches(',')
}

fn write_file(mut file: &File, line: &str) {
    println!("Writing {}", line);
    writeln!(file, "{}", line).expect("Unable to write file");
}

fn main() {
    let file_path_in = String::from("../../server/mock/live/livedata.json");
    let file_path_out = String::from("../../server/mock/live/out.json");
    let out_file = File::create(file_path_out).expect("Unable to create file");

    println!("In file {}", file_path_in);

    let mut start_time = 0;

    let contents =
        fs::read_to_string(file_path_in).expect("Should have been able to read the file");
    let now = SystemTime::now();

    for line in contents.lines() {
        match line {
            "]" | "[" => {
                println!("Skipping parsing {}", line);
                write_file(&out_file, line);
            }
            line => {
                let data = json::parse(remove_extra_comma(line));

                match data {
                    Ok(result) => {
                        if result["category"].as_str() == Some("init") {
                            println!("Match Start At {}", result["timestamp"]);
                            start_time = result["timestamp"].as_u64().unwrap();
                        }

                        let current_time = result["timestamp"].as_u64().unwrap();
                        let diff = current_time - start_time;
                        let elapsed = now.elapsed().unwrap().as_secs();

                        println!("{} and {}", diff, elapsed);

                        if diff > elapsed {
                            out_file.sync_all().expect("File didn't sync");
                            let sleep = diff - elapsed;
                            println!("Sleeping for {}", sleep);
                            thread::sleep(Duration::from_secs(sleep));
                        }
                        write_file(&out_file, line);
                    }
                    Err(error) => println!("Problem parsing: {} {}", line, error),
                }
            }
        }
    }
}
