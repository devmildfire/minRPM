
  
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
        
        unitOutput.appendChild(heading);
        unitOutput.appendChild(codeBlock);
        outputArea.appendChild(unitOutput);
      });
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