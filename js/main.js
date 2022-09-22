import { Tarea } from "../classes/Tarea.js";

class App {
  tareas = [];
  form1 = document.querySelector("#form1");
  form2 = document.querySelector("#form2");
  form3 = document.querySelector("#form3");
  output = document.querySelector("#output");
  priority1 = document.querySelector("#select1");
  priority2 = document.querySelector("#select2");

  txtSearch = document.querySelector("#buscador");

  constructor() {
    this.form1.addEventListener("submit", (e) => this.handleSubmit(e));
    this.form2.addEventListener("submit", (e) => this.handleClick(e));
    this.txtSearch.addEventListener("keyup", (e) => this.handleKey(e));
    this.createFirstTarea();
  }

  handleSubmit(e) {
    e.preventDefault();

    const { valueTarea, selectValue } = this.getFormData();

    if (!valueTarea) {
      return;
    }

    this.addTarea(valueTarea, selectValue);

    this.createLi(valueTarea, selectValue);

    this.form1.reset();
  }

  handleClick(e) {
    e.preventDefault();

    const { parametroFiltro } = this.getFormData();

    this.filterTareas(parametroFiltro);
  }

  handleKey(e) {
    e.preventDefault();
    const { tareaBuscada } = this.getFormData();

    this.findTareas(tareaBuscada);
  }

  createFirstTarea() {
    const jsonTareas = localStorage.getItem("TASKs");

    if (!jsonTareas) {
      return;
    }

    const parsedTareas = JSON.parse(jsonTareas);

    this.tareas = parsedTareas;
    this.printAllTareas();
  }

  updateLocalStorage() {
    const tareasString = JSON.stringify(this.tareas);
    localStorage.setItem("TASKs", tareasString);
  }

  getFormData() {
    const valueTareaMin = this.form1.nuevaTarea.value.trim();

    const valueTarea =
      valueTareaMin.slice(0, 1).toUpperCase() + valueTareaMin.slice(1);
    const selectValue =
      this.priority1.options[this.priority1.selectedIndex].value;

    const parametroFiltro =
      this.priority2.options[this.priority2.selectedIndex].value;

    const tareaBuscada = this.form3.buscarTarea.value.trim();
    return { valueTarea, selectValue, parametroFiltro, tareaBuscada };
  }

  addTarea(valueTarea, selectValue) {
    const newTarea = new Tarea(valueTarea, selectValue);
    this.tareas.push(newTarea);

    const li = this.createLi(valueTarea, selectValue, newTarea.id);
    this.output.append(li);

    this.updateLocalStorage();
  }

  filterTareas(parametroFiltro) {
    this.output.innerHTML = "";

    if (parametroFiltro == "") {
      this.printAllTareas();
      return;
    }

    this.tareas.forEach(({ titulo, prioridad, id }) => {
      if (prioridad === parametroFiltro) {
        const li = this.createLi(titulo, prioridad, id);
        this.output.append(li);
      }
    });
  }

  findTareas(tareaBuscada) {
    this.output.innerHTML = "";
    this.tareas.forEach(({ titulo, prioridad, id }) => {
      if (titulo.toLowerCase().includes(tareaBuscada.toLowerCase())) {
        const li = this.createLi(titulo, prioridad, id);
        this.output.append(li);
      }
    });
  }

  deleteTarea(e) {
    const sure = confirm("¿Estás segur@ de eliminar esta tarea?");

    if (!sure) {
      return;
    }

    const id = Number(e.target.parentElement.dataset.id);

    this.tareas = this.tareas.filter((tarea) => {
      return tarea.id !== id;
    });

    this.updateLocalStorage();
    this.printAllTareas();
  }

  printAllTareas() {
    this.output.innerHTML = "";
    this.tareas.forEach(({ titulo, prioridad, id }) => {
      const li = this.createLi(titulo, prioridad, id);
      this.output.append(li);
    });
  }

  createLi(valueTarea, selectValue, id) {
    const li = document.createElement("li");
    li.dataset.id = id;
    const trashIcon = document.createElement("i");

    trashIcon.addEventListener("click", (e) => this.deleteTarea(e));

    trashIcon.classList.add("bi", "bi-trash");

    li.classList.add("bg");
    if (selectValue == "Urgente") {
      li.classList.add("bg-warning");
    } else if (selectValue == "Intermedia") {
      li.classList.add("bg-info");
    } else if (selectValue == "Normal") {
      li.classList.add("bg-light");
    }

    li.append(valueTarea, trashIcon);

    return li;
  }
}

const app = new App();
