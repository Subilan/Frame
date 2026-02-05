import OSS from 'ali-oss'

export default function getOSSClient() {
    if (!process.env.AKID || !process.env.AKSECRET) throw 'missing accessKeyId or accessKeySecret';

    return new OSS({
        accessKeyId: process.env.AKID,
        accessKeySecret: process.env.AKSECRET,
        region: 'oss-cn-beijing',
        bucket: 'fnmdp',
        authorizationV4: true
    });
}