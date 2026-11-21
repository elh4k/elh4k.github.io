function initializeMemberDossiers() {
	const grid = document.querySelector("#tim .team-grid");
	const dialog = document.querySelector("#member-dossier");
	if (!grid || typeof dialog?.showModal !== "function") {
		return;
	}

	const path = dialog.querySelector(".window__title");
	const body = dialog.querySelector(".dossier__body");
	const identity = dialog.querySelector("[data-dossier-identity]");
	const fields = dialog.querySelectorAll("[data-dossier-field]");
	let opener = null;
	let pointerStartedOnBackdrop = false;

	grid.addEventListener("click", (event) => {
		const button = event.target.closest?.(".member__open");
		if (!button || dialog.open) {
			return;
		}

		const card = button.closest(".card");
		const profile = card.querySelector(".member__top").cloneNode(true);
		profile.querySelector(".member__name").id = "member-dossier-name";
		identity.replaceChildren(profile);
		path.textContent = card.querySelector(".window__title").textContent;

		for (const field of fields) {
			const source = card.querySelector(field.dataset.dossierField);
			field.parentElement.hidden = !source;
			if (source) {
				field.replaceChildren(source.cloneNode(true));
			} else {
				field.replaceChildren();
			}
		}

		opener = button;
		dialog.showModal();
		body.scrollTop = 0;
	});

	function isBackdrop(event) {
		if (event.target !== dialog) {
			return false;
		}

		const { top, right, bottom, left } = dialog.getBoundingClientRect();
		return event.clientX < left || event.clientX >= right ||
			event.clientY < top || event.clientY >= bottom;
	}

	dialog.addEventListener("pointerdown", (event) => {
		pointerStartedOnBackdrop = isBackdrop(event);
	});

	dialog.addEventListener("click", (event) => {
		if (pointerStartedOnBackdrop && isBackdrop(event)) {
			dialog.close();
		}
		pointerStartedOnBackdrop = false;
	});

	dialog.addEventListener("close", () => {
		if (dialog.open) {
			return;
		}
		const button = opener;
		opener = null;
		pointerStartedOnBackdrop = false;
		button?.focus({ preventScroll: true });
	});

	for (const button of grid.querySelectorAll(".member__open")) {
		button.hidden = false;
	}
	grid.classList.add("team-grid--dialog");
}

initializeMemberDossiers();
