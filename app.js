const notesData = [
  {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome to Notes, Dimas!",
    body: "Welcome to Notes! This is your first note.",
    createdAt: "2022-07-28T10:03:12.594Z",
    archived: false,
  },
];

// COMPONENT 1
class Navbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          display: grid; 
          grid-template-columns: auto 1fr auto; 
          align-items: center;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 20px;
          margin-bottom: 80px;
          margin-left: 10px;
          margin-right: 10px;
          margin-top: 20px;
        }

        nav h1 {
          margin: 0;
          margin-left: 20px;
          margin-top: 0;
          font-size: 1em;
          color: #333;
          margin-left: 20px;
          font-family: "Playwrite HU", cursive;
          font-weight: bold;
        }
        nav ul {
          display: flex;
          margin-left: 33%;
          gap: 20px;
          list-style: none;
          padding: 0;
        }

        nav a {
          text-decoration: none;
          color: black;
          font-family: "Quicksand", sans-serif;
          font-weight: 500;
          font-size: medium;
          transition: font-weight 0.3s, color 0.3s;
        }

        nav a:hover {
          font-weight: bold;
          color: rgb(14, 110, 255);
        }

      </style>
      <nav>
        <h1>Noteapp</h1>
        <ul>
          <li><a href="#">About Me</a></li>
          <li><a href="#">Contacs</a></li>
          <li><a href="#">Information</a></li>
        </ul>
      </nav>
    `;
  }
}
customElements.define("note-navbar", Navbar);

//COMPONENT 2
class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        h2 {
        text-align: center;
        color: white;
        }

        form {
          display: grid;
          gap: 12px;
          max-width: 400px;
          margin: 20px auto;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);

        }
        input[type="text"], textarea {
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1em;
        }
        button {
          background-color:rgb(14, 110, 255);
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
        }

        button:active {
        background-color: rgb(76, 148, 255);
        }
      </style>
      <h2>Silakan masukan catatan mu</h2>
      <form id="noteForm">
        <input type="text" id="noteTitle" placeholder="Judul Catatan" required>
        <textarea id="noteContent" placeholder="Isi Catatan" required></textarea>
        <button type="submit">Tambah Catatan</button>
      </form>
    `;
  }
  connectedCallback() {
    this.shadowRoot
      .querySelector("#noteForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const title = this.shadowRoot.querySelector("#noteTitle").value;
        const content = this.shadowRoot.querySelector("#noteContent").value;
        const createdAt = new Date().toISOString(); 
        this.dispatchEvent(
          new CustomEvent("noteSubmitted", {
            detail: { title, content, createdAt },
          })
        );
        this.shadowRoot.querySelector("#noteTitle").value = "";
        this.shadowRoot.querySelector("#noteContent").value = "";
      });
  }
}
customElements.define("note-form", NoteForm);

//COMPONENT 3
class NoteContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .note {
          background-color: #ffffff;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          font-family: "Quicksand", sans-serif;
          font-weight: 600;
          max-width: 98%;
          transition: background-color 0.3s, transform 0.3s ease-in-out;
          margin-bottom: 10px;
          display: grid;
        }

        .note:hover {
          transform: scale(1.03);
          background-color: #fbfbfb;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }

        .note h3 {
          margin-top: 0;
          color: #333;
        }
        .note p {
          color: #666;
        }

        .note small {
            color: grey;
        }
        .hidden {
            opacity: 0;
            transform: translateY(50px); /* Posisi awal di bawah */
            transition: all 0.5s ease; /* Animasi transisi */
        }
        .show {
            opacity: 1;
            transform: translateY(0); /* Posisi akhir */
        }

        .note-index{
          font-size: 0.8em;
          color: #999;
          margin-bottom: 5px;
        }
      </style>
      <div id="notes"></div>
    `;
    this.noteCounter = 1;
  }
  connectedCallback() {
    notesData.forEach((note) => {
      this.addNote(note.title, note.body, note.createdAt);
    });
    window.addEventListener("scroll", this.checkSlide.bind(this));
  }
  addNote(title, content, createdAt) {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note hidden";
    noteDiv.innerHTML = `
      <div class="note-index">Catatan #${this.noteCounter}</div>
      <h3>${title}</h3>
      <p>${content}</p>
      <small>${this.formatDate(createdAt)}</small>
    `;
    this.shadowRoot.querySelector("#notes").appendChild(noteDiv);
    this.noteCounter++;
  }
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  }
  checkSlide() {
    const notes = this.shadowRoot.querySelectorAll(".note");
    notes.forEach((note) => {
      const slideInAt =
        window.scrollY + window.innerHeight - note.offsetHeight / 2;
      const noteBottom = note.offsetTop + note.offsetHeight;
      const isHalfShown = slideInAt > note.offsetTop;
      const isNotScrolledPast = window.scrollY < noteBottom;
      if (isHalfShown && isNotScrolledPast) {
        note.classList.add("show");
      } else {
        note.classList.remove("show");
      }
    });
  }
}
customElements.define("note-container", NoteContainer);

//UNTUK EVENT
const noteForm = document.querySelector("note-form");
const noteContainer = document.querySelector("note-container");

noteForm.addEventListener("noteSubmitted", (event) => {
  const { title, content, createdAt } = event.detail;
  noteContainer.addNote(title, content, createdAt);
});
