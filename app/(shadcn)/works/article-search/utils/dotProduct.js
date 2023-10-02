export default function dotProduct(a, b) {
    if (a.length != b.length) { return 1; }
    let dotProduct = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
    }
    return dotProduct;
}