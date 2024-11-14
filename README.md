# Backup Script

This project is a backup script that copies files from a specified input directory to an output directory. It allows for configuration options such as file and directory filtering, and checks for existing files to only copy those that are new or modified.

## Configuration

You can configure the project in the `config.js` file. Here are the available configuration options:

```javascript
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
```

### Parameters

- **inputDir**:  
  The directory from which files will be backed up.

- **outputDir**:  
  The directory where backups will be stored.

- **writeFiles**:  
  Set to `true` to create or overwrite files in the output directory; no files or directories will be changed if set to false.

- **showNewFileName**:  
  If set to `true`, logs the names of newly created files.

- **showUpdatedFileName**:  
  If set to `true`, logs the names of updated files.

- **showNewDirName**:  
  If set to `true`, logs the names of newly created directories.

- **logPath**:  
  If set to `true`, logs the paths of the files and directories being processed.

- **ignore**:  
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
-------------------------------------------
backup time: 4.369s
total size: 4715.05 mb
biggest file: 173.87 mb bot_v3.0 - kopie.zip
new dirs 16359
new files 48843 4696.94 mb
-------------------------------------------
```

### Output Details

 - **`backup time`**: The total time taken to complete the backup process.  

 - **`total size`**: The total size of all files backed up, displayed in megabytes (MB).  

 - **`biggest file`**: The size and name of the largest file that was backed up.  

 - **`new dirs`**: The total number of new directories created in the output directory.  

 - **`new files`**: The total number of new files created in the output directory, along with their total size.  