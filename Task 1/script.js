// Wait for the page to load before doing anything
document.addEventListener('DOMContentLoaded', function() {
    
    // Handle progress bars - let users click to set values
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach(progress => {
        progress.addEventListener('click', function(e) {
            // Get the position where user clicked
            const rect = progress.getBoundingClientRect();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clickX = clientX - rect.left;
            const progressWidth = rect.width;
            
            // Calculate percentage and make sure its between 0-100
            let percentage = (clickX / progressWidth) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            progress.value = Math.round(percentage);
        });
    });

    // Handle personal info editing
    const infoRows = document.querySelectorAll('.info-row');
    infoRows.forEach(row => {
        const infoValue = row.querySelector('.info-value');
        const infoInput = row.querySelector('.info-input');
        const editBtn = row.querySelector('.edit-btn');
        const saveBtn = row.querySelector('.save-btn');

        // When edit button is clicked
        editBtn.addEventListener('click', function() {
            infoValue.style.display = 'none';
            editBtn.style.display = 'none';
            infoInput.style.display = 'block';
            saveBtn.style.display = 'flex';
            infoInput.focus();
            infoInput.select(); // Select all text for easy editing
        });

        // Save changes when save button clicked
        saveBtn.addEventListener('click', function() {
            saveChanges();
        });

        // Also save when user presses Enter
        infoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });

        // Cancel editing if user presses Escape
        infoInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                cancelEdit();
            }
        });

        // Helper function to save the changes
        function saveChanges() {
            const newValue = infoInput.value.trim();
            if (newValue !== '') {
                infoValue.textContent = newValue;
                infoInput.style.display = 'none';
                saveBtn.style.display = 'none';
                infoValue.style.display = 'block';
                editBtn.style.display = 'flex';
                infoInput.value = newValue; // Keep the input value in sync
            }
        }

        // Helper function to cancel editing
        function cancelEdit() {
            infoInput.value = infoValue.textContent; // Reset to original value
            infoInput.style.display = 'none';
            saveBtn.style.display = 'none';
            infoValue.style.display = 'block';
            editBtn.style.display = 'flex';
        }
    });

    // Handle about section collapse/expand
    const aboutSection = document.querySelector('.about-section');
    const sectionHeader = aboutSection.querySelector('.section-header');
    const aboutContent = aboutSection.querySelector('.about-content');
    const toggleBtn = aboutSection.querySelector('.toggle-btn');
    const toggleIcon = aboutSection.querySelector('.toggle-icon');
    let isCollapsed = false; // Track current state

    function toggleAboutSection() {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            aboutContent.classList.add('collapsed');
            toggleIcon.classList.add('rotated');
            toggleBtn.title = 'Expand section';
        } else {
            aboutContent.classList.remove('collapsed');
            toggleIcon.classList.remove('rotated');
            toggleBtn.title = 'Collapse section';
        }
    }

    // Add click handlers
    sectionHeader.addEventListener('click', toggleAboutSection);
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent double triggering
        toggleAboutSection();
    });

    // Handle work experience reordering
    const workHistorySection = document.querySelector('.work-history');

    // Get all job entries as an array
    function getJobEntries() {
        return Array.from(workHistorySection.querySelectorAll('.job-entry'));
    }

    // Update the data-index attributes after reordering
    function updateJobEntryIndices() {
        const entries = getJobEntries();
        entries.forEach((entry, idx) => {
            entry.setAttribute('data-index', idx);
        });
    }

    // Enable/disable move buttons based on position
    function updateMoveButtons() {
        const entries = getJobEntries();
        entries.forEach((entry, index) => {
            const moveUpBtn = entry.querySelector('.move-up');
            const moveDownBtn = entry.querySelector('.move-down');
            
            // Cant move up if at top, cant move down if at bottom
            moveUpBtn.disabled = index === 0;
            moveDownBtn.disabled = index === entries.length - 1;
        });
    }

    // Move a job entry up or down
    function moveJobEntry(entry, direction) {
        const entries = getJobEntries();
        const currentIndex = entries.indexOf(entry);
        let newIndex;
        
        if (direction === 'up' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < entries.length - 1) {
            newIndex = currentIndex + 1;
        } else {
            return; // Cant move in this direction
        }
        
        const targetEntry = entries[newIndex];
        if (direction === 'up') {
            workHistorySection.insertBefore(entry, targetEntry);
        } else {
            workHistorySection.insertBefore(entry, targetEntry.nextSibling);
        }
        
        // Update everything after moving
        updateJobEntryIndices();
        updateMoveButtons();
    }

    // Add event listeners to move buttons
    function addMoveButtonListeners() {
        getJobEntries().forEach(entry => {
            const moveUpBtn = entry.querySelector('.move-up');
            const moveDownBtn = entry.querySelector('.move-down');
            
            // Remove old listeners by cloning the buttons
            const upClone = moveUpBtn.cloneNode(true);
            const downClone = moveDownBtn.cloneNode(true);
            moveUpBtn.parentNode.replaceChild(upClone, moveUpBtn);
            moveDownBtn.parentNode.replaceChild(downClone, moveDownBtn);
            
            // Add new listeners
            upClone.addEventListener('click', function(e) {
                e.stopPropagation();
                moveJobEntry(entry, 'up');
                addMoveButtonListeners(); // Re-attach listeners after move
            });
            downClone.addEventListener('click', function(e) {
                e.stopPropagation();
                moveJobEntry(entry, 'down');
                addMoveButtonListeners(); // Re-attach listeners after move
            });
        });
    }

    // Initialize everything
    updateJobEntryIndices();
    updateMoveButtons();
    addMoveButtonListeners();
}); 