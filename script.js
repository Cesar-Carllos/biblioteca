document.addEventListener('DOMContentLoaded', function() {
    // ----------------- CÓDIGO ORIGINAL -----------------
    // Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const views = document.querySelectorAll('.view');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetView = this.getAttribute('data-view');
           
            if (targetView) {
                views.forEach(view => {
                    view.classList.remove('active');
                });
               
                menuItems.forEach(menu => {
                    menu.classList.remove('active');
                });
               
                document.getElementById(targetView).classList.add('active');
                this.classList.add('active');
            }
           
            if (this.classList.contains('has-submenu')) {
                this.classList.toggle('expanded');
            }
        });
    });
    
    // Modals
    const modalTriggers = {
        'addAutorBtn': 'autorModal',
        'addEditoraBtn': 'editoraModal',
        'addLivroBtn': 'livroModal',
        'addEmprestimoBtn': 'emprestimoModal',
        'addEstudanteBtn': 'estudanteModal',
        'addMateriaBtn': 'materiaModal',
        'addAdminBtn': 'adminModal'
    };
    
    for (let triggerId in modalTriggers) {
        const trigger = document.getElementById(triggerId);
        const modalId = modalTriggers[triggerId];
       
        if (trigger) {
            trigger.addEventListener('click', function() {
                // Quando abrir o modal de livro, limpe os campos e configure como "Novo livro"
                if (modalId === 'livroModal') {
                    openNewBookModal();
                } else {
                    document.getElementById(modalId).style.display = 'flex';
                }
            });
        }
    }
    
    // Close modals
    const closeButtons = document.querySelectorAll('.modal-close, .btn-secondary');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-backdrop');
            modal.style.display = 'none';
        });
    });
    
    // Toggle sidebar
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('collapsed');
            document.querySelector('.content').classList.toggle('expanded');
        });
    }
    
    // File upload preview
    const uploadBoxes = document.querySelectorAll('.upload-box');
    uploadBoxes.forEach(box => {
        box.addEventListener('click', function() {
            // Simulate file upload
            const preview = this.nextElementSibling;
            const placeholder = preview.querySelector('.image-preview-placeholder');
           
            if (placeholder) {
                placeholder.style.display = 'none';
               
                const img = document.createElement('img');
                img.src = 'https://via.placeholder.com/150';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
               
                preview.appendChild(img);
            }
        });
    });
    
    // Activate dashboard by default
    document.querySelector('.menu-item[data-view="dashboard"]').click();
    
    // ----------------- GERENCIAMENTO DE LIVROS -----------------
    // Inicializa o sistema de gerenciamento de livros
    initializeBookManagement();
});

// ----------------- SISTEMA DE GERENCIAMENTO DE LIVROS -----------------
// Simulated book storage (in a real application, this would be a database)
let booksList = [
    { id: 1, title: 'Java Script', author: 'ultima prueba', authorId: 1, publisher: 'Nenhuma', publisherId: 1, subject: 'Programação', subjectId: 1, pages: 250, year: '2022-01-01', description: 'Introdução ao JavaScript', quantity: 5, status: 'Ativo' },
    { id: 2, title: 'HTML e CSS', author: 'cambiar el nombre !!!', authorId: 2, publisher: 'FTD', publisherId: 3, subject: 'Web', subjectId: 2, pages: 320, year: '2021-03-15', description: 'Fundamentos de HTML e CSS', quantity: 3, status: 'Ativo' },
    { id: 3, title: 'A conquista da matemática', author: 'popopipipi', authorId: 3, publisher: 'Moderna', publisherId: 4, subject: 'Matemática', subjectId: 3, pages: 420, year: '2020-06-10', description: 'Matemática avançada', quantity: 7, status: 'Ativo' },
    { id: 4, title: 'Maximus I', author: 'Rogério', authorId: 4, publisher: 'FTD', publisherId: 3, subject: 'Literatura', subjectId: 4, pages: 180, year: '2023-02-20', description: 'Literatura clássica', quantity: 2, status: 'Ativo' }
];

// Função para inicializar o sistema de gerenciamento de livros
function initializeBookManagement() {
    // Vincular evento de salvar livro
    const saveBookBtn = document.querySelector('#livroModal .btn-primary');
    if (saveBookBtn) {
        saveBookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleBookFormSubmit();
        });
    }
    
    // Renderizar lista de livros inicialmente
    renderBooksList();
    
    // Expor funções globalmente para uso nos botões
    window.openEditBookModal = openEditBookModal;
    window.confirmRemoveBook = confirmRemoveBook;
}

// Function to generate a unique ID for new books
function generateBookId() {
    return booksList.length > 0 ? Math.max(...booksList.map(book => book.id)) + 1 : 1;
}

// Function to add a new book
function addBook(bookData) {
    // Validate required fields
    if (!bookData.title || !bookData.authorId) {
        alert('Título e Autor são campos obrigatórios!');
        return false;
    }

    // Lookup data from selects
    const authorSelect = document.getElementById('livroAutor');
    const publisherSelect = document.getElementById('livroEditora');
    const subjectSelect = document.getElementById('livroMateria');
    
    const authorText = authorSelect.options[authorSelect.selectedIndex].text;
    const publisherText = publisherSelect.options[publisherSelect.selectedIndex].text;
    const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;

    // Create new book object
    const newBook = {
        id: generateBookId(),
        title: bookData.title,
        author: authorText,
        authorId: bookData.authorId,
        publisher: publisherText,
        publisherId: bookData.publisherId,
        subject: subjectText,
        subjectId: bookData.subjectId,
        pages: bookData.pages,
        year: bookData.year,
        description: bookData.description,
        quantity: bookData.quantity,
        status: 'Ativo'
    };

    // Add book to the list
    booksList.push(newBook);

    // Update the view
    renderBooksList();

    // Clear the modal
    clearBookModal();

    return true;
}

// Function to edit an existing book
function editBook(bookId, updatedData) {
    const bookIndex = booksList.findIndex(book => book.id === parseInt(bookId));

    if (bookIndex === -1) {
        alert('Livro não encontrado!');
        return false;
    }

    // Lookup data from selects
    const authorSelect = document.getElementById('livroAutor');
    const publisherSelect = document.getElementById('livroEditora');
    const subjectSelect = document.getElementById('livroMateria');
    
    const authorText = authorSelect.options[authorSelect.selectedIndex].text;
    const publisherText = publisherSelect.options[publisherSelect.selectedIndex].text;
    const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;

    // Update book details
    booksList[bookIndex] = {
        ...booksList[bookIndex],
        title: updatedData.title,
        author: authorText,
        authorId: updatedData.authorId,
        publisher: publisherText,
        publisherId: updatedData.publisherId,
        subject: subjectText,
        subjectId: updatedData.subjectId,
        pages: updatedData.pages,
        year: updatedData.year,
        description: updatedData.description,
        quantity: updatedData.quantity
    };

    // Update the view
    renderBooksList();

    return true;
}

// Function to remove a book
function removeBook(bookId) {
    const bookIndex = booksList.findIndex(book => book.id === parseInt(bookId));

    if (bookIndex === -1) {
        alert('Livro não encontrado!');
        return false;
    }

    // Remove the book from the list
    booksList.splice(bookIndex, 1);

    // Update the view
    renderBooksList();

    return true;
}

// Function to render the books list (updating the UI)
function renderBooksList() {
    const tableBody = document.querySelector('#livros table tbody');
    
    if (!tableBody) {
        console.error('Tabela de livros não encontrada!');
        return;
    }

    // Clear existing rows
    tableBody.innerHTML = '';

    // Populate table with books
    booksList.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>${book.subject}</td>
            <td>
                <div class="thumbnail">📚</div>
            </td>
            <td><span class="status-badge">${book.status}</span></td>
            <td class="actions">
                <button class="action-button edit-button" onclick="openEditBookModal(${book.id})">✏️</button>
                <button class="action-button delete-button" onclick="confirmRemoveBook(${book.id})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update pagination info
    const paginationInfo = document.querySelector('#livros .pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Mostrando 1 a ${booksList.length} de ${booksList.length} Registros`;
    }
}

// Function to open the edit book modal
function openEditBookModal(bookId) {
    const book = booksList.find(b => b.id === parseInt(bookId));
    
    if (!book) {
        alert('Livro não encontrado!');
        return;
    }

    // Update modal title
    const modalTitle = document.querySelector('#livroModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Editar Livro';
    }

    // Populate modal fields with book data
    document.getElementById('livroTitulo').value = book.title;
    document.getElementById('livroAutor').value = book.authorId;
    document.getElementById('livroEditora').value = book.publisherId;
    document.getElementById('livroMateria').value = book.subjectId;
    document.getElementById('livroPaginas').value = book.pages;
    document.getElementById('livroQuantidade').value = book.quantity;
    document.getElementById('livroAno').value = book.year;
    document.getElementById('livroDescricao').value = book.description;

    // Store the current book ID for updating
    document.getElementById('livroModal').dataset.currentBookId = bookId;

    // Change button text to "Atualizar"
    const submitButton = document.querySelector('#livroModal .btn-primary');
    if (submitButton) {
        submitButton.textContent = 'Atualizar';
    }

    // Show the modal
    document.getElementById('livroModal').style.display = 'flex';
}

// Function to open new book modal
function openNewBookModal() {
    // Update modal title
    const modalTitle = document.querySelector('#livroModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Novo Livro';
    }

    // Clear form
    clearBookModal();

    // Remove any stored book ID
    delete document.getElementById('livroModal').dataset.currentBookId;

    // Change button text to "Cadastrar"
    const submitButton = document.querySelector('#livroModal .btn-primary');
    if (submitButton) {
        submitButton.textContent = 'Cadastrar';
    }

    // Show the modal
    document.getElementById('livroModal').style.display = 'flex';
}

// Function to confirm book removal
function confirmRemoveBook(bookId) {
    if (confirm('Tem certeza que deseja remover este livro?')) {
        removeBook(bookId);
    }
}

// Function to clear the book modal
function clearBookModal() {
    document.getElementById('livroTitulo').value = '';
    document.getElementById('livroAutor').value = '';
    document.getElementById('livroEditora').value = '';
    document.getElementById('livroMateria').value = '';
    document.getElementById('livroPaginas').value = '';
    document.getElementById('livroQuantidade').value = '';
    document.getElementById('livroAno').value = '';
    document.getElementById('livroDescricao').value = '';
    
    // Clear image preview if it exists
    const imagePreview = document.querySelector('#livroModal .image-preview');
    if (imagePreview) {
        const placeholder = imagePreview.querySelector('.image-preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'block';
        }
        
        const img = imagePreview.querySelector('img');
        if (img) {
            img.remove();
        }
    }
}

// Handle book form submission
function handleBookFormSubmit() {
    const bookId = document.getElementById('livroModal').dataset.currentBookId;
    const bookData = {
        title: document.getElementById('livroTitulo').value,
        authorId: document.getElementById('livroAutor').value,
        publisherId: document.getElementById('livroEditora').value,
        subjectId: document.getElementById('livroMateria').value,
        pages: document.getElementById('livroPaginas').value,
        quantity: document.getElementById('livroQuantidade').value,
        year: document.getElementById('livroAno').value,
        description: document.getElementById('livroDescricao').value
    };

    if (bookId) {
        // Editing existing book
        editBook(bookId, bookData);
    } else {
        // Adding new book
        addBook(bookData);
    }

    // Close the modal
    document.getElementById('livroModal').style.display = 'none';
}

// Export functions for potential external use
window.LibraryManagement = {
    addBook,
    editBook,
    removeBook,
    openEditBookModal,
    openNewBookModal,
    confirmRemoveBook,
    renderBooksList
};