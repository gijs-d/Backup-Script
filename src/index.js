const fs = require('fs');
const path = require('path');
const Cli = require('./lib/logs');

const {
    inputDir,
    outputDir,
    writeFiles,
    logNewFileName,
    logUpdatedFileName,
    logNewDirName,
    logNewDirNameHideSubs,
    logPath,
    logToFile,
    printSizeOfAllFilesByType,
    printSizeOfNewFilesByType,
    ignore,
} = require('./config');

const cli = new Cli();
cli.saveToFile = logToFile;

let changedDirs = 0;
let lastPath;
const size = [0, 0, 0];
const maxSize = [0, 'file'];
const changedFiles = [0, 0, [0, 'file']];
const typeSize = {};
const totalTypeSize = {};

backup();

async function backup() {
    cli.custom('', 'green', 'Start Backup');
    cli.custom('Input Dir', 'reset', inputDir);
    cli.custom('Output Dir', 'reset', outputDir);
    console.log();
    const files = await fs.promises.readdir(inputDir);
    if (!(await pathExists(`${outputDir}`)) && writeFiles) {
        await fs.promises.mkdir(`${outputDir}`);
    }
    console.time('Backup time');
    for (const f of files) {
        await checkdir('', f);
    }
    console.log();
    cli.custom('', 'green', 'Backup Completed');
    console.log('--------------------------------------------------------');
    console.timeEnd('Backup time');
    console.log(`\nTotal dirs: ${size[2]}`);
    console.log(`Total files: ${size[1]}  ${printBytes(size[0])}`);
    console.log(`Largest file: ${printBytes(maxSize[0])}  ${maxSize[1]}`);
    console.log(`\nNew dirs: ${changedDirs}`);
    console.log(`New files: ${changedFiles[0]}  ${printBytes(changedFiles[1])}`);
    console.log(`Largest new file: ${printBytes(changedFiles[2][0])}  ${changedFiles[2][1]}`);
    console.log('--------------------------------------------------------\n');
    if (printSizeOfAllFilesByType) {
        printtTypeSize('Size of all files by type:', totalTypeSize);
        console.log();
    }
    if (printSizeOfNewFilesByType) {
        printtTypeSize('Size of new files by type:', typeSize);
    }
}

function printtTypeSize(title, obj) {
    console.log(
        title,
        '\n',
        Object.entries(obj)
            .sort((a, b) => b[1] - a[1])
            .map(type => `${type[0]}:\t ${printBytes(type[1])}`)
            .join('\n')
    );
}

function printBytes(bytes) {
    const sizes = ['', 'K', 'M', 'G', 'T'];
    const factor = Math.floor(Math.log10(bytes || 1) / 3);
    return `${(bytes / Math.pow(1000, factor)).toFixed(2)} ${sizes[factor]}B`;
}

async function pathExists(fsPath) {
    try {
        await fs.promises.stat(fsPath);
        return true;
    } catch {
        return false;
    }
}

async function checkdir(newPath, dir) {
    if (logPath) {
        cli.custom('Path', 'gray', `${newPath}  ${dir}`);
    }
    if (ignore.includes(dir)) {
        return true;
    }
    if (ignore.find(i => dir.includes(i))) {
        return true;
    }
    const stats = await fs.promises.stat(`${inputDir}/${newPath && `${newPath}/`}${dir}`);
    if (!stats.isDirectory()) {
        await backupFile(stats, newPath, dir);
    } else {
        await backupDir(stats, newPath, dir);
    }
}

async function backupFile(stats, newPath, dir) {
    size[0] += stats.size;
    size[1]++;
    if (printSizeOfAllFilesByType) {
        const extension = path.extname(dir).toLowerCase();
        totalTypeSize[extension] = (totalTypeSize[extension] || 0) + stats.size;
    }
    if (stats.size > maxSize[0]) {
        maxSize[0] = stats.size;
        maxSize[1] = dir;
    }
    const fileExists = await pathExists(`${outputDir}/${newPath && `${newPath}/`}${dir}`);
    if (fileExists) {
        await updatedFile(stats, dir, newPath);
    } else {
        await newFile(stats, dir, newPath);
    }
}

async function updatedFile(stats, dir, newPath) {
    let same = true;
    if (getFileType(dir) == 'unknown') {
        const data1 = await fs.promises.readFile(`${outputDir}/${newPath && `${newPath}/`}${dir}`);
        const data2 = await fs.promises.readFile(`${inputDir}/${newPath && `${newPath}/`}${dir}`);
        same = data1.equals(data2);
    }
    if (!same) {
        if (logUpdatedFileName) {
            cli.custom('Changed', 'cyan', `${newPath}  ${dir}`);
        }
        handleNewFile(stats, dir);
        if (writeFiles) {
            await fs.promises.copyFile(
                `${inputDir}/${newPath && `${newPath}/`}${dir}`,
                `${outputDir}/${newPath && `${newPath}/`}${dir}`
            );
        }
    }
}

function handleNewFile(stats, dir) {
    if (printSizeOfNewFilesByType) {
        const extension = path.extname(dir).toLowerCase();
        typeSize[extension] = (typeSize[extension] || 0) + stats.size;
    }
    changedFiles[0]++;
    changedFiles[1] += stats.size;
    if (changedFiles[2][0] < stats.size) {
        changedFiles[2] = [stats.size, dir];
    }
}

function getFileType(fileName) {
    const extension = path.extname(fileName).toLowerCase();
    const videoExtensions = [
        '.mp4',
        '.mkv',
        '.avi',
        '.mov',
        '.wmv',
        '.flv',
        '.webm',
        '.mpg',
        '.mpeg',
        '.3gp',
    ];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.svg'];
    const audioExtensions = [
        '.mp3',
        '.wav',
        '.aac',
        '.flac',
        '.ogg',
        '.wma',
        '.m4a',
        '.opus',
        '.aiff',
    ];
    if (videoExtensions.includes(extension)) {
        return 'video';
    } else if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (audioExtensions.includes(extension)) {
        return 'audio';
    }
    return 'unknown';
}

async function newFile(stats, dir, newPath) {
    if (writeFiles) {
        await fs.promises.copyFile(
            `${inputDir}/${newPath && `${newPath}/`}${dir}`,
            `${outputDir}/${newPath && `${newPath}/`}${dir}`
        );
    }
    if (logNewFileName) {
        cli.custom('New file', 'green', `${newPath}  ${dir}`);
    }
    handleNewFile(stats, dir);
}

async function backupDir(stats, newPath, dir) {
    size[2]++;
    if (!(await pathExists(`${outputDir}/${newPath && `${newPath}/`}${dir}`))) {
        changedDirs++;
        if (writeFiles) {
            fs.promises.mkdir(`${outputDir}/${newPath && `${newPath}/`}${dir}`);
        }
        if (logNewDirName) {
            let log = true;
            if (logNewDirNameHideSubs && `${newPath}/${dir}`.includes(lastPath)) {
                log = false;
            }
            if (log) {
                lastPath = `${newPath}/${dir}`;
                cli.custom('New dir', 'brightGreen', `${newPath}  ${dir}`);
            }
        }
    }
    const files = await fs.promises.readdir(`${inputDir}/${newPath && `${newPath}/`}${dir}`);
    for (const f of files) {
        await checkdir(`${newPath && `${newPath}/`}${dir}`, f);
    }
}
