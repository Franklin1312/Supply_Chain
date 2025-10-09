/**
 * Handle detected QR code data - Auto download batch info
 * @param {string} qrData - Detected QR code data
 */
async function handleQRCodeDetected(qrData) {
    stopQRScanner();
    
    console.log('🔍 QR Data detected:', qrData);
    
    try {
        let batchId = null;
        
        // Try to parse as JSON first
        try {
            const parsedData = JSON.parse(qrData);
            console.log('📦 Parsed JSON:', parsedData);
            
            if (parsedData.batchId) {
                batchId = parsedData.batchId;
            }
        } catch (jsonError) {
            // If not JSON, treat as plain batch ID
            console.log('📝 Not JSON, treating as plain text');
            const trimmedData = qrData.trim();
            if (!isNaN(trimmedData) && trimmedData !== '') {
                batchId = trimmedData;
            }
        }
        
        if (batchId !== null) {
            console.log('✅ Valid batch ID found:', batchId);
            showToast('✅ QR Code detected! Downloading batch information...', 'success');
            
            // Small delay to show the toast message
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Automatically download batch info - NO URL NAVIGATION
            await window.downloadBatchInfo(batchId);
        } else {
            showToast('⚠️ Invalid QR code format', 'warning');
            console.error('❌ Invalid QR data:', qrData);
        }
    } catch (error) {
        console.error('❌ QR handling error:', error);
        showToast('❌ Failed to process QR code: ' + error.message, 'error');
    }
}

/**
 * Stop QR Scanner
 */
function stopQRScanner() {
    qrScannerActive = false;
    
    if (qrStream) {
        qrStream.getTracks().forEach(track => track.stop());
        qrStream = null;
    }
    
    const video = document.getElementById('qrVideo');
    const scannerContainer = document.getElementById('qrScannerContainer');
    
    if (video) {
        video.srcObject = null;
    }
    
    if (scannerContainer) {
        scannerContainer.style.display = 'none';
    }
}

/**
 * Modified downloadBatchInfo function with better error handling
 */
window.downloadBatchInfo = async function(batchId) {
    if (!contract) {
        showToast('Please connect wallet first', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        // Fetch batch information from blockchain
        const batch = await contract.getBatch(batchId);
        const transactions = await contract.getBatchTransactions(batchId);
        const participants = await contract.getBatchParticipants(batchId);
        
        // Create formatted text content
        const stateNames = ['Created', 'InTransit', 'AtMiddleman', 'InFinalTransit', 'Delivered', 'Sold'];
        
        let textContent = `========================================\n`;
        textContent += `   AGRICULTURAL SUPPLY CHAIN\n`;
        textContent += `        BATCH INFORMATION\n`;
        textContent += `========================================\n\n`;
        
        textContent += `BATCH DETAILS:\n`;
        textContent += `----------------------------------------\n`;
        textContent += `Batch ID: ${batchId}\n`;
        textContent += `Product Name: ${batch[3]}\n`;
        textContent += `Quantity: ${batch[6].toString()} kg\n`;
        textContent += `Farmer Price: ${ethers.formatEther(batch[5])} ETH\n`;
        textContent += `Current State: ${stateNames[Number(batch[7])]}\n`;
        textContent += `Created At: ${new Date(Number(batch[8]) * 1000).toLocaleString()}\n\n`;
        
        textContent += `FARMER INFORMATION:\n`;
        textContent += `----------------------------------------\n`;
        textContent += `Farmer Address: ${batch[1]}\n`;
        textContent += `Current Owner: ${batch[2]}\n\n`;
        
        if (participants.length > 0) {
            textContent += `SUPPLY CHAIN PARTICIPANTS:\n`;
            textContent += `----------------------------------------\n`;
            participants.forEach((addr, index) => {
                textContent += `${index + 1}. ${addr}\n`;
            });
            textContent += `\n`;
        }
        
        if (transactions.length > 0) {
            textContent += `TRANSACTION HISTORY:\n`;
            textContent += `----------------------------------------\n`;
            transactions.forEach((tx, index) => {
                textContent += `\nTransaction ${index + 1}:\n`;
                textContent += `  From: ${tx.from}\n`;
                textContent += `  To: ${tx.to}\n`;
                textContent += `  Amount: ${ethers.formatEther(tx.amount)} ETH\n`;
                textContent += `  Role: ${tx.role}\n`;
                textContent += `  Date: ${new Date(Number(tx.timestamp) * 1000).toLocaleString()}\n`;
                if (tx.description) {
                    textContent += `  Description: ${tx.description}\n`;
                }
            });
            textContent += `\n`;
        }
        
        textContent += `========================================\n`;
        textContent += `Generated: ${new Date().toLocaleString()}\n`;
        textContent += `Verified on ${CONFIG.NETWORK_NAME} Network\n`;
        textContent += `Contract: ${CONFIG.CONTRACT_ADDRESS}\n`;
        textContent += `========================================\n\n`;
        
        textContent += `AUTHENTICITY VERIFICATION:\n`;
        textContent += `This document contains blockchain-verified\n`;
        textContent += `information and can be independently verified\n`;
        textContent += `on the Ethereum blockchain.\n`;
        
        // Download as .txt file
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AgriChain-Batch-${batchId}-${Date.now()}.txt`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('✅ Batch information downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        
        // Better error messages
        if (error.message.includes('Batch not found') || error.message.includes('does not exist')) {
            showToast('❌ Batch ID ' + batchId + ' not found', 'error');
        } else {
            showToast('❌ Failed to download: ' + error.message, 'error');
        }
    } finally {
        showLoading(false);
    }
};

/**
 * Start QR Code Scanner with improved feedback
 */
async function scanQRCode() {
    const scannerContainer = document.getElementById('qrScannerContainer');
    const video = document.getElementById('qrVideo');
    
    try {
        if (!contract) {
            showToast('⚠️ Please connect your wallet first', 'warning');
            return;
        }
        
        // Request camera access
        qrStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        
        video.srcObject = qrStream;
        video.play();
        scannerContainer.style.display = 'block';
        qrScannerActive = true;
        
        showToast('📷 QR Scanner started. Point at QR code', 'info');
        
        // Start scanning
        requestAnimationFrame(scanFrame);
        
    } catch (error) {
        console.error('Camera access error:', error);
        
        if (error.name === 'NotAllowedError') {
            showToast('❌ Camera permission denied. Please allow camera access.', 'error');
        } else if (error.name === 'NotFoundError') {
            showToast('❌ No camera found on this device', 'error');
        } else {
            showToast('❌ Failed to access camera: ' + error.message, 'error');
        }
    }
}

/**
 * Scan frame for QR code
 */
function scanFrame() {
    if (!qrScannerActive) return;
    
    const video = document.getElementById('qrVideo');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
            // QR code detected - process it
            handleQRCodeDetected(code.data);
            return; // Stop scanning after detection
        }
    }
    
    // Continue scanning
    requestAnimationFrame(scanFrame);
}
