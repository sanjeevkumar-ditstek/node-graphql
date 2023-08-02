"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleReadFile = exports.readFile = void 0;
const path_1 = require("path"); // This is node built in package
const fs_1 = require("fs"); // this is node built in package
function getFileSize(encoding, createReadStreamFunc, callback) {
    let fileSize = 0;
    // Create a read stream using the provided function
    const readStream = createReadStreamFunc();
    // Listen for the 'data' event to calculate the size
    readStream.on('data', (chunk) => {
        fileSize += Buffer.byteLength(chunk, encoding);
    });
    // Listen for the 'end' event to finish and invoke the callback with the file size
    readStream.on('end', () => {
        callback(null, fileSize);
    });
    // Listen for any errors during reading and invoke the callback with the error
    readStream.on('error', (err) => {
        callback(err, null);
    });
}
const readFile = async (file) => {
    console.log("i m here in read file");
    const { createReadStream, filename, encoding } = await file;
    console.log(file, "file....");
    console.log(createReadStream, filename, "sdjbfdskjabfjdsa");
    // Usage example
    getFileSize(encoding, createReadStream, (err, size) => {
        if (err) {
            console.error('Error occurred:', err);
        }
        else {
            console.log('File size:', typeof size, 'bytes');
        }
    });
    // console.log('mimetype...', mimetype);
    // const stream = createReadStream();
    // const {ext} = parse(filename);
    // let {name} = parse(filename);
    // name = `single${Math.floor((Math.random() * 10000) + 1)}`;
    // let url =  `/home/ditsdev169/Desktop/node-graphql/src/Upload/${name}-${Date.now()}${ext}`;
    // const imageStream = await createWriteStream(url)
    // await stream.pipe(imageStream);
    // const baseUrl = process.env.BASE_URL
    // const port = process.env.PORT
    // url = `${baseUrl}${port}${url.split('Upload')[1]}`;
    // return url;
}; // This is single readfile
exports.readFile = readFile;
const multipleReadFile = async (file) => {
    const fileUrl = [];
    console.log("i m here!!!!");
    console.log(file, "sjdnkn");
    for (let i = 0; i < file.length; i++) {
        console.log(file[i], "akmndksndskj");
        const { createReadStream, filename } = await file[i];
        const stream = createReadStream();
        const { ext } = (0, path_1.parse)(filename);
        let { name } = (0, path_1.parse)(filename);
        name = `single${Math.floor((Math.random() * 10000) + 1)}`;
        let url = `/home/ditsdev169/Desktop/node-graphql/src/Upload/${name}-${Date.now()}${ext}`;
        const imageStream = await (0, fs_1.createWriteStream)(url);
        await stream.pipe(imageStream);
        const baseUrl = process.env.BASE_URL;
        const port = process.env.PORT;
        url = `${baseUrl}${port}${url.split('Upload')[1]}`;
        fileUrl.push({ url });
    }
    return fileUrl;
};
exports.multipleReadFile = multipleReadFile;
