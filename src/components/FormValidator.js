export default class FormValidator {
  constructor(config, formElement) {
    this._config = config;
    this._form = formElement;
    this._inputList = Array.from(
      this._form.querySelectorAll(config.inputSelector)
    );
    this._button = this._form.querySelector(config.submitButtonSelector);
  }

  _showInputError(inputElement) {
    const errorElement = this._form.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(this._config.inputErrorClass);
    errorElement.textContent = inputElement.validationMessage;
    errorElement.classList.add(this._config.errorClass);
  }

  _hideInputError(inputElement) {
    const errorElement = this._form.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(this._config.inputErrorClass);
    errorElement.classList.remove(this._config.errorClass);
    errorElement.textContent = "";
  }

  _checkInputValidity(inputElement) {
    if (inputElement.validity.valid) {
      this._hideInputError(inputElement);
    } else {
      this._showInputError(inputElement);
    }
  }

  _hasInvalidInput() {
    return this._inputList.some((inputElement) => !inputElement.validity.valid);
  }

  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this._button.classList.add(this._config.inactiveButtonClass);
      this._button.disabled = true;
    } else {
      this._button.classList.remove(this._config.inactiveButtonClass);
      this._button.disabled = false;
    }
  }

  resetValidation() {
    this._toggleButtonState();
    this._inputList.forEach((inputElement) =>
      this._hideInputError(inputElement)
    );
  }

  setEventListeners() {
    this._toggleButtonState();
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });
    });
  }
}
