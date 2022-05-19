//localStorage.removeItem('library');
let myLibrary;

if (JSON.parse(localStorage.getItem('library'))) {
  myLibrary = JSON.parse(localStorage.getItem('library'));
  console.log(myLibrary);
} else {
  myLibrary = [];

  myLibrary.push(new Book('The Death Mage Who Doesn\'t Want a Fourth Time', 'Densuke', '278', 'https://lightnovelbastion.com/wp-content/uploads/2019/04/DMV6.1.png', 'https://lightnovelbastion.com/novel/death-mage/', true));
  myLibrary.push(new Book('That Time I Got Reincarnated as a Slime', 'Fuse', '418', 'https://cdn.novelupdates.com/images/2020/07/slime_softcover_1.jpg', 'https://www.novelupdates.com/series/tensei-shitara-slime-datta-ken/', true));
  myLibrary.push(new Book('Release that Witch', 'Er Mu', '1498', 'https://cdn.novelupdates.com/images/2017/07/Release-that-Witch.jpg', '', true));
  myLibrary.push(new Book('This book has a long long long long long long long long name. But because the font size is small, I don\'t think it would be this long', 'Me', '1000'));
  console.log(myLibrary);
}


function Book(title, author, chapters, image = false, info = false, read = false) {
  this.title = title;
  this.author = author;
  this.chapters = chapters;
  this.image = image;
  this.info = info;
  this.read = read;
}


const addBookButton = document.querySelector('.btn');

addBookButton.addEventListener('click', toggleFormModalVisibility);

const main = document.querySelector('main');

chargeLibrary();

const divModalForm = document.querySelector('.div-modal-form');
const confirmationModalDiv = document.querySelector('.confirmation-div');
const inputs = document.querySelectorAll('.input');


const bookTitle = document.querySelector('#title');
const bookAuthor = document.querySelector('#author');
const bookChapter = document.querySelector('#chapter');
const coverLink = document.querySelector('#coverLink');
const infoLink = document.querySelector('#infoLink');
const checkBoxRead = document.querySelector('#read');

const submitButton = document.querySelector('.submit');
const cancelSubmit = document.querySelector('.cancelBook');

const confirmDelete = document.querySelector('.confirm-delete');
const cancelDelete = document.querySelector('.cancel-delete');

for (const input of inputs) {
  input.addEventListener('input', () => {
    writeError(input, input.nextElementSibling);
  });
}

saveNewBookForm();

cancelSubmit.addEventListener('click', () => {
  deleteInputValues();
  toggleFormModalVisibility(false);
});


//FUNCTIONS

function chargeLibrary() {

  while (main.firstChild) {
    main.removeChild(main.lastChild);
  }

  if (!myLibrary.length) {
    const emptyPage = document.createElement('p');
    main.appendChild(emptyPage);
    main.className = 'empty';
    emptyPage.textContent = 'The library needs books!'
  } else {
    main.className = '';
  }

  for (let book of myLibrary) {

    const card = document.createElement('div');
    main.appendChild(card);
    card.setAttribute('class', 'card');

    const cardImg = document.createElement('img');
    card.appendChild(cardImg);
    if (book['image']) {
      cardImg.setAttribute('src', book['image']);
      cardImg.setAttribute('onerror', 'setFallbackImage(this)');
    } else {
      cardImg.setAttribute('src', 'media/book-logo.svg');
    }
    cardImg.setAttribute('alt', 'Book cover');
    cardImg.setAttribute('class', 'book-img');


    //Book card content
    const cardContent = document.createElement('div');
    card.appendChild(cardContent);
    cardContent.setAttribute('class', 'cardContent');

    const upperContent = document.createElement('div');
    cardContent.appendChild(upperContent);
    upperContent.setAttribute('class', 'upperContent');

    const titleAuthor = document.createElement('p');
    upperContent.appendChild(titleAuthor);
    const bookName = document.createElement('span');
    titleAuthor.appendChild(bookName);
    bookName.textContent = `“${book['title']}”`;
    bookName.setAttribute('class', 'book-name');
    const titleAuthorText = document.createTextNode(` by ${book['author']}`);
    bookName.after(titleAuthorText);

    const chaptersP = document.createElement('p');
    upperContent.appendChild(chaptersP);
    chaptersP.textContent = `${book['chapters']} chapters.`;

    if (book['info']) {
      const moreInfo = document.createElement('a');
      upperContent.appendChild(moreInfo);
      moreInfo.setAttribute('href', book['info']);
      moreInfo.textContent = 'More information';
      moreInfo.setAttribute('class', 'moreInfo');
    }


    //Book options
    const bottomContent = document.createElement('div');
    cardContent.appendChild(bottomContent);
    bottomContent.setAttribute('class', 'bottomContent');

    const readCheck = document.createElement('img');
    bottomContent.appendChild(readCheck);
    if (book['read']) {
      setIconName(readCheck, 'book');
    } else {
      setIconName(readCheck, 'book-outline');
    }
    readCheck.setAttribute('class', 'icon check-read');

    const editBook = document.createElement('img');
    bottomContent.appendChild(editBook);
    setIconName(editBook, 'pencil');
    editBook.setAttribute('class', 'icon edit');

    const deleteBook = document.createElement('img');
    bottomContent.appendChild(deleteBook);
    deleteBook.setAttribute('src', 'media/icon/trash-can.svg');
    deleteBook.setAttribute('class', 'icon delete-book');

    //Book readCheck
    readCheck.addEventListener('mouseover', () => {
      if (book['read']) {
        setIconName(readCheck, 'book-minus');
      } else {
        setIconName(readCheck, 'book-plus-outline');
      }
    });

    readCheck.addEventListener('click', () => {
      if (book['read']) {
        setIconName(readCheck, 'book-outline');
        book['read'] = false;
        localStorage.setItem('library', JSON.stringify(myLibrary));
      } else {
        setIconName(readCheck, 'book');
        book['read'] = true;
        localStorage.setItem('library', JSON.stringify(myLibrary));
      }
    });

    readCheck.addEventListener('mouseout', () => {
      if (book['read']) {
        setIconName(readCheck, 'book');
      } else {
        setIconName(readCheck, 'book-outline');
      }
    });

    //Edit book
    editBook.addEventListener('click', () => {
      toggleFormModalVisibility(true);

      bookTitle.value = book['title'];
      bookAuthor.value = book['author'];
      bookChapter.value = book['chapters'];
      if (book['image']) coverLink.value = book['image'];
      if (book['info']) infoLink.value = book['image'];
      if (book['read']) checkBoxRead.checked = true;

      saveEditedBookForm(myLibrary.indexOf(book));
    });

    //Delete Book
    deleteBook.addEventListener('click', () => {
      toggleConfirmationModalVisibility(true);
      document.querySelector('.book-title-message').textContent = book.title;

      confirmDelete.onclick = () => {
        myLibrary.splice(myLibrary.indexOf(book), 1);
        toggleConfirmationModalVisibility(false);
        chargeLibrary();
        localStorage.setItem('library', JSON.stringify(myLibrary));
      }

      cancelDelete.onclick = () => toggleConfirmationModalVisibility(false);
    });
  }
}

function setIconName(element, mediaName) {
  element.setAttribute('src', `media/icon/${mediaName}.svg`);
}

function writeError(inputElement, errorElement) {
  if (!inputElement.validity.valid) {
    if (inputElement.validity.valueMissing) {
      errorElement.textContent = `The input of "${inputElement.previousElementSibling.firstChild.textContent}" must have a value.`;
    }
    else if (inputElement.validity.tooLong) {
      errorElement.textContent = `The value must be shorter than ${inputElement.maxLength}; you entered ${inputElement.value.length}`;
    }
    else if (inputElement.validity.tooShort) {
      errorElement.textContent = `The value must be longer than ${inputElement.minLength}`;
    }
    else if (inputElement.validity.rangeOverflow) {
      errorElement.textContent = `The value must be less than ${inputElement.max}`;
    }
    else if (inputElement.validity.typeMismatch) {
      errorElement.textContent = `Please enter a valid URL address like "https://google.com"`;
    }

    errorElement.className = 'error active';
  } else {
    errorElement.className = 'error';
  }
}

function toggleFormModalVisibility(flag = true) {
  if (flag) {
    divModalForm.className += ' active';
  } else {
    divModalForm.className = 'div-modal-form';
  }
}

function toggleConfirmationModalVisibility(flag = true) {
  if (flag) {
    confirmationModalDiv.className += ' active';
  } else {
    confirmationModalDiv.className = 'confirmation-div';
  }
}

function deleteInputValues() {
  for (const input of inputs) {
    if (input.value) input.value = '';
  }
  if (checkBoxRead.checked) checkBoxRead.checked = false;
}

function saveEditedBookForm(bookIndex) {
  if (bookIndex === 0) bookIndex = -Infinity;

  submitButton.onclick = () => {
    for (const input of inputs) {
      if (!input.validity.valid) {
        writeError(input, input.nextElementSibling);
        return false;
      }
    }

    myLibrary.splice(bookIndex, 1, new Book(bookTitle.value, bookAuthor.value, bookChapter.value, coverLink.value, infoLink.value, checkBoxRead.checked));


    deleteInputValues();
    toggleFormModalVisibility(false);
    chargeLibrary();
    localStorage.setItem('library', JSON.stringify(myLibrary));
    saveNewBookForm();
  };
}

function saveNewBookForm() {
  submitButton.onclick = () => {
    for (const input of inputs) {
      if (!input.validity.valid) {
        writeError(input, input.nextElementSibling);
        return false;
      }
    }

    myLibrary.push(new Book(bookTitle.value, bookAuthor.value, bookChapter.value, coverLink.value, infoLink.value, checkBoxRead.checked));

    localStorage.setItem('library', JSON.stringify(myLibrary));
    deleteInputValues();
    toggleFormModalVisibility(false);
    chargeLibrary();
  };
}

function setFallbackImage(img) {
  img.src = 'media/book-logo.svg';
}