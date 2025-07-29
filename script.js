document.addEventListener('DOMContentLoaded', function() {
    // --- Progress Bar: Click to Set Value ---
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach(progress => {
        progress.addEventListener('click', function(e) {
            const rect = progress.getBoundingClientRect();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clickX = clientX - rect.left;
            const progressWidth = rect.width;
            let percentage = (clickX / progressWidth) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            progress.value = Math.round(percentage);
        });
    });

    // --- Personal Info: Edit and Save Functionality ---
    const infoRows = document.querySelectorAll('.info-row');
    infoRows.forEach(row => {
        const infoValue = row.querySelector('.info-value');
        const infoInput = row.querySelector('.info-input');
        const editBtn = row.querySelector('.edit-btn');
        const saveBtn = row.querySelector('.save-btn');

        // Edit button click
        editBtn.addEventListener('click', function() {
            infoValue.style.display = 'none';
            editBtn.style.display = 'none';
            infoInput.style.display = 'block';
            saveBtn.style.display = 'flex';
            infoInput.focus();
            infoInput.select();
        });

        // Save button click
        saveBtn.addEventListener('click', function() {
            saveChanges();
        });

        // Enter key press in input field
        infoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });

        // Escape key press in input field
        infoInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                cancelEdit();
            }
        });

        function saveChanges() {
            const newValue = infoInput.value.trim();
            if (newValue !== '') {
                infoValue.textContent = newValue;
                infoInput.style.display = 'none';
                saveBtn.style.display = 'none';
                infoValue.style.display = 'block';
                editBtn.style.display = 'flex';
                infoInput.value = newValue;
            }
        }

        function cancelEdit() {
            infoInput.value = infoValue.textContent;
            infoInput.style.display = 'none';
            saveBtn.style.display = 'none';
            infoValue.style.display = 'block';
            editBtn.style.display = 'flex';
        }
    });

    // --- About Section: Toggle Collapse/Expand ---
    const aboutSection = document.querySelector('.about-section');
    const sectionHeader = aboutSection.querySelector('.section-header');
    const aboutContent = aboutSection.querySelector('.about-content');
    const toggleBtn = aboutSection.querySelector('.toggle-btn');
    const toggleIcon = aboutSection.querySelector('.toggle-icon');
    let isCollapsed = false;

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

    sectionHeader.addEventListener('click', toggleAboutSection);
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent double triggering
        toggleAboutSection();
    });

    // --- Work Experience: Move Entries Up/Down ---
    const workHistorySection = document.querySelector('.work-history');

    function getJobEntries() {
        return Array.from(workHistorySection.querySelectorAll('.job-entry'));
    }

    function updateJobEntryIndices() {
        const entries = getJobEntries();
        entries.forEach((entry, idx) => {
            entry.setAttribute('data-index', idx);
        });
    }

    function updateMoveButtons() {
        const entries = getJobEntries();
        entries.forEach((entry, index) => {
            const moveUpBtn = entry.querySelector('.move-up');
            const moveDownBtn = entry.querySelector('.move-down');
            moveUpBtn.disabled = index === 0;
            moveDownBtn.disabled = index === entries.length - 1;
        });
    }

    function moveJobEntry(entry, direction) {
        const entries = getJobEntries();
        const currentIndex = entries.indexOf(entry);
        let newIndex;
        if (direction === 'up' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < entries.length - 1) {
            newIndex = currentIndex + 1;
        } else {
            return;
        }
        const targetEntry = entries[newIndex];
        if (direction === 'up') {
            workHistorySection.insertBefore(entry, targetEntry);
        } else {
            workHistorySection.insertBefore(entry, targetEntry.nextSibling);
        }
        updateJobEntryIndices();
        updateMoveButtons();
    }

    function addMoveButtonListeners() {
        getJobEntries().forEach(entry => {
            const moveUpBtn = entry.querySelector('.move-up');
            const moveDownBtn = entry.querySelector('.move-down');
            // Remove previous listeners by cloning
            const upClone = moveUpBtn.cloneNode(true);
            const downClone = moveDownBtn.cloneNode(true);
            moveUpBtn.parentNode.replaceChild(upClone, moveUpBtn);
            moveDownBtn.parentNode.replaceChild(downClone, moveDownBtn);
            upClone.addEventListener('click', function(e) {
                e.stopPropagation();
                moveJobEntry(entry, 'up');
                addMoveButtonListeners(); // re-attach listeners after move
            });
            downClone.addEventListener('click', function(e) {
                e.stopPropagation();
                moveJobEntry(entry, 'down');
                addMoveButtonListeners(); // re-attach listeners after move
            });
        });
    }

    // Initial setup
    updateJobEntryIndices();
    updateMoveButtons();
    addMoveButtonListeners();
}); 