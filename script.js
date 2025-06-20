
  
  let adUnitCount = 0;

    function addAdUnit() {


      const placeholder = `<script async src="https://v1.slise.xyz/scripts/embed.js"></script>
<ins
  class="adsbyslise"
  style="display:block;width:728px;height:90px"
  data-ad-slot="leaderboard"
  data-ad-pub="pub-3"
  data-ad-format="728x90"
></ins>
<script>;(adsbyslise=window.adsbyslise||[]).push({slot:"mobile"});window.adsbyslisesync&&window.adsbyslisesync();</script>
`;

      adUnitCount++;
      const container = document.getElementById('adUnitsContainer');

      // Create wrapper div for this ad unit
      const group = document.createElement('div');
      group.className = 'ad-unit-group';
      group.id = `ad-unit-${adUnitCount}`;

      // Numeric ID input
      const idLabel = document.createElement('label');
      idLabel.innerText = 'Ad-Unit ID: ';
      const idInput = document.createElement('input');
      idInput.type = 'number';
      idInput.name = `adUnitId${adUnitCount}`;
      idInput.required = true;

      const numericInputDiv = document.createElement('div'); 
      numericInputDiv.appendChild(idLabel);
      numericInputDiv.appendChild(idInput);


      // Size select
      const sizeLabel = document.createElement('label');
      sizeLabel.innerText = ' Size: ';
      const sizeSelect = document.createElement('select');
      sizeSelect.name = `adUnitSize${adUnitCount}`;
      sizeSelect.required = true;
      ['728x90', '234x60', '300x250'].forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.innerText = size;
        sizeSelect.appendChild(option);
      });

      const sizeInputDiv = document.createElement('div'); 
      sizeInputDiv.appendChild(sizeLabel);
      sizeInputDiv.appendChild(sizeSelect);

      // Fallback code textarea
      const fallbackLabel = document.createElement('label');
      fallbackLabel.innerText = ' Fallback Code: ';
      const fallbackTextarea = document.createElement('textarea');
      fallbackTextarea.name = `adUnitFallback${adUnitCount}`;
      fallbackLabel.classList.add('fallbackTextArea')
      fallbackTextarea.rows = 5;
      fallbackTextarea.cols = 60;
      fallbackTextarea.placeholder = placeholder;


        // Add the delete button
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Delete this input';
      deleteButton.onclick = function() {
        group.remove();
      };

      const buttonDiv = document.createElement('div'); 
      buttonDiv.appendChild(deleteButton);

      // Append all to group
      group.appendChild(numericInputDiv);  
      group.appendChild(sizeInputDiv);
      group.appendChild(fallbackLabel);
      group.appendChild(document.createElement('br'));
      group.appendChild(fallbackTextarea);
      group.appendChild(buttonDiv);

      container.appendChild(group);
    }

    // Add the first ad-unit field set on load
    window.onload = addAdUnit;

    function generateAdUnits(event) {
     event.preventDefault();
      const outputArea = document.getElementById('outputArea');
      outputArea.innerHTML = '';
      
      const groups = document.querySelectorAll('.ad-unit-group');
      if (groups.length === 0) {
        outputArea.innerHTML = '<p>No ad units to generate</p>';
        return;
      }
      
      groups.forEach(group => {
        const idInput = group.querySelector('input[type="number"]');
        const sizeSelect = group.querySelector('select');
        const fallbackTextarea = group.querySelector('textarea');
        
        if (!idInput.value) {
          alert('Ad-Unit ID is required!');
          return;
        }
        
        // Parse dimensions from size
        const [width, height] = sizeSelect.value.split('x').map(Number);
        
        // Escape ONLY the fallback code for data attributes
        const safeFallbackCode = escapeForDataAttribute(fallbackTextarea.value);
        
        // Build human-readable HTML with normal characters
        // Only the data-fallback attribute uses escaped characters
        const htmlString = 
`<div 
  id="aads-ad-container-${idInput.value}" 
  data-src="//dynamic.a-ads.com/${idInput.value}?size=${sizeSelect.value}"
  data-style="width:${width}px; height:${height}px; border:0px; padding:0; overflow:hidden; background-color: transparent;"
  data-fallback="${safeFallbackCode}"
></div>`;
        
        // Create output container
        const unitOutput = document.createElement('div');
        unitOutput.className = 'generated-unit';
        
        const heading = document.createElement('h3');
        heading.textContent = `Ad Unit ID: ${idInput.value}`;
        
        const codeBlock = document.createElement('pre');
        codeBlock.textContent = htmlString;

        // Create copy button for this ad unit
        const copyButton = createCopyButton(htmlString, `ad-unit-${idInput.value}`);
        heading.appendChild(copyButton);
        
        unitOutput.appendChild(heading);
        unitOutput.appendChild(codeBlock);
        outputArea.appendChild(unitOutput);
      });


      const mainScriptString  = `<script>
  document.addEventListener('DOMContentLoaded', function() {

   (function initAds() {

    const containers = document.querySelectorAll('div[id^="aads-ad-container-"]');
    
    containers.forEach(container => {
      loadAd(container);
    });

    async function loadAd(container) {

      const idParts = container.id.split('-');
      const adUnit = idParts[idParts.length - 1];

      console.log(\`[Ad Loader] Loading ad for container \${container.id}\`);

      const adUrl = container.dataset.src || \`//dynamic.a-ads.com/\${adUnit}?size=\${size[0]}x\${size[1]}\`;
      const size = adUrl.split('size=').pop().split('x'); 
      const iframeStyle = container.dataset.style || 'width:300px;height:250px;border:0;padding:0;background:transparent;';

      const fallbackHtml = container.dataset.fallback || '';

      const iframe = document.createElement('iframe');
      iframe.setAttribute('data-aa', adUnit);
      iframe.style.cssText = iframeStyle;

      try {

        const absoluteUrl = new URL(adUrl, location.origin).href;
        const response = await fetch(absoluteUrl);
        let html = await response.text();
              
        if (!html.trim()) throw new Error('Empty ad content');
       
        let metaTags = html.match(/<meta[^>]*>/gi) || [];
        console.log("[Ad Loader] Found meta tags:", metaTags);

        let refreshMatch = html.match(/<meta[^>]+content=['"]?(\\\\d+)['"]?[^>]+http-equiv=['"]?refresh['"]/i);
        let refreshTime = refreshMatch ? parseInt(refreshMatch[1], 10) : 0;
        console.log(\`[Ad Loader] Extracted refresh time: \${refreshTime} seconds\`);

        html = html.replace(/<meta[^>]+http-equiv=['"]?refresh['"][^>]*>/i, '');

        iframe.removeAttribute("src");
        
        container.innerHTML = '';
        container.appendChild(iframe);
        iframe.sandbox = "allow-scripts allow-same-origin allow-popups";
        iframe.srcdoc = html;

        if (refreshTime > 0) {
          setTimeout(() => loadAd(container), refreshTime * 1000);
        }
      } catch (error) {
        console.error(\`[Ad Loader] Error in \${container.id}:\`, error);
          container.innerHTML = fallbackHtml;
          
          const scripts = container.querySelectorAll('script');

          scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
              newScript.src = oldScript.src;
              newScript.async = oldScript.async;
            } else {
              newScript.textContent = oldScript.textContent;
            }

            Array.from(oldScript.attributes).forEach(attr => {
              if (attr.name !== 'src') newScript.setAttribute(attr.name, attr.value);
            });
            oldScript.parentNode.replaceChild(newScript, oldScript);
          });

      }
    }
  })();

})
 
</script>`;

        // Create main script container
        const mainScriptOutput = document.createElement('div');
        mainScriptOutput.className = 'main-script';
        
        const mainHeading = document.createElement('h3');
        mainHeading.textContent = `Main script HTML`;
        
        const mainCodeBlock = document.createElement('pre');
        mainCodeBlock.textContent = mainScriptString;

        // Create copy button for main script
        const mainCopyButton = createCopyButton(mainScriptString, 'main-script');
        
        mainHeading.appendChild(mainCopyButton);
        mainScriptOutput.appendChild(mainHeading);
        mainScriptOutput.appendChild(mainCodeBlock);
        outputArea.appendChild(mainScriptOutput);

    }


    

        // Function to escape strings for data attributes
    function escapeForDataAttribute(unsafeString) {
      return unsafeString
        .replace(/[\n\r\t]/g, '')         
        .replace(/\s{2,}/g, ' ')    
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\//g, "&#x2F;");
    }

    // Function to create copy button with feedback
function createCopyButton(textToCopy, identifier) {
  const copyButton = document.createElement('button');
  copyButton.className = 'copy-code-button';
  copyButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 21H9c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm0-2V7H9v12h10zM5 17H3V5c0-1.1.9-2 2-2h10v2H5v12z"/>
    </svg>
  `;
  
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      
      // Visual feedback
      const originalHTML = copyButton.innerHTML;
      copyButton.innerHTML = 'Copied!';
      copyButton.style.color = '#28a745'; // Green color
      
      // Reset button after 2 seconds
      setTimeout(() => {
        copyButton.innerHTML = originalHTML;
        copyButton.style.color = ''; // Reset to default color
      }, 2000);
      
      console.log(`Copied ${identifier} to clipboard`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      copyButton.innerHTML = 'Copied!';
      setTimeout(() => {
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 21H9c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm0-2V7H9v12h10zM5 17H3V5c0-1.1.9-2 2-2h10v2H5v12z"/>
          </svg>
        `;
      }, 2000);
    }
  });
  
  return copyButton;
}
