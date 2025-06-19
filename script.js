
  
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

      // Size select
      const sizeLabel = document.createElement('label');
      sizeLabel.innerText = ' Size: ';
      const sizeSelect = document.createElement('select');
      sizeSelect.name = `adUnitSize${adUnitCount}`;
      sizeSelect.required = true;
      ['728x90', '300x250', '160x600'].forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.innerText = size;
        sizeSelect.appendChild(option);
      });

      // Fallback code textarea
      const fallbackLabel = document.createElement('label');
      fallbackLabel.innerText = ' Fallback Code: ';
      const fallbackTextarea = document.createElement('textarea');
      fallbackTextarea.name = `adUnitFallback${adUnitCount}`;
      fallbackTextarea.rows = 5;
      fallbackTextarea.cols = 60;
      fallbackTextarea.placeholder = placeholder;


        // Add the delete button
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function() {
        group.remove();
      };

      // Append all to group
      group.appendChild(idLabel);
      group.appendChild(idInput);
      group.appendChild(sizeLabel);
      group.appendChild(sizeSelect);
      group.appendChild(fallbackLabel);
      group.appendChild(document.createElement('br'));
      group.appendChild(fallbackTextarea);
      group.appendChild(deleteButton);

      container.appendChild(group);
    }

    // Add the first ad-unit field set on load
    window.onload = addAdUnit;

    function generateAdUnits(event) {
      event.preventDefault();
      const groups = document.querySelectorAll('.ad-unit-group');
      const outputArea = document.getElementById('outputArea');
      outputArea.innerHTML = '';
      
      if (groups.length === 0) {
        outputArea.innerHTML = '<p>No ad units to generate</p>';
        return;
      }
      
      groups.forEach(group => {
        const idInput = group.querySelector('input[type="number"]');
        const sizeSelect = group.querySelector('select');
        const fallbackTextarea = group.querySelector('textarea');
        
        if (!idInput.value) {
          alert('Please fill Ad-Unit ID for all units');
          return;
        }
        
        // Escape fallback code for data attributes
        const safeFallbackCode = escapeForDataAttribute(fallbackTextarea.value);
        
        // Create output element
        const unitOutput = document.createElement('div');
        unitOutput.className = 'generated-unit';
        unitOutput.innerHTML = `
          <h3>Ad Unit ID: ${idInput.value}</h3>
          <p>Size: ${sizeSelect.value}</p>
          <p>Safe Fallback Code:</p>
          <pre>${safeFallbackCode}</pre>
        `;
        
        outputArea.appendChild(unitOutput);
      });
    }
    

        // Function to escape strings for data attributes
    function escapeForDataAttribute(unsafeString) {
      return unsafeString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/\//g, "&#x2F;");
    }