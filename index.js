const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=150';

const pokemonList = document.getElementById('pokemonList');
const searchBox = document.getElementById('searchBox');
const modal = document.getElementById('pokemonModal');
const modalName = document.getElementById('modalName');
const modalNumber = document.getElementById('modalNumber');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.getElementById('closeModal');
const sortOrder = document.getElementById('sortOrder');

let allPokemon = [];

async function axiosPokemon() {
    const res = await axios.get(apiUrl);
    const pokemon = res.data.results.map((poke, index) => ({
        name: poke.name,
        number: index + 1,
        url: poke.url
    }));
    allPokemon = pokemon;
    sortPokemon('df');
}


async function displayPokemon(pokemonListData) {
    pokemonList.innerHTML = '';
    for (let poke of pokemonListData) {
        const response = await fetch(poke.url);
        const data = await response.json();

        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.innerHTML = `
            <img src="${data.sprites.front_default}" alt="${poke.name}" class="pokemon-image">
            <h3>${poke.name}</h3>
            <p>#${poke.number}</p>
        `;

        card.addEventListener('click', () => showModal(data, poke));
        pokemonList.appendChild(card);
    }
}


function showModal(data, poke) {
    modalName.textContent = poke.name;
    modalNumber.textContent = `#${poke.number}`;
    modalDescription.innerHTML = `
        <strong>Height:</strong> ${data.height}  <br>
        <strong>Weight:</strong> ${data.weight} <br>
        <strong>Abilities:</strong> ${data.abilities.map(ability => ability.ability.name).join(', ')}
    `;
    modal.style.display = 'flex';
}


closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});


sortOrder.addEventListener('change', (e) => {
    const selectedOrder = e.target.value;
    sortPokemon(selectedOrder);
});

function sortPokemon(order) {
    let sortedPokemon;
    if (order === 'df') {
        sortedPokemon = [...allPokemon].sort((a, b) => a.number - b.number);
    } else if (order === 'az') {
        sortedPokemon = [...allPokemon].sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'za') {
        sortedPokemon = [...allPokemon].sort((a, b) => b.name.localeCompare(a.name));
    }
    displayPokemon(sortedPokemon);
}


searchBox.addEventListener('input', () => {
    const searchTerm = searchBox.value.toLowerCase();
    const filteredPokemon = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm) ||
        pokemon.number.toString().includes(searchTerm)
    );

    displayPokemon(filteredPokemon);
});


axiosPokemon();
