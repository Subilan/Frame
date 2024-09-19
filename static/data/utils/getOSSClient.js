import OSS from 'ali-oss'
import OSSConfig from '../../config.js';

export default function () {
    return new OSS({
        accessKeyId: OSSConfig.accessKeyId,
        accessKeySecret: OSSConfig.accessKeySecret,
        region: 'oss-cn-beijing',
        bucket: 'fnmdp',
        authorizationV4: true
    });
}