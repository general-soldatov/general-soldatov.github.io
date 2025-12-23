document.addEventListener('DOMContentLoaded', function() {
    // Загрузка проектов из YAML файла
    fetchProjects();

    // Инициализация фильтра проектов
    initProjectFilter();
});

async function fetchProjects() {
    try {
        // Загрузка json файла
        const response = await fetch('https://general-soldatov.github.io/data/projects.json');
        const projectsData = await response.json();

        const responseInfo = await fetch('https://general-soldatov.github.io/data/info.json');
        const projectInfo = await responseInfo.json();

        // Отрисовка избранных проектов на главной
        renderFeaturedProjects(projectsData);

        // Отрисовка всех проектов на странице проектов
        renderAllProjects(projectsData);
        // Отрисовка нижнего контейнера
        renderFooter(projectInfo);
        // Отрисовываем опыт работы
        addWorks(projectInfo);

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderFeaturedProjects(projects) {
    const featuredContainer = document.getElementById('featured-projects');
    if (!featuredContainer) return;

    // Фильтруем избранные проекты
    const featuredProjects = projects.filter(project => project.featured);

    // Ограничиваем количество (например, 3)
    const limitedProjects = featuredProjects.slice(0, 3);

    // Отрисовываем проекты
    limitedProjects.forEach(project => {
        featuredContainer.appendChild(createProjectCard(project));
    });
}

function renderAllProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    // Отрисовываем все проекты
    projects.forEach(project => {
        projectsContainer.appendChild(createProjectCard(project));
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = `project-card ${project.tags.join(' ')}`;
    card.setAttribute('data-tags', project.tags.join(','));

    let imageStyle = '';
    if (project.image) {
        imageStyle = `background-image: url('${project.image}')`;
    }

    card.innerHTML = `
        <div class="project-image" style="${imageStyle}"></div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <p>${project.description}</p>
            <div class="project-links">
                ${project.demo ? `<a href="${project.demo}" target="_blank">Демо</a>` : ''}
                ${project.code ? `<a href="${project.code}" target="_blank">Код</a>` : ''}
            </div>
        </div>
    `;

    return card;
}

function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Фильтруем проекты
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const projects = document.querySelectorAll('.project-card');

    projects.forEach(project => {
        if (filter === 'all') {
            project.style.display = 'block';
        } else {
            const tags = project.getAttribute('data-tags').split(',');
            if (tags.includes(filter)) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        }
    });
}

function renderCopyright(name) {
    const copyright = document.createElement('div');
    copyright.className = "copyright";
    const textCopy = document.createElement('p');
    const year = new Date();
    textCopy.innerHTML = `&copy; ${year.getFullYear()} ${name}. Все права защищены.`;
    copyright.appendChild(textCopy);
    return copyright;
}

function addContacts(contacts) {
    const footerSection = document.createElement('div');
    footerSection.className = "footer-section";
    footerSection.innerHTML = `<h3>${contacts.name}</h3>`;
    for (key in contacts.content) {
        const p = document.createElement('p');
        p.innerHTML = `${key}: <a href="${contacts.content[key][1]}"  target="_blank">${contacts.content[key][0]}</a>`
        footerSection.appendChild(p);
    }
    return footerSection
}

function addSpeciality(speciality) {
    const footerSection = document.createElement('div');
    footerSection.className = "footer-section";
    footerSection.innerHTML = `<h3>${speciality.name}</h3>`;
    const ul = document.createElement('ul');
    for (key in speciality.content) {
        const li = document.createElement('li');
        li.innerHTML = speciality.content[key];
        ul.appendChild(li);
    }
    footerSection.appendChild(ul);
    return footerSection
}


function renderFooter(projectInfo) {
    const techFooter = document.getElementsByClassName('tech-footer')[0];
    const containerData = document.createElement('div');
    containerData.className = "container";
    const footerContainer = document.createElement('div');
    footerContainer.className = "footer-content";
    footerContainer.appendChild(addContacts(projectInfo.contacts));
    footerContainer.appendChild(addSpeciality(projectInfo.speciality));
    containerData.appendChild(footerContainer);
    containerData.appendChild(renderCopyright(projectInfo.name));
    techFooter.appendChild(containerData);
}

function addWorks(projectInfo) {
    const workElem = document.getElementById("works-data");
    // if (!workElem)
    //     return;
    for (key in projectInfo.works) {
        console.log(key);
        const li = document.createElement("li");
        for (elem in projectInfo.works[key]) {
            const span = document.createElement("span");
            span.className = elem;
            span.innerText = projectInfo.works[key][elem];
            li.appendChild(span);
        }
        workElem.appendChild(li);
    }
}