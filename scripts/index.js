import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import { openModal, closeModal, handleOverlayClose } from "./utils.js";

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

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const cardTemplateSelector = "#card-template";
const cardsList = document.querySelector(".cards__list");

const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-popup");
const editModalCloseButton = editModal.querySelector(".popup__close");
const editModalForm = editModal.querySelector("#edit-profile-form");
const editModalNameInput = editModal.querySelector(".popup__input_type_name");
const editModalDescriptionInput = editModal.querySelector(
  ".popup__input_type_description"
);

const cardModal = document.querySelector("#new-card-popup");
const cardModalCloseButton = cardModal.querySelector(".popup__close");
const cardModalForm = cardModal.querySelector("#new-card-form");
const cardModalNameInput = cardModal.querySelector(
  ".popup__input_type_card-name"
);
const cardModalLinkInput = cardModal.querySelector(".popup__input_type_url");

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

function renderCard(data) {
  const card = new Card(data, cardTemplateSelector, handleImageClick);
  cardsList.prepend(card.generateCard());
}

initialCards.forEach((item) => renderCard(item));

const editFormValidator = new FormValidator(validationConfig, editModalForm);
editFormValidator.setEventListeners();

const cardFormValidator = new FormValidator(validationConfig, cardModalForm);
cardFormValidator.setEventListeners();

function fillProfileForm() {
  editModalNameInput.value = profileTitle.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
}

function handleOpenEditModal() {
  fillProfileForm();
  editFormValidator.resetValidation();
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

function handleOpenCardModal() {
  cardModalForm.reset();
  cardFormValidator.resetValidation();
  openModal(cardModal);
}

function handleCloseCardModal() {
  closeModal(cardModal);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderCard({
    name: cardModalNameInput.value,
    link: cardModalLinkInput.value,
  });
  closeModal(cardModal);
  cardModalForm.reset();
}

function handleCloseImageModal() {
  closeModal(imageModal);
}

profileEditButton.addEventListener("click", handleOpenEditModal);
editModalCloseButton.addEventListener("click", handleCloseEditModal);
editModalForm.addEventListener("submit", handleProfileFormSubmit);

profileAddButton.addEventListener("click", handleOpenCardModal);
cardModalCloseButton.addEventListener("click", handleCloseCardModal);
cardModalForm.addEventListener("submit", handleCardFormSubmit);

imageModalCloseButton.addEventListener("click", handleCloseImageModal);

const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  popup.addEventListener("mousedown", handleOverlayClose);
});
