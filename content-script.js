'use strict';

let observer = new MutationObserver(mutations => {
    if (mutations.length > 0) {
        const pageTitleElements = document.getElementsByClassName("title");
        if (pageTitleElements.length > 0) {
            var title = pageTitleElements[0].textContent;
            if (typeof(PageActions[title]) === 'function'){
                PageActions[title](0);
            }
        }
    }
});

observer.observe(document, { childList: true, subtree: true });
