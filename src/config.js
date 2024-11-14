module.exports = {
    inputDir: '/media/gijs/GijSchijf/Documenten/projects',  // Directory to back up
    outputDir: 'media/gijs/gusb/backups/projects',          // Directory to store backups

    writeFiles: false,                                      // Set to true to enable writing files; no files/dirs will be changed if set to false

    showNewFileName: false,                                 // Log new file names
    showUpdatedFileName: false,                             // Log updated file names
    showNewDirName: false,                                  // Log new directory names

    logPath: false,                                         // Log the path of files and directories being processed

    ignore: [                                               // List of files/directories to ignore
        'node_modules',
        '.batch',
        '.csv',
        '.idea',
    ],
};