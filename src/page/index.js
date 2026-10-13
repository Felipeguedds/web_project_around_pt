import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForms.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import Api from "../components/Api.js";

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
const profileAvatarButton = document.querySelector(".profile__avatar-button");
const editForm = document.querySelector("#edit-profile-form");
const newCardForm = document.querySelector("#new-card-form");
const avatarForm = document.querySelector("#avatar-form");
const editNameInput = document.querySelector(".popup__input_type_name");
const editJobInput = document.querySelector(".popup__input_type_description");

const api = new Api({
  baseUrl: "https://around-api.pt-br.tripleten-services.com/v1",
  headers: {
    authorization: "97919fb5-7fc6-4b22-8014-4f2358183c50",
    "Content-Type": "application/json",
  },
});

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

const imagePopup = new PopupWithImage("#image-popup");
imagePopup.setEventListeners();

const confirmationPopup = new PopupWithConfirmation("#delete-popup");
confirmationPopup.setEventListeners();

function handleCardClick(name, link) {
  imagePopup.open({ name, link });
}

function handleLikeClick(card) {
  api
    .changeLikeCardStatus(card.getId(), !card.isLiked())
    .then((updatedCard) => {
      card.setLikeStatus(updatedCard.isLiked);
    })
    .catch((err) => console.log(err));
}

function handleDeleteClick(card) {
  confirmationPopup.open();
  confirmationPopup.setSubmitAction(() => {
    confirmationPopup.renderLoading(true);
    api
      .removeCard(card.getId())
      .then(() => {
        card.removeCard();
        confirmationPopup.close();
      })
      .catch((err) => console.log(err))
      .finally(() => confirmationPopup.renderLoading(false));
  });
}

function createCard(data) {
  const card = new Card(
    data,
    cardTemplateSelector,
    userInfo.getUserInfo().id,
    handleCardClick,
    handleDeleteClick,
    handleLikeClick
  );
  return card.generateCard();
}

const cardSection = new Section(
  {
    renderer: (item) => {
      cardSection.addItemToEnd(createCard(item));
    },
  },
  ".cards__list"
);

const editPopup = new PopupWithForm("#edit-popup", (values) => {
  editPopup.renderLoading(true);
  api
    .setUserInfo({ name: values.name, about: values.description })
    .then((userData) => {
      userInfo.setUserInfo(userData);
      editPopup.close();
    })
    .catch((err) => console.log(err))
    .finally(() => editPopup.renderLoading(false));
});
editPopup.setEventListeners();

const cardPopup = new PopupWithForm("#new-card-popup", (values) => {
  cardPopup.renderLoading(true);
  api
    .addCard({ name: values["place-name"], link: values.link })
    .then((cardData) => {
      cardSection.addItem(createCard(cardData));
      cardPopup.close();
    })
    .catch((err) => console.log(err))
    .finally(() => cardPopup.renderLoading(false));
});
cardPopup.setEventListeners();

const avatarPopup = new PopupWithForm("#avatar-popup", (values) => {
  avatarPopup.renderLoading(true);
  api
    .setUserAvatar({ avatar: values.avatar })
    .then((userData) => {
      userInfo.setAvatar(userData.avatar);
      avatarPopup.close();
    })
    .catch((err) => console.log(err))
    .finally(() => avatarPopup.renderLoading(false));
});
avatarPopup.setEventListeners();

const editFormValidator = new FormValidator(validationConfig, editForm);
editFormValidator.setEventListeners();

const cardFormValidator = new FormValidator(validationConfig, newCardForm);
cardFormValidator.setEventListeners();

const avatarFormValidator = new FormValidator(validationConfig, avatarForm);
avatarFormValidator.setEventListeners();

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

function handleOpenAvatarPopup() {
  avatarFormValidator.resetValidation();
  avatarPopup.open();
}

profileEditButton.addEventListener("click", handleOpenEditPopup);
profileAddButton.addEventListener("click", handleOpenCardPopup);
profileAvatarButton.addEventListener("click", handleOpenAvatarPopup);

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    userInfo.setUserInfo(userData);
    userInfo.setAvatar(userData.avatar);
    cardSection.renderItems(cards);
  })
  .catch((err) => console.log(err));
