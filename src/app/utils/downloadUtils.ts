import JSZip from 'jszip';

interface FileToDownload {
  filename: string;
  imageUrl?: string;
  url?: string;
}

/**
 * Download multiple files as a ZIP archive
 * @param files - Array of files with filename and URL
 * @param zipFilename - Name of the output ZIP file
 */
export async function downloadFilesAsZip(
  files: FileToDownload[],
  zipFilename: string = 'evidence-files.zip'
): Promise<void> {
  try {
    const zip = new JSZip();
    
    // Fetch all files and add to zip
    const fetchPromises = files.map(async (file, index) => {
      try {
        const url = file.imageUrl || file.url;
        if (!url) {
          return;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${file.filename}: ${response.statusText}`);
        }

        const blob = await response.blob();
        
        // Add file to zip with original filename or fallback to index-based name
        const filename = file.filename || `file-${index + 1}.jpg`;
        zip.file(filename, blob);
      } catch (error) {
        console.error(`Error fetching file ${file.filename}:`, error);
        // Continue with other files even if one fails
      }
    });

    // Wait for all files to be fetched
    await Promise.all(fetchPromises);

    // Generate zip file
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // Balanced compression level (0-9)
      }
    });

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = zipFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw error;
  }
}

/**
 * Download a single file
 * @param url - URL of the file to download
 * @param filename - Name for the downloaded file
 */
export async function downloadSingleFile(
  url: string,
  filename: string
): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}
