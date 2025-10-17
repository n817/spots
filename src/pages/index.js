import "./index.css";
import { validationConfig, enableValidation, resetValidation } from "../scripts/validate.js";

import Api from "../utils/Api.js";

// Profile section variables
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const editProfileButton = document.querySelector(".profile__edit-button");
const editAvatarButton = document.querySelector(".profile__avatar-button")
const addCardButton = document.querySelector(".profile__add-button");

// Cards section variables
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

// List of modals
const modals = document.querySelectorAll(".modal");

// Profile edit modal variables
const editProfileModal = document.querySelector("#profile-edit-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileForm.querySelector("#profile-name-input");
const descriptionInput = editProfileForm.querySelector("#profile-description-input");

// Avatar edit modal variables
const editAvatarModal = document.querySelector("#avatar-edit-modal");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const avatarLinkInput = editAvatarModal.querySelector("#avatar-link-input");

// Card add modal variables
const addCardModal = document.querySelector("#card-add-modal");
const addCardForm = addCardModal.querySelector(".modal__form");
const cardLinkInput = addCardForm.querySelector("#card-link-input");
const cardCaptionInput = addCardForm.querySelector("#card-caption-input");

// Image zoom modal variables
const zoomImageModal = document.querySelector("#image-zoom-modal");
const zoomImage = zoomImageModal.querySelector(".modal__image");
const zoomImageCaption = zoomImageModal.querySelector(".modal__caption");

// Card delete modal variables
const deleteCardModal = document.querySelector("#card-delete-modal");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0f8c8143-f357-4bf6-aa1f-0dc5c492fe92",
    "Content-Type": "application/json"
  }
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    setUserData(userData);
    cards.forEach((card) => {
      const cardEl = getCardElement(card);
      cardsList.append(cardEl);
    })
  })
    .catch((err) => {
    console.error(`Data loading error: ${err}`);
  });


// Cards rendering
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;
    if (data.isLiked) {
    likeButton.classList.add("card__like-button_active");
  }

  deleteButton.addEventListener("click", (evt) => handleDeleteCard(cardElement, data._id));
  likeButton.addEventListener("click", (evt) => handleLike(evt, data._id));
  cardImage.addEventListener("click", () => handleImageZoom(data));

  return cardElement;
}

// Open/close modal functions
const openModal = (modal) => {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keyup", handleEscape);
}

const closeModal = (modal) => {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keyup", handleEscape);
}

// Closing the modal by clicking on overlay or close button
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target.classList.contains("modal") ||
      evt.target.classList.contains("modal__close-button") ||
      evt.target.classList.contains("modal__submit-button_type_cancel")
    ) {
      closeModal(modal);
    }
  });
});

// Closing the modal by pressing the Escape key
function handleEscape(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_is-opened");
    closeModal(activeModal);
  }
}

// Profile edit functionality
editProfileButton.addEventListener("click", function() {
  resetValidation(editProfileModal, [nameInput, descriptionInput], validationConfig);
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  api
    .updateUserInfo({ name: nameInput.value, about: descriptionInput.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
})

function setUserData(data) {
  profileName.textContent = data.name;
  profileDescription.textContent = data.about;
  profileAvatar.src = data.avatar;
}

// Avatar edit functionality
editAvatarButton.addEventListener("click", () => openModal(editAvatarModal));
editAvatarForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  api
    .updateAvatar({ avatar: avatarLinkInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error);
})

// Card add functionality
addCardButton.addEventListener("click", () => openModal(addCardModal));
addCardForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  api
    .addCard({ link: cardLinkInput.value, name: cardCaptionInput.value })
    .then((data => {
      const newCard = getCardElement(data);
      cardsList.prepend(newCard);
      closeModal(addCardModal);
      evt.target.reset();
    }))
    .catch(console.error);
})

// Card delete functionality
let selectedCard, selectedCardId;

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteCardModal);
}

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    })
    .catch(console.error);
}

deleteCardForm.addEventListener("submit", handleDeleteCardSubmit);

// Card like functionality
function handleLike(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__like-button_active");
  api
    .changeCardLikeStatus(cardId, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
}

// Image zoom functionality
function handleImageZoom(data) {
  zoomImage.src = data.link;
  zoomImage.alt = data.name;
  zoomImageCaption.textContent = data.name;
  openModal(zoomImageModal);
}

enableValidation(validationConfig);