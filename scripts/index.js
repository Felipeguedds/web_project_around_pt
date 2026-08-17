const initialCards = [
  {
    name: "Vale de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
  },
  {
    name: "Montanhas Carecas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg",
  },
  {
    name: "Parque Nacional Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-popup");
const editModalCloseButton = editModal.querySelector(".popup__close");
const editModalForm = editModal.querySelector("#edit-profile-form");
const editModalNameInput = editModal.querySelector(".popup__input_type_name");
const editModalDescriptionInput = editModal.querySelector(
  ".popup__input_type_description"
);

const profileAddButton = document.querySelector(".profile__add-button");

const cardModal = document.querySelector("#new-card-popup");
const cardModalCloseButton = cardModal.querySelector(".popup__close");
const cardModalForm = cardModal.querySelector("#new-card-form");
const cardModalNameInput = cardModal.querySelector(
  ".popup__input_type_card-name"
);
const cardModalLinkInput = cardModal.querySelector(".popup__input_type_url");

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".popup_is-opened");
    closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function fillProfileForm() {
  editModalNameInput.value = profileTitle.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
}

function handleOpenEditModal() {
  fillProfileForm();
  resetValidation(editModalForm, validationConfig);
  openModal(editModal);
}

function handleCloseEditModal() {
  closeModal(editModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

profileEditButton.addEventListener("click", handleOpenEditModal);
editModalCloseButton.addEventListener("click", handleCloseEditModal);
editModalForm.addEventListener("submit", handleProfileFormSubmit);

function handleOpenCardModal() {
  cardModalForm.reset();
  resetValidation(cardModalForm, validationConfig);
  openModal(cardModal);
}

function handleCloseCardModal() {
  closeModal(cardModal);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderCard(cardModalNameInput.value, cardModalLinkInput.value, cardsList);
  closeModal(cardModal);
  cardModalForm.reset();
}

profileAddButton.addEventListener("click", handleOpenCardModal);
cardModalCloseButton.addEventListener("click", handleCloseCardModal);
cardModalForm.addEventListener("submit", handleCardFormSubmit);

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

const imageModal = document.querySelector("#image-popup");
const imageModalImage = imageModal.querySelector(".popup__image");
const imageModalCaption = imageModal.querySelector(".popup__caption");
const imageModalCloseButton = imageModal.querySelector(".popup__close");

function handleImageClick(name, link) {
  imageModalImage.src = link;
  imageModalImage.alt = name;
  imageModalCaption.textContent = name;
  openModal(imageModal);
}

function handleCloseImageModal() {
  closeModal(imageModal);
}

imageModalCloseButton.addEventListener("click", handleCloseImageModal);

function handleOverlayClose(evt) {
  if (evt.target.classList.contains("popup")) {
    closeModal(evt.target);
  }
}

const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  popup.addEventListener("mousedown", handleOverlayClose);
});

function getCardElement(name, link) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;

  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_is-active");
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    handleImageClick(name, link);
  });

  return cardElement;
}

function renderCard(name, link, container) {
  container.prepend(getCardElement(name, link));
}

initialCards.forEach(function (item) {
  renderCard(item.name, item.link, cardsList);
});
