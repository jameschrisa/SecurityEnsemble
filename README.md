# Security Protocol CLI Instructions

This document provides instructions for using the CLI-based user interface for the security protocol implementation.

## Prerequisites

1. Ensure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
2. Install the required npm package by running the following command in the directory containing the script:
   ```
   npm install inquirer
   ```

## Script Location

The CLI implementation of the security protocol can be found in the file `security_protocol_cli.js` in this repository.

## Instructions

1. Open a terminal and navigate to the directory containing the script.
2. Run the script with root privileges:
   ```
   sudo node security_protocol_cli.js
   ```
3. Follow the prompts in the CLI to select which security tools you want to run.
4. For some tools, you may be asked to provide additional information (e.g., IP range for Nmap scan, duration for tshark capture).

## Script Overview

The script provides an interactive interface to run the following security tools:

1. Suricata for intrusion detection
2. Zeek for network analysis
3. Nmap for vulnerability assessment
4. Tripwire for file integrity checking
5. rkhunter for rootkit detection
6. ClamAV for malware scanning
7. tshark for network traffic capture

Each tool can be run independently based on your selection.

## Notes

- This script assumes you're running on a Linux system and that all the mentioned security tools are installed.
- You may need to modify interface names (e.g., `eth0`) in the script to match your network configuration.
- Always run security tools with caution and ensure you have the necessary permissions.
- This is a basic implementation for educational purposes. In a production environment, you would need more robust error handling, logging, and security measures.

Remember to always test scripts in a safe, controlled environment before running them on production systems.
