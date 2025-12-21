document.addEventListener('DOMContentLoaded', function() {
    // Загрузка проектов из YAML файла
    fetchProjects();

    // Инициализация фильтра проектов
    initProjectFilter();
});

async function fetchProjects() {
    try {
        // Загрузка YAML файла (GitHub Pages требует raw-ссылки)
        const response = await fetch('https://general-soldatov.github.io/_data/projects.json');
        const projectsData = await response.json();

        // Преобразование YAML в JSON (используем js-yaml)
        // const projectsData = jsyaml.load(yamlText);

        // Отрисовка избранных проектов на главной
        renderFeaturedProjects(projectsData);

        // Отрисовка всех проектов на странице проектов
        renderAllProjects(projectsData);
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
