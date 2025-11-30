// Global flag to signal when WASM is ready
window.wasmReady = false;

// Load Brotli decompression library
async function initWasmCombiner() {
  try {
    console.log('[WASM Combiner] Loading Brotli decompression library...');
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/brotli@1.3.3/decode.min.js';
      script.onload = resolve;
      script.onerror = () => {
        console.warn('[WASM Combiner] Brotli library failed to load');
        resolve();
      };
      document.head.appendChild(script);
    });
    
    await combineWasmParts();
  } catch (error) {
    console.error('[WASM Combiner] Init error:', error);
  }
}

// Decompress Brotli data if available
function tryDecompressBrotli(compressedData) {
  try {
    if (typeof brotli !== 'undefined' && brotli.decompress) {
      const result = brotli.decompress(new Uint8Array(compressedData));
      console.log('[WASM Combiner] Brotli decompressed');
      return result;
    }
  } catch (e) {
    console.warn('[WASM Combiner] Brotli decompression failed:', e.message);
  }
  return new Uint8Array(compressedData);
}

// Combine split WASM parts
async function combineWasmParts() {
  try {
    console.log('[WASM Combiner] Starting WASM part combination...');
    
    // Fetch all 3 parts in parallel
    const [part1Res, part2Res, part3Res] = await Promise.all([
      fetch('Build/tankstars.wasm.part1'),
      fetch('Build/tankstars.wasm.part2'),
      fetch('Build/tankstars.wasm.part3')
    ]);
    
    if (!part1Res.ok || !part2Res.ok || !part3Res.ok) {
      throw new Error('Failed to fetch WASM parts');
    }
    
    const [part1Buf, part2Buf, part3Buf] = await Promise.all([
      part1Res.arrayBuffer(),
      part2Res.arrayBuffer(),
      part3Res.arrayBuffer()
    ]);
    
    const size1 = (part1Buf.byteLength / 1024 / 1024).toFixed(1);
    const size2 = (part2Buf.byteLength / 1024 / 1024).toFixed(1);
    const size3 = (part3Buf.byteLength / 1024 / 1024).toFixed(1);
    console.log(`[WASM Combiner] Fetched: ${size1}MB + ${size2}MB + ${size3}MB`);
    
    // Decompress each part individually
    const part1 = tryDecompressBrotli(part1Buf);
    const part2 = tryDecompressBrotli(part2Buf);
    const part3 = tryDecompressBrotli(part3Buf);
    
    const dSize1 = (part1.length / 1024 / 1024).toFixed(1);
    const dSize2 = (part2.length / 1024 / 1024).toFixed(1);
    const dSize3 = (part3.length / 1024 / 1024).toFixed(1);
    console.log(`[WASM Combiner] Decompressed: ${dSize1}MB + ${dSize2}MB + ${dSize3}MB`);
    
    // Combine into single WASM blob
    const combinedBlob = new Blob([part1, part2, part3], { type: 'application/wasm' });
    const wasmUrl = URL.createObjectURL(combinedBlob);
    
    const cSize = (combinedBlob.size / 1024 / 1024).toFixed(1);
    console.log(`[WASM Combiner] Combined: ${cSize}MB blob`);
    
    // Wait for config to be available and inject WASM URL
    let attempts = 0;
    const injectInterval = setInterval(() => {
      if (typeof config !== 'undefined') {
        config.codeUrl = wasmUrl;
        console.log('[WASM Combiner] ✓ WASM URL injected into config');
        clearInterval(injectInterval);
        
        // Signal that WASM is ready - game loader can now start
        window.wasmReady = true;
        console.log('[WASM Combiner] ✓ WASM READY - game loader can now start');
      } else if (++attempts > 200) {
        console.error('[WASM Combiner] Failed to inject: config not available');
        clearInterval(injectInterval);
        window.wasmReady = true; // Allow loader to start anyway
      }
    }, 10);
    
  } catch (error) {
    console.error('[WASM Combiner] ✗ Error:', error);
    window.wasmReady = true; // Allow loader to start anyway on error
  }
}

// Start initialization immediately
initWasmCombiner();
