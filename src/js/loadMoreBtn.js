export class LoadMoreBtn {
  constructor({ selektor, hidden = false }) {
    this.refs = this.getRefs(selektor);

    hidden && this.hide();
  }

  getRefs(selektor) {
    const refs = {};
    refs.button = document.querySelector(selektor);
    return refs;
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
