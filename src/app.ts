// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

const validate = (validatableInput: Validatable): boolean => {
  let isValid = true;

  if (validatableInput.required)
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  )
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  )
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  )
    isValid = isValid && validatableInput.value >= validatableInput.min;

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  )
    isValid = isValid && validatableInput.value <= validatableInput.max;

  return isValid;
};

// Autobind Decorator
const Autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    enumerable: false,
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
};

// ProjectList class

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}
// ProjectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLFormElement;

    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();

    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    if (
      !validate({
        value: enteredTitle,
        required: true,
      }) ||
      !validate({
        value: enteredDescription,
        required: true,
        minLength: 5,
      }) ||
      !validate({
        value: +enteredPeople,
        required: true,
        min: 1,
        max: 5,
      })
    ) {
      alert("Invalid inputs, please try again!");
      return;
    }
    return [enteredTitle, enteredDescription, +enteredPeople];
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
const activePrj = new ProjectList("active");
const finishedPrrj = new ProjectList("finished");
