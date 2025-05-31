# BackPair

<p align="center">
  <img src="public/logo.png" alt="back-pair logo" width="200"/>
</p>

<p align="center">
  <a href="https://github.com/v/release/AyubTouba/back-pair"><img src="https://img.shields.io/github/v/release/AyubTouba/back-pair" alt="Latest Release"></a>
  <img src="https://img.shields.io/badge/built%20with-tauri-blueviolet" alt="Built with Tauri">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License: MIT">
</p>

## Overview

`BackPair` is a desktop application designed to simplify and accelerate the process of backing up folders to internal or external devices. It allows users to create custom backup profiles, defining pairs of source and destination folders. With profiles set up, backing up multiple folders is as easy as selecting a profile and clicking a single button.

Whether you need to regularly back up important documents, media files, or project directories, `BackPair` streamlines the process, saving you time and effort compared to manual copying.

<p align="center">
  <img src="public/demo.gif" alt="back-pair logo" />
</p>

---

## Features

* **Profile Management:** Create, name, and manage multiple backup profiles.
* **Folder Pairing:** Define specific source ("From") and destination ("To") folder pairs within each profile.
* **One-Click Backup:** Easily initiate the backup process for an entire profile with a single click.
* **Backup Logs:** View detailed logs of the backup process, including progress and status for each file.
* **Intuitive User Interface:** A clean and modern interface built with React.js and shadcn UI.
* **Cross-Platform:** Built with Tauri, providing a native experience on major operating systems.

---

## Installation

You can download the latest version for your platform from the [Releases](https://github.com/AyubTouba/back-pair/releases) page.

> **Note for macOS and Windows users**:  
> You may encounter a warning about the app being from an unidentified developer or not being code-signed. This is expected for now, as the app not yet signed with a verified certificate.  
> To proceed:  
> - **macOS**: Open the terminal and  run the command: `xattr -cr /Applications/BackPair.app `
> - **Windows**: Click **"More Info"** on the warning screen, then **"Run anyway."**

---
## Usage

1.  **Create a Profile:** Navigate to the "Add Profile" section. Give your profile a descriptive name and add pairs of "From" (source) and "To" (destination) folders. Save the profile.
2.  **Manage Profiles:** The "Profiles" section allows you to view and potentially edit or delete existing profiles.
3.  **Run a Backup:** Go to the "Run Backup" section. Select the desired backup profile from the dropdown list. Click the "Launch Backup" button.
4.  **Monitor Progress:** The "Backup Logs" area will display the progress of the backup process, showing which files are being copied.
5.  **View History:** The "History" section show a record of past backup operations.

--- 

## Contributing

We welcome contributions to `BackPair`! If you have ideas for new features, find bugs, or want to improve the code, please feel free to:

1.  Fork the repository.
2.  Create a new branch for your feature or bugfix.
3.  Make your changes.
4.  Submit a pull request with a clear description of your changes.

--- 

## License
This project is licensed under the MIT License

