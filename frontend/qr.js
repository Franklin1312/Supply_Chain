
class QRCodeGenerator {
    constructor(config = {}) {
        this.config = {
            width: config.width || 300,
            height: config.height || 300,
            colorDark: config.colorDark || "#000000",
            colorLight: config.colorLight || "#ffffff",
            correctLevel: config.correctLevel || QRCode.CorrectLevel.H,
            margin: config.margin || 4,
            ...config
        };
    }

    /**
     * Generate QR Code for a batch
     * @param {string|number} batchId - Batch identifier
     * @param {HTMLElement} container - DOM element to render QR code
     * @param {Object} options - Additional options
     */
    async generateBatchQR(batchId, container, options = {}) {
        try {
            const url = this.createBatchURL(batchId);
            
            // Clear container
            if (container) {
                container.innerHTML = '';
            }

            const qrConfig = {
                ...this.config,
                ...options
            };

            // Generate QR Code
            const qrCode = new QRCode(container, {
                text: url,
                width: qrConfig.width,
                height: qrConfig.height,
                colorDark: qrConfig.colorDark,
                colorLight: qrConfig.colorLight,
                correctLevel: qrConfig.correctLevel
            });

            return {
                success: true,
                url: url,
                qrCode: qrCode
            };

        } catch (error) {
            console.error('QR Code generation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate QR Code with custom data
     * @param {string} data - Data to encode
     * @param {HTMLElement} container - DOM element
     * @param {Object} options - Options
     */
    generateCustomQR(data, container, options = {}) {
        try {
            if (container) {
                container.innerHTML = '';
            }

            const qrConfig = {
                ...this.config,
                ...options
            };

            const qrCode = new QRCode(container, {
                text: data,
                width: qrConfig.width,
                height: qrConfig.height,
                colorDark: qrConfig.colorDark,
                colorLight: qrConfig.colorLight,
                correctLevel: qrConfig.correctLevel
            });

            return {
                success: true,
                qrCode: qrCode
            };

        } catch (error) {
            console.error('Custom QR generation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate QR Code with logo/image in center
     * @param {string} data - Data to encode
     * @param {string} logoURL - Logo image URL
     * @param {HTMLElement} container - Container element
     */
    async generateQRWithLogo(data, logoURL, container) {
        try {
            // Generate base QR code
            const canvas = document.createElement('canvas');
            const qrCode = new QRCode(canvas, {
                text: data,
                width: this.config.width,
                height: this.config.height,
                colorDark: this.config.colorDark,
                colorLight: this.config.colorLight,
                correctLevel: QRCode.CorrectLevel.H // High error correction for logo
            });

            // Wait for QR generation
            await new Promise(resolve => setTimeout(resolve, 100));

            // Get canvas context
            const ctx = canvas.getContext('2d');
            
            // Load and draw logo
            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            
            return new Promise((resolve, reject) => {
                logo.onload = () => {
                    const logoSize = this.config.width * 0.2; // 20% of QR size
                    const logoX = (this.config.width - logoSize) / 2;
                    const logoY = (this.config.height - logoSize) / 2;

                    // Draw white background for logo
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

                    // Draw logo
                    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

                    // Append to container
                    if (container) {
                        container.innerHTML = '';
                        container.appendChild(canvas);
                    }

                    resolve({
                        success: true,
                        canvas: canvas,
                        dataURL: canvas.toDataURL('image/png')
                    });
                };

                logo.onerror = () => {
                    reject(new Error('Failed to load logo'));
                };

                logo.src = logoURL;
            });

        } catch (error) {
            console.error('QR with logo generation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Download QR Code as PNG
     * @param {HTMLElement} qrContainer - Container with QR code
     * @param {string} filename - Download filename
     */
    downloadQRCode(qrContainer, filename = 'qrcode.png') {
        try {
            const canvas = qrContainer.querySelector('canvas');
            
            if (!canvas) {
                throw new Error('QR Code canvas not found');
            }

            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataURL;
            link.click();

            return { success: true };

        } catch (error) {
            console.error('Download failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get QR Code as Data URL
     * @param {HTMLElement} qrContainer - Container with QR code
     */
    getQRDataURL(qrContainer) {
        try {
            const canvas = qrContainer.querySelector('canvas');
            
            if (!canvas) {
                throw new Error('QR Code canvas not found');
            }

            return {
                success: true,
                dataURL: canvas.toDataURL('image/png')
            };

        } catch (error) {
            console.error('Get data URL failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate QR Code for sharing (with metadata)
     * @param {Object} batchData - Batch information
     */
    generateShareableQR(batchData) {
        const shareData = {
            batchId: batchData.id,
            productName: batchData.productName,
            farmer: batchData.farmer,
            url: this.createBatchURL(batchData.id),
            timestamp: new Date().toISOString()
        };

        const dataString = JSON.stringify(shareData);
        return dataString;
    }

    /**
     * Create batch tracking URL
     * @param {string|number} batchId - Batch ID
     */
    createBatchURL(batchId) {
        const baseURL = window.location.origin;
        return `${baseURL}/?batch=${batchId}`;
    }

    /**
     * Generate QR Code for printing (high quality)
     * @param {string} data - Data to encode
     * @param {HTMLElement} container - Container element
     */
    generatePrintQR(data, container) {
        return this.generateCustomQR(data, container, {
            width: 600,
            height: 600,
            correctLevel: QRCode.CorrectLevel.H,
            margin: 6
        });
    }

    /**
     * Batch generate multiple QR codes
     * @param {Array} batchIds - Array of batch IDs
     */
    async generateMultipleQRs(batchIds) {
        const results = [];

        for (const batchId of batchIds) {
            const container = document.createElement('div');
            const result = await this.generateBatchQR(batchId, container);
            
            results.push({
                batchId,
                ...result
            });
        }

        return results;
    }

    /**
     * Generate QR Code with custom styling
     * @param {string} data - Data to encode
     * @param {HTMLElement} container - Container
     * @param {Object} style - Custom style options
     */
    generateStyledQR(data, container, style = {}) {
        const defaultStyle = {
            width: 300,
            height: 300,
            colorDark: "#2ecc71", // Green for agriculture
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        };

        return this.generateCustomQR(data, container, {
            ...defaultStyle,
            ...style
        });
    }

    /**
     * Validate QR Code data
     * @param {string} data - Data to validate
     */
    validateQRData(data) {
        try {
            // Check if data is too long
            const maxLength = 2953; // QR Code max capacity with high error correction
            
            if (data.length > maxLength) {
                return {
                    valid: false,
                    error: 'Data exceeds maximum QR code capacity'
                };
            }

            return { valid: true };

        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    /**
     * Convert canvas to blob for upload
     * @param {HTMLCanvasElement} canvas - Canvas element
     */
    async canvasToBlob(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create blob'));
                }
            }, 'image/png');
        });
    }

    /**
     * Upload QR Code to server
     * @param {HTMLElement} qrContainer - Container with QR code
     * @param {string} batchId - Batch ID
     */
    async uploadQRCode(qrContainer, batchId) {
        try {
            const canvas = qrContainer.querySelector('canvas');
            const blob = await this.canvasToBlob(canvas);

            const formData = new FormData();
            formData.append('qrcode', blob, `batch-${batchId}.png`);
            formData.append('batchId', batchId);

            const response = await fetch('/api/qrcode/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('Upload failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRCodeGenerator;
}

// Example usage:
/*
const qrGen = new QRCodeGenerator({
    width: 400,
    colorDark: "#2ecc71"
});

// Generate batch QR
const container = document.getElementById('qrCode');
qrGen.generateBatchQR(123, container);

// Download QR
qrGen.downloadQRCode(container, 'batch-123-qr.png');

// Generate with logo
qrGen.generateQRWithLogo(
    'https://example.com/batch/123',
    '/images/logo.png',
    container
);
*/