export default function tagIs(tag: string, type: 'collection' | 'category') {
    return tag.startsWith(type + '-');
}