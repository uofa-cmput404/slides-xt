document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
        const heading = section.querySelector('h3');
        const codeBlock = section.querySelector('pre > code');

        // I only want the copy button in slides with these headings
        if (heading && (heading.textContent.includes('Arrow Functions') || heading.textContent.includes('This Example 2'))) {
            if (codeBlock) {
                const button = document.createElement('button');
                button.textContent = 'Copy Code';
                button.style.display = 'block';
                button.style.marginTop = '10px';

                codeBlock.parentNode.insertAdjacentElement('afterend', button); // Place it below the code block

                button.addEventListener('click', function() {
                    const textarea = document.createElement('textarea');
                    textarea.value = codeBlock.innerText;

                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy'); // Deprecated but still works in many browsers, might need to change it in the future though
                    document.body.removeChild(textarea);

                    showToast(button, 'Code copied to clipboard!');
                });
            }
        }
    });
});

// Custom function to create and show a toast notification
function showToast(button, message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'absolute';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.borderRadius = '5px';
    toast.style.padding = '10px 20px';
    toast.style.zIndex = '1000';
    toast.style.transition = 'opacity 0.5s';
    toast.style.opacity = '1';

    // Display the toast somewhere below the button
    const buttonRect = button.getBoundingClientRect();
    toast.style.top = `${buttonRect.bottom + window.scrollY + 10}px`;
    toast.style.left = `${buttonRect.left}px`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 2000);
}

