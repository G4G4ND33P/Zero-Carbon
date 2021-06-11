module.exports = {
    devServer: {
        host: '0.0.0.0',
        proxy: 'https://barcode.monster/',
        https: true,
    }
};