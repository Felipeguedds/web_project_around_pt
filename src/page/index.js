import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForms.js";

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

const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const editForm = document.querySelector("#edit-profile-form");
const newCardForm = document.querySelector("#new-card-form");
const editNameInput = document.querySelector(".popup__input_type_name");
const editJobInput = document.querySelector(".popup__input_type_description");

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

const imagePopup = new PopupWithImage("#image-popup");
imagePopup.setEventListeners();

function handleCardClick(name, link) {
  imagePopup.open({ name, link });
}

function createCard(data) {
  const card = new Card(data, cardTemplateSelector, handleCardClick);
  return card.generateCard();
}

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      cardSection.addItem(createCard(item));
    },
  },
  ".cards__list"
);
cardSection.renderItems();

const editPopup = new PopupWithForm("#edit-popup", (values) => {
  userInfo.setUserInfo({ name: values.name, job: values.description });
  editPopup.close();
});
editPopup.setEventListeners();

const cardPopup = new PopupWithForm("#new-card-popup", (values) => {
  cardSection.addItem(
    createCard({ name: values["place-name"], link: values.link })
  );
  cardPopup.close();
});
cardPopup.setEventListeners();

const editFormValidator = new FormValidator(validationConfig, editForm);
editFormValidator.setEventListeners();

const cardFormValidator = new FormValidator(validationConfig, newCardForm);
cardFormValidator.setEventListeners();

function handleOpenEditPopup() {
  const { name, job } = userInfo.getUserInfo();
  editNameInput.value = name;
  editJobInput.value = job;
  editFormValidator.resetValidation();
  editPopup.open();
}

function handleOpenCardPopup() {
  cardFormValidator.resetValidation();
  cardPopup.open();
}

profileEditButton.addEventListener("click", handleOpenEditPopup);
profileAddButton.addEventListener("click", handleOpenCardPopup);
