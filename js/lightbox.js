// Without JS, thumbnails and other image previews are wrapped in links to the full-size image files.
// This script intercept clicks on those links to display the images in a lightbox popup instead.

'use strict';
(function () {
    const overlay = document.querySelector('.overlay');
    const overlayBg = document.querySelector('.overlay-bg');

    const lightbox = document.querySelector('.lightbox');
    const lightboxFigure = document.querySelector('.lightbox figure');
    const lightboxImg = document.querySelector('.lightbox figure img');
    const lightboxCaption = document.querySelector('.lightbox .caption-text');
    const lightboxCaptionLink = document.querySelector('.lightbox .caption-link');

    function hideOverlay() {
        overlayBg.ontransitionend = function () {
            overlay.hidden = true;
        }
        overlay.classList.remove('show');
        lightboxFigure.classList.remove('show');
        lightbox.classList.remove('loading');
    }

    function showOverlay() {
        overlayBg.ontransitionend = null;
        overlay.hidden = false;
        requestAnimationFrame(function () {
            overlay.classList.add('show');
        });
    }
    
    function setLightboxImage(src, caption) {
        lightbox.classList.add('loading');
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightboxCaptionLink.href = src;
    }
    
    // Event handlers
    
    function onThumbnailClick(e, imageUrl, caption) {
        requestAnimationFrame(function () {
            setLightboxImage(imageUrl, caption);
        });
        showOverlay();
        e.preventDefault();
    } 
    
    // In future, it would be nice to implement better keyboard navigation/focus handling;
    // for now, this at least provides some way to close the overlay with the keyboard
    function onKeyDown(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            hideOverlay();
        }
    }
    
    function onOverlayClick (e) {
        // Don't close the overlay when opening links
        if (e.target.tagName !== 'A') {
            hideOverlay();
        }
    }

    function onLightboxImageLoaded() {
        lightbox.classList.remove('loading');
        lightboxFigure.classList.add('show');
    }

    // Assign handlers

    window.addEventListener('keydown', onKeyDown);
    
    overlay.onclick = onOverlayClick;

    lightboxImg.onload = onLightboxImageLoaded;
    lightboxImg.onerror = onLightboxImageLoaded;

    // (Using for...of intentionally doesn't set handlers in IE, where the lightbox flex layout is broken;
    // if that can be fixed, switch to a plain for loop or Array.prototype.forEach.call()))
    for (const element of document.querySelectorAll('.gallery a')) {
        const imageUrl = element.href;
        const caption = element.querySelector('img').alt;
        element.onclick = function (e) {
            onThumbnailClick(e, imageUrl, caption);
        };
    }
}());