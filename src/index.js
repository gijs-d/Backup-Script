const fs = require('fs');
fs.promises.exists = async (f) => {
    try {
        await fs.promises.stat(f);
        return true;
    } catch {
        return false;
    }
}

const {
    inputDir, outputDir, writeFiles,
    showNewFileName, ignore, logPath,
    showNewDirName, showUpdatedFileName
} = require('./config')

let size = 0;
let msize = [0, 'file'];
let changedFiles = [0, 0];
let changedDirs = 0;

backup();

async function backup() {
    let files = await fs.promises.readdir(inputDir);
    console.log(files);
    if (await fs.promises.exists(`${outputDir}`)) {
        console.log('ouput file exsist');;
    } else {
        if (writeFiles) {
            await fs.promises.mkdir(`${outputDir}`);
        }
        console.log('ouput file created')
    }
    console.time('backup time');
    for (const f of files.reverse()) {
        await checkdir('', f);
    }
    console.log('\n\n-------------------------------------------');
    console.timeEnd('backup time');
    console.log(`total size: ${(size / (1024 * 1024)).toFixed(2)} mb`);
    console.log(`bigest file: ${(msize[0] / (1024 * 1024)).toFixed(2)} mb ${msize[1]}`);
    console.log(`new dirs ${changedDirs}`);
    console.log(`new files ${changedFiles[0]} ${(changedFiles[1] / (1024 * 1024)).toFixed(2)} mb`);
    console.log('-------------------------------------------\n');
}

async function checkdir(path, dir) {
    if (logPath) console.log({ path, dir });
    if (ignore.includes(dir)) return true;
    if (ignore.find(i => dir.includes(i))) return true;
    const stats = await fs.promises.stat(`${inputDir}/${path != '' ? path + '/' : ''}${dir}`);
    if (!stats.isDirectory()) {
        await backupFile(stats, path, dir);
    } else {
        await backupDir(stats, path, dir);
    }
}

async function backupFile(stats, path, dir) {
    size += stats.size;
    if (stats.size > msize[0]) {
        msize[0] = stats.size;
        msize[1] = dir;
    }
    if (await fs.promises.exists(`${outputDir}/${path !== '' ? path + '/' : ''}${dir}`)) {
        let same = true;
        if (!dir.includes('.mp4') && !dir.includes('.mp3') && !dir.includes('.jpg')) {
            let data1 = await fs.promises.readFile(`${outputDir}/${path !== '' ? path + '/' : ''}${dir}`);
            let data2 = await fs.promises.readFile(`${inputDir}/${path != '' ? path + '/' : ''}${dir}`);
            same = data1.equals(data2);
        }
        if (!same) {
            if (showUpdatedFileName) console.log(`changed ${path} ${dir}`);
            changedFiles[0]++;
            changedFiles[1] += stats.size;
            if (writeFiles)
                await fs.promises.copyFile(`${inputDir}/${path !== '' ? path + '/' : ''}${dir}`, `${outputDir}/${path !== '' ? path + '/' : ''}${dir}`);
        }
    } else {
        if (writeFiles)
            await fs.promises.copyFile(`${inputDir}/${path !== '' ? path + '/' : ''}${dir}`, `${outputDir}/${path !== '' ? path + '/' : ''}${dir}`);
        if (showNewFileName)
            console.log('new file ', path, dir);
        changedFiles[0]++;
        changedFiles[1] += stats.size;
    }
}

async function backupDir(stats, path, dir) {
    if (!(await fs.promises.exists(`${outputDir}/${path !== '' ? path + '/' : ''}${dir}`))) {
        changedDirs++;
        if (writeFiles)
            fs.promises.mkdir(`${outputDir}/${path !== '' ? path + '/' : ''}${dir}`);
        if (showNewDirName) console.log('new dir ', path, dir);
    }
    let files = await fs.promises.readdir(`${inputDir}/${path}/${dir}`);
    for (const f of files.reverse()) {
        await checkdir(`${path}/${dir}`, f)
    }
}