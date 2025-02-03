// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use regex::Regex;
use tauri::command;

fn check_password_strength(password: &str) -> i32 {
    let mut score = 0;

    // Check common passwords
    let common_pass = vec!["1234", "1383"];
    if common_pass.contains(&password) {
        return -1000;
    }

    // Check password length
    if password.len() <= 8 {
        score -= 1;
    } else if password.len() >= 8 {
        score += 1;
    }

    // Check for lowercase and uppercase letters
    let lower_case = Regex::new(r"[a-z]").unwrap();
    let upper_case = Regex::new(r"[A-Z]").unwrap();
    if lower_case.is_match(password) || upper_case.is_match(password) {
        score += 1;
    }

    // Check if it contains both lower and uppercase characters
    if lower_case.is_match(password) && upper_case.is_match(password) {
        score += 1;
    }

    // Check if it contains numbers
    let number = Regex::new(r"\d").unwrap();
    if number.is_match(password) {
        score += 1;
    }

    // Check if it contains special characters
    let special_char = Regex::new(r"[\W_]").unwrap();
    if special_char.is_match(password) {
        score += 1;
    }

    score
}

use rand::Rng;

// Function to generate a random password with symbols included
fn generate_password(length: usize) -> String {
    let charset: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ\
                           abcdefghijklmnopqrstuvwxyz\
                           0123456789\
                           !@#$%^&*()_+-=<>?"; // Add any symbols you want here

    let password: String = (0..length)
        .map(|_| {
            let idx = rand::thread_rng().gen_range(0..charset.len());
            charset[idx] as char
        })
        .collect();

    password
}

// Command that can be invoked from the frontend
#[tauri::command]
fn pass_gen(length: usize) -> String {
    generate_password(length)
}

#[command]
fn password_strength(password: String) -> i32 {
    check_password_strength(&password)
}

#[tauri::command]
fn set_drag_region(window: tauri::Window, enable: bool) {
    let script = if enable {
        "document.documentElement.setAttribute('data-tauri-drag-region', 'true');"
    } else {
        "document.documentElement.removeAttribute('data-tauri-drag-region');"
    };

    window.eval(script).expect("Failed to execute script");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            password_strength,
            set_drag_region,
            pass_gen
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
