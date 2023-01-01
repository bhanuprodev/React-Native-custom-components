import { Buffer } from 'buffer'
import S3 from "aws-sdk/clients/s3";
import { Credentials } from "aws-sdk";
import { Dimensions, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const decodedAccesskey = "base 64 encrypted key";
const decodedSecretkey = "base 64 encrypted key";
const access = new Credentials({
    accessKeyId: decodedAccesskey.toString("utf8"),
    secretAccessKey: decodedSecretkey.toString("utf8")
});
const s3 = new S3({
    credentials: access,
    region: "Your bucket region",
    signatureVersion: "v4",
});
const signedUrlExpireSeconds = 60 * 15;

export async function setStoragePrefObjectValue(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}
export async function getStoragePrefObjectValue(key) {
    const value = await AsyncStorage.getItem(key);
    if (value)
        return JSON.parse(value);
}

export async function uploadingToS3(file, key) {
    if (file && key) {
        try {
            const url = await s3.getSignedUrlPromise("putObject", {
                Bucket: "your bucket name",
                Key: key + generateString(10),
                ContentType: file.type,
                Expires: signedUrlExpireSeconds,
            });
            console.log(url, "url")
            console.log(file, "file")

            let a = await uploadImage(url, file.uri)
            a.url = url.split("?")[0]
            a.uri = a.url
            return a
        }
        catch (e) {
            console.error(e, "%%%%%%%%%%%%%%")
            return

        }
    }
    else {
        console.error("file missing")
    }
}
const uploadImage = async (uploadUrl, fileUri) => {
    const imageBody = await getBlob(fileUri);
    return fetch(uploadUrl, {
        method: "PUT",
        body: imageBody,
    });
};
export const getBlob = async (fileUri) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
};