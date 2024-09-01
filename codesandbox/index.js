import inquirer from 'inquirer';
import cliProgress from 'cli-progress';
import { exec } from 'child_process';
import fs from 'fs';

const logFile = 'security_protocol_log.txt';
const reportFile = 'security_protocol_report.txt';

function executeCommand(command, estimatedDuration = 8000) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    fs.appendFileSync(logFile, `\nExecuting: ${command}\n`);

    const bar = new cliProgress.SingleBar({
      format: '{bar} {percentage}% | ETA: {eta}s | {value}/{total}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    });

    bar.start(100, 0);

    const startTime = Date.now();
    const child = exec(command, (error, stdout, stderr) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      bar.update(100);
      bar.stop();

      fs.appendFileSync(logFile, `Command output:\n${stdout}\n${stderr}\n`);
      fs.appendFileSync(logFile, `Command completed in ${duration}ms\n`);

      console.log(`Command ${command} completed ${error ? 'with errors' : 'successfully'}.`);
      
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr, duration });
      }
    });

    // Update progress based on time elapsed
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.floor((elapsed / estimatedDuration) * 100), 99);
      bar.update(progress);
      
      if (progress < 99 && !child.killed) {
        setTimeout(updateProgress, 100);
      }
    };

    updateProgress();
  });
}

async function runSecurityProtocol() {
  console.log('Welcome to the Security Protocol CLI');
  fs.writeFileSync(logFile, 'Security Protocol Execution Log\n');
  fs.writeFileSync(reportFile, 'Security Protocol Execution Report\n');

  const questions = [
    {
      type: 'confirm',
      name: 'runSuricata',
      message: 'Do you want to run Suricata for intrusion detection?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'runZeek',
      message: 'Do you want to run Zeek for network analysis?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'runNmap',
      message: 'Do you want to run an Nmap scan for vulnerability assessment?',
      default: true,
    },
    {
      type: 'input',
      name: 'nmapTarget',
      message: 'Enter the IP range for Nmap scan (e.g., 192.168.1.0/24):',
      when: (answers) => answers.runNmap,
    },
    {
      type: 'confirm',
      name: 'runTripwire',
      message: 'Do you want to run Tripwire for file integrity checking?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'runRkhunter',
      message: 'Do you want to run rkhunter for rootkit detection?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'runClamav',
      message: 'Do you want to run ClamAV for malware scanning?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'runTshark',
      message: 'Do you want to capture network traffic with tshark?',
      default: true,
    },
    {
      type: 'input',
      name: 'tsharkDuration',
      message: 'Enter the duration for tshark capture (in seconds):',
      when: (answers) => answers.runTshark,
      validate: (value) => !isNaN(value) || 'Please enter a number',
    },
  ];

  const answers = await inquirer.prompt(questions);

  const results = [];

  if (answers.runSuricata) {
    try {
      const result = await executeCommand('suricata -c /etc/suricata/suricata.yaml -i eth0');
      results.push({ command: 'Suricata', status: 'Success', duration: result.duration });
    } catch (error) {
      results.push({ command: 'Suricata', status: 'Failed', error: error.message });
    }
  }

  if (answers.runZeek) {
    try {
      const result = await executeCommand('zeek -i eth0');
      results.push({ command: 'Zeek', status: 'Success', duration: result.duration });
    } catch (error) {
      results.push({ command: 'Zeek', status: 'Failed', error: error.message });
    }
  }

  if (answers.runNmap) {
    try {
      const result = await executeCommand(`nmap -sV -O ${answers.nmapTarget}`);
      results.push({ command: 'Nmap', status: 'Success', duration: result.duration });
    } catch (error) {
      results.push({ command: 'Nmap', status: 'Failed', error: error.message });
    }
  }

  if (answers.runTripwire) {
    try {
      const result = await executeCommand('tripwire --check');
      results.push({ command: 'Tripwire', status: 'Success', duration: result.duration });
    } catch (error) {
      results.push({ command: 'Tripwire', status: 'Failed', error: error.message });
    }
  }

  if (answers.runRkhunter) {
    try {
      const result = await executeCommand('rkhunter --check');
      results.push({ command: 'rkhunter', status: 'Success', duration: result.duration });
    } catch (error) {
      results.push({ command: 'rkhunter', status: 'Failed', error: error.message });
    }
  }

  if (answers.runClamav) {
    try {
      const result = await executeCommand('clamscan -r /');
      results.push({ command: 'ClamAV', status: 'Success', duration: result.duration });
    } catch (error) {
      results.push({ command: 'ClamAV', status: 'Failed', error: error.message });
    }
  }

  if (answers.runTshark) {
    try {
      const duration = parseInt(answers.tsharkDuration);
      const result = await executeCommand(`tshark -i eth0 -a duration:${duration} -w captured_traffic.pcap`, duration * 1000);
      results.push({ command: 'tshark', status: 'Success', duration: result.duration });
    } catch (error) {
      results.push({ command: 'tshark', status: 'Failed', error: error.message });
    }
  }

  // Generate report
  results.forEach(result => {
    const reportLine = `${result.command}: ${result.status} ${result.duration ? `(${result.duration}ms)` : ''}\n`;
    fs.appendFileSync(reportFile, reportLine);
  });

  console.log('Security protocol execution completed. Check the log and report files for details.');
}

runSecurityProtocol().catch(console.error);
