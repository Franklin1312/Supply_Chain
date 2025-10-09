class QRCodeGenerator {
    constructor(config = {}) {
        this.config = {
            width: config.width || 300,
            height: config.height || 300,
            colorDark: config.colorDark || "#2ecc71",
            colorLight: config.colorLight || "#ffffff",
            correctLevel: config.correctLevel || QRCode.CorrectLevel.H,
            margin: config.margin || 4,
            ...config
        };
    }

    /**
     * Generate QR Code for a batch - FIXED: No URL, just batch data
     * @param {string|number} batchId - Batch identifier
     * @param {HTMLElement} container - DOM element to render QR code
     * @param {Object} options - Additional options
     */
    async generateBatchQR(batchId, container, options = {}) {
        try {
            // FIXED: Generate JSON data with batch ID only (NO URL)
            const qrData = JSON.stringify({
                batchId: batchId.toString(),
                action: "download_batch",
                timestamp: Date.now()
            });
            
            console.log('🔧 Generating QR with data:', qrData);
            
            // Clear container
            if (container) {
                container.innerHTML = '';
            }

            const qrConfig = {
                ...this.config,
                ...options
            };

            // Create wrapper for better styling
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: inline-block;
                padding: 1.5rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
            `;

            // Add title
            const title = document.createElement('h3');
            title.textContent = `Batch #${batchId}`;
            title.style.cssText = `
                margin: 0 0 1rem 0;
                color: #2c3e50;
                font-size: 1.2rem;
            `;
            wrapper.appendChild(title);

            // Create QR container
            const qrContainer = document.createElement('div');
            qrContainer.id = `qr-batch-${batchId}`;
            qrContainer.style.marginBottom = '1rem';
            wrapper.appendChild(qrContainer);

            // Generate QR Code with batch data (NO URL)
            const qrCode = new QRCode(qrContainer, {
                text: qrData,
                width: qrConfig.width,
                height: qrConfig.height,
                colorDark: qrConfig.colorDark,
                colorLight: qrConfig.colorLight,
                correctLevel: qrConfig.correctLevel
            });

            // Add instructions
            const instructions = document.createElement('p');
            instructions.innerHTML = `
                <strong style="color: #27ae60;">📱 Scan to Download</strong><br>
                <span style="color: #7f8c8d; font-size: 0.9rem;">
                Use "Scan QR" button to automatically<br>download batch information
                </span>
            `;
            instructions.style.margin = '0.5rem 0';
            wrapper.appendChild(instructions);

            // Add batch ID display
            const batchIdDisplay = document.createElement('div');
            batchIdDisplay.textContent = `ID: ${batchId}`;
            batchIdDisplay.style.cssText = `
                margin-top: 0.5rem;
                padding: 0.5rem;
                background: #ecf0f1;
                border-radius: 6px;
                font-weight: bold;
                color: #2c3e50;
                font-size: 0.9rem;
            `;
            wrapper.appendChild(batchIdDisplay);

            container.appendChild(wrapper);

            console.log('✅ QR Code generated successfully (no URL)');

            return {
                success: true,
                data: qrData,
                qrCode: qrCode
            };

        } catch (error) {
            console.error('❌ QR Code generation failed:', error);
            if (container) {
                container.innerHTML = `
                    <div style="color: #e74c3c; padding: 1rem;">
                        <i class="fas fa-exclamation-triangle"></i>
                        Failed to generate QR code
                    </div>
                `;
            }
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate QR Code with custom data (NO URL)
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
     * Generate simple QR with just batch ID number
     * @param {string|number} batchId - Batch ID
     * @param {HTMLElement} container - Container element
     */
    generateSimpleBatchQR(batchId, container) {
        try {
            console.log('🔧 Generating simple QR for batch:', batchId);
            
            // Just the batch ID as plain text (no URL, no JSON)
            const qrData = batchId.toString();
            
            if (container) {
                container.innerHTML = '';
            }

            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                display: inline-block;
                padding: 1.5rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
            `;

            const title = document.createElement('h3');
            title.textContent = `Batch #${batchId}`;
            title.style.cssText = 'margin: 0 0 1rem 0; color: #2c3e50;';
            wrapper.appendChild(title);

            const qrContainer = document.createElement('div');
            wrapper.appendChild(qrContainer);

            new QRCode(qrContainer, {
                text: qrData,
                width: this.config.width,
                height: this.config.height,
                colorDark: this.config.colorDark,
                colorLight: this.config.colorLight,
                correctLevel: this.config.correctLevel
            });

            const info = document.createElement('p');
            info.textContent = 'Scan to download batch info';
            info.style.cssText = 'margin: 1rem 0 0 0; color: #7f8c8d; font-size: 0.9rem;';
            wrapper.appendChild(info);

            container.appendChild(wrapper);

            console.log('✅ Simple QR generated (no URL)');

            return { success: true };

        } catch (error) {
            console.error('Simple QR generation failed:', error);
            return { success: false, error: error.message };
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
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('✅ QR Code downloaded:', filename);

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
     * DEPRECATED: Use generateBatchQR instead (no URL generation)
     * @param {string|number} batchId - Batch ID
     */
    createBatchURL(batchId) {
        console.warn('⚠️ createBatchURL is deprecated - QR codes now use batch IDs only');
        return batchId.toString();
    }

    /**
     * Generate QR Code for printing (high quality)
     * @param {string|number} batchId - Batch ID
     * @param {HTMLElement} container - Container element
     */
    generatePrintQR(batchId, container) {
        const qrData = JSON.stringify({
            batchId: batchId.toString(),
            action: "download_batch"
        });

        return this.generateCustomQR(qrData, container, {
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
     * @param {string|number} batchId - Batch ID
     * @param {HTMLElement} container - Container
     * @param {Object} style - Custom style options
     */
    generateStyledQR(batchId, container, style = {}) {
        const qrData = JSON.stringify({
            batchId: batchId.toString(),
            action: "download_batch"
        });

        const defaultStyle = {
            width: 300,
            height: 300,
            colorDark: "#2ecc71", // Green for agriculture
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        };

        return this.generateCustomQR(qrData, container, {
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
     * Convert canvas to blob for upload/download
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
}

// Make available globally
if (typeof window !== 'undefined') {
    window.QRCodeGenerator = QRCodeGenerator;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRCodeGenerator;
}

console.log('✅ QR Code Generator loaded (Fixed - No URL redirects)');

// Example usage:
/*
const qrGen = new QRCodeGenerator({
    width: 400,
    colorDark: "#2ecc71"
});

// Generate batch QR (no URL, just batch data)
const container = document.getElementById('qrCode');
qrGen.generateBatchQR(123, container);

// Download QR
qrGen.downloadQRCode(container, 'batch-123-qr.png');

// Simple QR with just ID
qrGen.generateSimpleBatchQR(123, container);
*/
