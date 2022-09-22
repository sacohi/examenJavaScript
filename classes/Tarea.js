export class Tarea {
  id = Math.ceil(Math.random() * 50);

  constructor(titulo, prioridad) {
    this.titulo = titulo;
    this.prioridad = prioridad;
  }
}
