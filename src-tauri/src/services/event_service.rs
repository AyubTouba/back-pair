use serde::Serialize;
use tauri::{AppHandle, Emitter};

pub fn get_event_steps(total: usize) -> usize {
    let updates = match total {
        0..=99 => total,  // send every file
        100..=999 => 100, // send 100 updates max
        1_000..=9_999 => 100,
        _ => 200,
    };
    (total as f64 / updates as f64).ceil() as usize
}

pub fn send_event<T : Serialize + Clone >(app: &AppHandle,event_name:&str,payload:T) {
      let _ = app
                        .emit(
                           event_name,
                            payload,
                        )
                        .map_err(|e| {
                            log::error!("send_event: {}", e)
                        });
}