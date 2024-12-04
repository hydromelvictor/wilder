const path = require('path');
const fs = require('fs')


module.exports = (modelDir) => {
    const models = []

    const loadFromDirectory = (directory) => {
        if (!fs.existsSync(directory)) {
            console.error(`Directory does not exist: ${directory}`);
            return;
        }
        fs.readdirSync(directory).forEach((file) => {
            const fullPath = path.join(directory, file);
            if (fs.existsSync(fullPath)) {
                if (fs.statSync(fullPath).isDirectory()) {
                    loadFromDirectory(fullPath);
                } else if (file.endsWith('.js')) {
                    const model = require(fullPath);
                    models.push(model.modelName);
                }
            }
        });
    };

    loadFromDirectory(modelDir);
    return models
};
