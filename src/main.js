import { invoke } from '@tauri-apps/api/tauri';
import { shell } from '@tauri-apps/api/shell';

window.connect = async function(port) {
  const url = `steam://connect/cs.lukseh.org:${port}`;
  try {
    await shell.open(url);
  } catch (e) {
    console.error('Failed to open URL', e);
  }
};
async function runSteamCMD() {
  const result = await invoke('run_steamcmd');
  alert(`SteamCMD ran:\n${result}`);
}

// Remove or implement this if needed
// window.addEventListener("DOMContentLoaded", createServerButtons);
