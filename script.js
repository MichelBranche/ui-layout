/* UI Layout - script.js
   Features:
   - Filter orders table (search + status)
   - Modal "New project" (open/close, ESC, click backdrop)
   - Small toast messages
*/

(() => {
  "use strict";

  // Helpers
  const $ = (sel, root = document) => root.querySelector(sel);

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  // Orders filtering
  function initOrdersFilter() {
    const search = $("#ordersSearch");
    const statusSelect = $("#statusFilter");
    const clearBtn = $("#clearFilters");
    const tbody = $("#ordersTbody");
    const noRow = $("#noResultsRow");

    if (!search || !statusSelect || !clearBtn || !tbody || !noRow) return;

    const rows = Array.from(tbody.querySelectorAll("tr")).filter(r => r.id !== "noResultsRow");

    function applyFilters() {
      const q = search.value.trim().toLowerCase();
      const status = statusSelect.value;

      let visibleCount = 0;

      rows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();
        const rowStatus = row.dataset.status || "";

        const matchQuery = q === "" ? true : rowText.includes(q);
        const matchStatus = status === "all" ? true : rowStatus === status;

        const visible = matchQuery && matchStatus;
        row.hidden = !visible;

        if (visible) visibleCount += 1;
      });

      noRow.hidden = visibleCount !== 0;
    }

    search.addEventListener("input", applyFilters);
    statusSelect.addEventListener("change", applyFilters);

    clearBtn.addEventListener("click", () => {
      search.value = "";
      statusSelect.value = "all";
      applyFilters();
      showToast("Filters cleared");
    });

    applyFilters();
  }

  // Modal
  function initModal() {
    const openBtn = $("#newProject");
    const backdrop = $("#modalBackdrop");
    const modal = $("#projectModal");
    const closeBtn = $("#closeModal");
    const cancelBtn = $("#cancelModal");
    const form = $("#projectForm");
    const nameInput = $("#projectName");
    const descInput = $("#projectDesc");

    if (!openBtn || !backdrop || !modal || !closeBtn || !cancelBtn || !form || !nameInput || !descInput) return;

    let lastFocus = null;

    function openModal() {
      lastFocus = document.activeElement;

      backdrop.hidden = false;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");

      // Focus first field
      nameInput.focus();
      showToast("Modal opened");
    }

    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      modal.hidden = true;
      backdrop.hidden = true;

      // restore focus
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    // click outside closes
    backdrop.addEventListener("click", closeModal);

    // ESC closes
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const desc = descInput.value.trim();

      if (!name) {
        nameInput.focus();
        return;
      }

      // Demo behavior
      closeModal();
      showToast(`Project created: ${name}`);

      // reset fields
      nameInput.value = "";
      descInput.value = "";
    });
  }

  // Quick actions demo
  function initQuickActions() {
    const report = $("#createReport");
    const invite = $("#inviteUser");
    const viewAll = $("#viewAll");

    if (report) report.addEventListener("click", () => showToast("Report created (demo)"));
    if (invite) invite.addEventListener("click", () => showToast("Invite sent (demo)"));
    if (viewAll) viewAll.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("View all (demo)");
    });
  }

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    initOrdersFilter();
    initModal();
    initQuickActions();
  });
})();

