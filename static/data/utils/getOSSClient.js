import OSS from 'ali-oss'

export default function () {
    return new OSS({
        accessKeyId: process.env.AKID,
        accessKeySecret: process.env.AKSECRET,
        region: 'oss-cn-beijing',
        bucket: 'fnmdp',
        authorizationV4: true
    });
}