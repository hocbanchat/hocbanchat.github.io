/**
 * Mobile Menu & Sidebar Toggle
 * Xử lý hamburger menu và toggle sidebar trên mobile
 */

(function () {
    'use strict';

    // ===== DOM ELEMENTS =====
    let mobileMenuBtn;
    let mobileNav;
    let mobileNavOverlay;
    let mobileNavClose;
    let sidebarToggleBtn;
    let lessonSidebar;
    let sidebarOverlay;

    // ===== INITIALIZATION =====
    function init() {
        // Chờ DOM load xong
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initElements);
        } else {
            initElements();
        }
    }

    function initElements() {
        // Mobile menu elements
        mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        mobileNav = document.querySelector('.nav-mobile');
        mobileNavOverlay = document.querySelector('.nav-mobile-overlay');
        mobileNavClose = document.querySelector('.nav-mobile-close');

        // Sidebar elements
        sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
        lessonSidebar = document.querySelector('.lesson-sidebar');
        sidebarOverlay = document.querySelector('.sidebar-mobile-overlay');

        // Attach event listeners
        attachEventListeners();
    }

    // ===== EVENT LISTENERS =====
    function attachEventListeners() {
        // Mobile menu toggle
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Mobile menu close button
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMobileMenu);
        }

        // Mobile menu overlay click
        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', closeMobileMenu);
        }

        // Sidebar toggle
        if (sidebarToggleBtn) {
            sidebarToggleBtn.addEventListener('click', toggleSidebar);
        }

        // Sidebar overlay click
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }

        // Quiz Sidebar Toggle
        const quizToggleBtn = document.querySelector('#quiz-sidebar-toggle-btn');
        if (quizToggleBtn) {
            quizToggleBtn.addEventListener('click', toggleQuizSidebar);
        }

        // Close menus on ESC key
        document.addEventListener('keydown', handleEscKey);

        // Close menus on resize to desktop
        window.addEventListener('resize', handleResize);

        // Close mobile menu when clicking a link
        if (mobileNav) {
            const links = mobileNav.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }
    }

    // ===== MOBILE MENU FUNCTIONS =====
    function toggleMobileMenu() {
        if (mobileMenuBtn) mobileMenuBtn.classList.toggle('active');
        if (mobileNav) mobileNav.classList.toggle('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileNav?.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===== SIDEBAR FUNCTIONS =====
    function toggleSidebar() {
        if (lessonSidebar) lessonSidebar.classList.toggle('active');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');

        // Update button icon
        if (sidebarToggleBtn) {
            const isActive = lessonSidebar?.classList.contains('active');
            sidebarToggleBtn.innerHTML = isActive ? '✕' : '📚';
        }

        // Prevent body scroll when sidebar is open
        document.body.style.overflow = lessonSidebar?.classList.contains('active') ? 'hidden' : '';
    }

    // ===== QUIZ SIDEBAR FUNCTIONS =====
    function toggleQuizSidebar() {
        const quizSidebar = document.querySelector('.quiz-sidebar');
        const quizToggleBtn = document.querySelector('#quiz-sidebar-toggle-btn');

        if (quizSidebar) quizSidebar.classList.toggle('active');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');

        // Prevent body scroll
        document.body.style.overflow = quizSidebar?.classList.contains('active') ? 'hidden' : '';
    }

    function closeSidebar() {
        // Close Lesson Sidebar
        if (lessonSidebar) lessonSidebar.classList.remove('active');

        // Close Quiz Sidebar
        const quizSidebar = document.querySelector('.quiz-sidebar');
        if (quizSidebar) quizSidebar.classList.remove('active');

        if (sidebarOverlay) sidebarOverlay.classList.remove('active');

        // Reset toggle icon if needed (mostly for lesson sidebar)
        if (sidebarToggleBtn) sidebarToggleBtn.innerHTML = '📚';

        document.body.style.overflow = '';
    }

    // ===== UTILITY FUNCTIONS =====
    function handleEscKey(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeSidebar();
        }
    }

    function handleResize() {
        // Close mobile elements when resizing to desktop
        if (window.innerWidth > 768) {
            closeMobileMenu();
            closeSidebar();
        }
    }

    // ===== EXPOSE TO GLOBAL SCOPE =====
    window.MobileMenu = {
        toggle: toggleMobileMenu,
        close: closeMobileMenu,
        toggleSidebar: toggleSidebar,
        toggleQuizSidebar: toggleQuizSidebar,
        closeSidebar: closeSidebar
    };

    // Initialize
    init();
})();
