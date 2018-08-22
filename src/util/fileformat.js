var extensionLists = {}; //Create an object for all extension lists
extensionLists.video = ['m4v', 'avi','mpg','mp4', 'webm']

extensionLists.image = ['jpg', 'jpeg', 'gif', 'bmp', 'png']

extensionLists.sound = ['mp3', 'wav', 'wave', 'wma', 'mid', 'midi', 'ogg']

extensionLists.document = ['pdf', 'doc', 'docx', 'txt', 'html', 'rtf']

// One validation function for all file types
function isValidFileType(fName, fType) {
    return extensionLists[fType].indexOf(fName.split('.').pop()) > -1;
}

export { isValidFileType }
