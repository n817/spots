// Profile section variables
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

// Cards section variables
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");
const initialCards = [
    {
      name: "Yosemite Valley",
      link: "https://code.s3.yandex.net/web-code/yosemite.jpg",
    },
    {
      name: "Lake Louise",
      link: "https://code.s3.yandex.net/web-code/lake-louise.jpg",
    },
    {
      name: "Bald Mountains",
      link: "https://code.s3.yandex.net/web-code/bald-mountains.jpg",
    },
    {
      name: "Latemar",
      link: "https://code.s3.yandex.net/web-code/latemar.jpg",
    },
    {
      name: "Vanoise National Park",
      link: "https://code.s3.yandex.net/web-code/vanoise.jpg",
    },
    {
      name: "Lago di Braies",
      link: "https://code.s3.yandex.net/web-code/lago.jpg",
    },
  ];

// Profile edit modal variables
const editProfileModal = document.querySelector("#profile-edit-modal");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-button");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileForm.querySelector("#profile-name-input");
const descriptionInput = editProfileForm.querySelector("#profile-description-input");

// Card add modal variables
const addCardModal = document.querySelector("#card-add-modal");
const addCardCloseButton = addCardModal.querySelector(".modal__close-button");
const addCardForm = addCardModal.querySelector(".modal__form");
const cardLinkInput = addCardForm.querySelector("#card-link-input");
const cardCaptionInput = addCardForm.querySelector("#card-caption-input");

// Image zoom modal variables
const zoomImageModal = document.querySelector("#image-zoom-modal");
const zoomImageCloseButton = zoomImageModal.querySelector(".modal__close-button");
const zoomImage = zoomImageModal.querySelector(".modal__image");
const zoomImageCaption = zoomImageModal.querySelector(".modal__caption");


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

  deleteButton.addEventListener("click", handleDeleteCard);
  likeButton.addEventListener("click", handleLike);
  cardImage.addEventListener("click", () => handleImageZoom(data));

  return cardElement;
}

for (let i = 0; i < initialCards.length; i++) {
  const cardElement = getCardElement(initialCards[i]);
  cardsList.append(cardElement);
}

// Open/close modal function
const toggleModal = (modal) => {
  modal.classList.toggle("modal_is-opened");
}

// Profile edit functionality
editProfileButton.addEventListener("click", function() {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  toggleModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", () => toggleModal(editProfileModal));

editProfileForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  toggleModal(editProfileModal);
})

// Card add functionality
addCardButton.addEventListener("click", () => toggleModal(addCardModal));
addCardCloseButton.addEventListener("click", () => toggleModal(addCardModal));
addCardForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  const newCardData = {link: cardLinkInput.value, name: cardCaptionInput.value};
  const newCard = getCardElement(newCardData);
  cardsList.prepend(newCard);
  toggleModal(addCardModal);
  evt.target.reset();
})

// Card delete functionality
function handleDeleteCard(evt) {
  evt.target.closest(".card").remove();
}

// Card like functionality
function handleLike(evt) {
  evt.target.classList.toggle("card__like-button_active");
}

// Image zoom functionality
function handleImageZoom(data) {
  zoomImage.src = data.link;
  zoomImage.alt = data.name;
  zoomImageCaption.textContent = data.name;
  toggleModal(zoomImageModal);
}

zoomImageCloseButton.addEventListener("click", () => toggleModal(zoomImageModal));