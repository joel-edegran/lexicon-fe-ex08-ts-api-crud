import './style.css';
import type { Car } from './types';
import * as api from './api';
import * as ui from './ui';

let isCarsLoaded: boolean = false;
let cars: Car[] = [];

// Fetch and render cars
const handleFetchCars = async (): Promise<void> => {
    ui.clearMessage();
    try {
        const data: Car[] = await api.getCars();
        cars = data;
        isCarsLoaded = true;

        ui.clearCarList();

        if (cars.length === 0) {
            ui.showMessage('Det finns inga bilar i databasen.', 'info');
            return;
        }

        cars.forEach(car => ui.renderCar(car));
    } catch (error: unknown) {
        console.error(error);
        const message: string = error instanceof Error ? error.message : 'Could not fetch cars.';
        ui.showMessage(message, 'danger');
    }
};

// Form submit dispatcher
const handleFormSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    ui.clearMessage();

    const carId: string = ui.carIdInput.value;
    const carData: Omit<Car, 'id'> = ui.getFormData();

    try {
        if (carId) {
            const numericId: number = Number(carId);
            await api.updateCar(numericId, carData);

            const updatedCar: Car = { id: numericId, ...carData };
            const carListItem: HTMLLIElement | null = document.querySelector(`[data-id="${numericId}"]`) as HTMLLIElement | null;
            if (carListItem) {
                ui.populateCarElement(carListItem, updatedCar);
            }

            const index: number = cars.findIndex(car => car.id === numericId);
            if (index !== -1) cars[index] = updatedCar;

            ui.resetForm();
            ui.showMessage('Bilen har uppdaterats!', 'success');
        } else {
            const createdCar: Car = await api.createCar(carData);

            if (!isCarsLoaded) {
                await handleFetchCars();
            } else {
                cars.push(createdCar);
                ui.renderCar(createdCar);
            }

            ui.resetForm();
            ui.showMessage('Bilen har lagts till!', 'success');
        }
    } catch (error: unknown) {
        console.error(error);
        const message: string = error instanceof Error ? error.message : 'Operation failed.';
        ui.showMessage(message, 'danger');
    }
};

// Handle list clicks (edit/delete)
const handleCarListClick = async (event: MouseEvent): Promise<void> => {
    const target: HTMLElement = event.target as HTMLElement;
    const button: HTMLButtonElement | null = target.closest('button[data-action]') as HTMLButtonElement | null;
    if (!button) return;

    const action: string | undefined = button.dataset.action;
    const carListItem: HTMLElement | null = button.closest('.car-list-item') as HTMLElement | null;
    const numericId: number = Number(carListItem?.dataset.id);

    if (!numericId) return;

    if (action === 'edit') {
        const car: Car | undefined = cars.find(car => car.id === numericId);
        if (car) ui.populateForm(car);
    } else if (action === 'delete') {
        if (!confirm("Är du säker på att du vill ta bort bilen?")) return;

        ui.clearMessage();
        try {
            const statusText: string | null = await api.deleteCar(numericId);

            if (Number(ui.carIdInput.value) === numericId) {
                ui.resetForm();
            }

            carListItem?.remove();
            cars = cars.filter((car: Car): boolean => car.id !== numericId);

            const message: string = statusText || 'Bilen har tagits bort!';
            ui.showMessage(cars.length === 0 ? `${message} Det finns inga bilar i databasen.` : message, cars.length === 0 ? 'info' : 'success');
        } catch (error: unknown) {
            console.error(error);
            const message: string = error instanceof Error ? error.message : 'Could not delete car.';
            ui.showMessage(message, 'danger');
        }
    }
};

// Event Listeners
ui.loadButton.addEventListener('click', handleFetchCars);
ui.form.addEventListener('submit', handleFormSubmit);
ui.carList.addEventListener('click', handleCarListClick);
ui.cancelButton.addEventListener('click', (): void => {
    ui.clearMessage();
    ui.resetForm();
});

// Initialization
ui.showMessage('Klicka på knappen för att ladda in bilar...', 'info');