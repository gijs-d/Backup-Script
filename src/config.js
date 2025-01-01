module.exports = {
    inputDir: '/media/gijs/GijSchijf/Documenten/projects', // Directory to back up
    outputDir: '/media/gijs/gusb/backups/projects', // Directory to store backups

    writeFiles: false, // Set to true to enable writing files/dirs; no files/dirs will be changed if set to false

    logNewFileName: true, // Log new file names
    logUpdatedFileName: true, // Log updated file names
    logNewDirName: true, // Log new directory names
    logNewDirNameHideSubs: false, // Hide the logging of subdirectory names when logging new directories

    logPath: false, // Log the path of files and directories being processed

    logToFile: true, // Save the logs to a file

    printSizeOfAllFilesByType: false, // Print the sizes of all files categorized by type
    printSizeOfNewFilesByType: true, // Print the sizes of new files categorized by type

    // List of files/directories to ignore
    ignore: ['node_modules', '.batch', '.csv', '.idea', 'dist'],
};
