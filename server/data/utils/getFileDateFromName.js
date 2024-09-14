export default function (filename) {
    const executed = /(\d+)[.\-\/](\d+)[.\-\/](\d+)_(\d+)[.\-\/](\d+)[.\-\/](\d+)/.exec(filename);
    if (executed === null) return new Date('1970-01-01');
    return new Date(`${executed[1]}-${executed[2]}-${executed[3]} ${executed[4]}:${executed[5]}:${executed[6]}`);
}