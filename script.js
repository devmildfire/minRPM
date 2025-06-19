
  
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
      // This will only run if all required fields are filled
      event.preventDefault();
      // Your code generation logic here
      alert('Generate function called!');
    }