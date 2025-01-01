# Backup Script

This project is a backup script that copies files from a specified input directory to an output directory. It allows for configuration options such as file and directory filtering, and checks for existing files to only copy those that are new or modified.

## Configuration

You can configure the project in the `src/config.js` file. Here are the available configuration options:

```javascript
module.exports = {
    inputDir: '/media/gijs/GijSchijf/Documenten/projects', // Directory to back up
    outputDir: '/media/gijs/gusb/backups/projects', // Directory to store backups

    writeFiles: false, // Set to true to enable writing files/dirs; no files/dirs will be changed if set to false

    logNewFileName: true, // Log new file names
    logUpdatedFileName: true, // Log updated file names
    logNewDirName: true, // Log new directory names
    logNewDirNameHideSubs: false, // Hide the logging of subdirectory names when logging new directories

    logPath: false, // Log the path of files and directories being processed

    logToFile: false, // Save the logs to a file

    printSizeOfAllFilesByType: false, // Print the sizes of all files categorized by type
    printSizeOfNewFilesByType: true, // Print the sizes of new files categorized by type

    // List of files/directories to ignore
    ignore: ['node_modules', '.batch', '.csv', '.idea', '.zip', 'dist'],
};
```

### Parameters

-   **inputDir**:  
    The directory from which files will be backed up.

-   **outputDir**:  
    The directory where backups will be stored.

-   **writeFiles**:  
    Create or overwrite files or directories in the output directory; no files or directories will be changed if set to `false`.

-   **logNewFileName**:  
    Logs the names of newly created files.

-   **logUpdatedFileName**:  
    Logs the names of updated files.

-   **logNewDirName**:  
    Logs the names of newly created directories.

-   **logNewDirNameHideSubs**:  
    Hide the logging of subdirectory names when logging new directories

-   **logPath**:  
    Logs the paths of the files and directories being processed.

-   **logToFile**:  
    Save the logs to a file (`logs.txt`).

-   **printSizeOfAllFilesByType**:  
    Print the sizes of all files categorized by type.

-   **printSizeOfNewFilesByType**:  
    Print the sizes of new files categorized by type.

-   **ignore**:  
    An array of file and directory names to ignore during the backup process.

## Running the Project

1. **Install Dependencies**: Make sure you have Node.js installed.

2. **Run the Script**: Execute the script to start the backup process:

    ```bash
    npm start
    ```

3. **View Results**: After the script completes, the output will be displayed in the console, showing details about the backup process.

## Output

```plaintext
2025-01-01T23:02:15 : Start Backup ;
2025-01-01T23:02:15 | Input Dir : /media/gijs/GijSchijf/Documenten/projects ;
2025-01-01T23:02:15 | Output Dir : /media/gijs/gusb/backups/projects ;

2025-01-01T23:03:02 | Changed : _._Tools/files/BackupScript  README.md ;
2025-01-01T23:03:02 | New file : _._Tools/files/BackupScript  logs.txt ;
2025-01-01T23:03:02 | Changed : _._Tools/files/BackupScript/src  config.js ;
2025-01-01T23:03:02 | Changed : _._Tools/files/BackupScript/src  index.js ;

2025-01-01T23:03:32 : Backup Completed ;
--------------------------------------------------------
Backup time: 1:16.897 (m:ss.mmm)

Total dirs: 18281
Total files: 51639  5.13 GB
Largest file: 182.32 MB  bot_v3.0 - kopie.zip

New dirs: 0
New files: 4  13.14 KB
Largest new file: 7.28 KB  index.js
--------------------------------------------------------

Size of new files by type:
 .js:    8.27 KB
.md:     4.14 KB
.txt:    723.00 B
```
