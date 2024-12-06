const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const executeCommand = command =>
  new Promise((resolve, reject) => 
    exec(command, (error, stdout, stderr) => 
      error ? reject(error) : resolve(stdout || stderr)
    )
  );

const formatDateTime = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} at ${hours}:${minutes}`;
};

const makeDailyCommit = async () => {
  try {
    const filePath = path.join(__dirname, 'update.txt');
    const date = new Date();
    const formattedDate = formatDateTime(date);
    fs.writeFileSync(filePath, `Last update: ${formattedDate}\n`);

    await executeCommand('git add update.txt');
    await executeCommand(`git commit -m "Daily update - ${formattedDate}"`);
    await executeCommand('git push origin main');

    console.log('[INFO] Commit made and changes pushed successfully.');
  } catch (error) {
    console.log('[ERROR] During committing:', error);
  }
};

makeDailyCommit();
