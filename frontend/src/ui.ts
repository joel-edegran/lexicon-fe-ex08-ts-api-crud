import type { Car } from './types';

// DOM Elements objects
export const {
    loadButton,
    carList,
    formSection,
    form,
    carIdInput,
    formTitle,
    submitButton,
    cancelButton,
    statusMessage,
    carTemplate,
} = {
    loadButton:     document.getElementById('load-button')          as HTMLButtonElement,
    carList:        document.getElementById('car-list')             as HTMLUListElement,
    formSection:    document.getElementById('form-section')         as HTMLElement,
    form:           document.getElementById('form')                 as HTMLFormElement,
    carIdInput:     document.getElementById('car-id')               as HTMLInputElement,
    formTitle:      document.getElementById('form-title')           as HTMLElement,
    submitButton:   document.getElementById('submit-button')        as HTMLButtonElement,
    cancelButton:   document.getElementById('cancel-button')        as HTMLButtonElement,
    statusMessage:  document.getElementById('status-message')       as HTMLElement,
    carTemplate:    document.getElementById('car-item-template')    as HTMLTemplateElement,
};

export const showMessage = (message: string, type: string = 'info'): void => {
    if (!statusMessage) return;
    statusMessage.textContent   = message;
    statusMessage.className     = `alert alert-${type}`;
    statusMessage.hidden        = false;
};

export const clearMessage = (): void => {
    if (!statusMessage) return;
    statusMessage.textContent   = '';
    statusMessage.className     = '';
    statusMessage.hidden        = true;
};

export const resetForm = (): void => {
    form.reset();
    carIdInput.value            = '';
    formTitle.textContent       = "Lägg till ny bil";
    submitButton.textContent    = "Lägg till";
    cancelButton.hidden         = true;
};

export const getFormData = (): Omit<Car, 'id'> => ({
    brand: (form.elements.namedItem('brand') as HTMLInputElement).value,
    model: (form.elements.namedItem('model') as HTMLInputElement).value,
    year: parseInt((form.elements.namedItem('year') as HTMLInputElement).value, 10),
    color: (form.elements.namedItem('color') as HTMLInputElement).value
});

export const populateForm = (car: Car): void => {
    carIdInput.value    = car.id?.toString() ?? '';
    (form.elements.namedItem('brand') as HTMLInputElement).value    = car.brand;
    (form.elements.namedItem('model') as HTMLInputElement).value    = car.model;
    (form.elements.namedItem('year') as HTMLInputElement).value     = car.year.toString();
    (form.elements.namedItem('color') as HTMLInputElement).value    = car.color;

    formTitle.textContent       = "Redigera bil";
    submitButton.textContent    = "Spara ändringar";
    cancelButton.hidden         = false;

    formSection.scrollIntoView({ behavior: 'smooth' });
};

export const populateCarElement = (element: HTMLLIElement, car: Car): void => {
    const titleEl = element.querySelector('.car-title');
    const yearEl = element.querySelector('.car-year');
    const colorEl = element.querySelector('.car-color');

    if (titleEl) titleEl.textContent = `${car.brand} ${car.model}`;
    if (yearEl) yearEl.textContent  = car.year.toString();
    if (colorEl) colorEl.textContent = `Färg: ${car.color}`;
};

export const renderCar = (car: Car): void => {
    const templateListItem  = carTemplate.content.cloneNode(true) as DocumentFragment;
    const carListItem       = templateListItem.querySelector('.car-list-item') as HTMLLIElement;
    
    carListItem.dataset.id = car?.id?.toString();
    populateCarElement(carListItem, car);
    carList.appendChild(carListItem);
};

export const clearCarList = (): void => {
    carList.replaceChildren();
};