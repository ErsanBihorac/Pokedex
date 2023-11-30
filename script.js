let currentPokemon;
let pokemon = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard', 'squirtle', 'wartortle', 'blastoise', 'caterpie',
'metapod', 'butterfree', 'weedle', 'kakuna', 'beedrill', 'pidgey', 'pidgeotto', 'pidgeot', 'rattata', 'raticate', 'spearow',
'fearow', 'ekans', 'arbok', 'pikachu', 'raichu', 'sandshrew', 'sandslash', 'nidorina', 'nidoqueen',
'nidorino', 'nidoking', 'clefairy', 'clefable', 'vulpix', 'ninetales', 'jigglypuff', 'wigglytuff', 'zubat', 'golbat', 'oddish',
'gloom', 'vileplume', 'paras', 'parasect', 'venonat', 'venomoth', 'diglett', 'dugtrio', 'meowth', 'persian', 'psyduck', 'golduck',
'mankey', 'primeape', 'growlithe', 'arcanine', 'poliwag', 'poliwhirl', 'poliwrath', 'abra', 'kadabra', 'alakazam', 'machop',
'machoke', 'machamp', 'bellsprout', 'weepinbell', 'victreebel', 'tentacool', 'tentacruel', 'geodude', 'graveler', 'golem',
'ponyta', 'rapidash', 'slowpoke', 'slowbro', 'magnemite', 'magneton', 'doduo', 'dodrio', 'seel', 'dewgong',
'grimer', 'muk', 'shellder', 'cloyster', 'gastly', 'haunter', 'gengar', 'onix', 'drowzee', 'hypno', 'krabby', 'kingler',
'voltorb', 'electrode', 'exeggcute', 'exeggutor', 'cubone', 'marowak', 'hitmonlee', 'hitmonchan', 'lickitung', 'koffing',
'weezing', 'rhyhorn', 'rhydon', 'chansey', 'tangela', 'kangaskhan', 'horsea', 'seadra', 'goldeen', 'seaking', 'staryu',
'starmie', 'scyther', 'jynx', 'electabuzz', 'magmar', 'pinsir', 'tauros', 'magikarp', 'gyarados', 'lapras',
'ditto', 'eevee', 'vaporeon', 'jolteon', 'flareon', 'porygon', 'omanyte', 'omastar', 'kabuto', 'kabutops', 'aerodactyl',
'snorlax', 'articuno', 'zapdos', 'moltres', 'dratini', 'dragonair', 'dragonite', 'mewtwo'];
let filtered_pokemon = [];
let pokemon_url = [];

/**
 * this function is used to create the URLs and displays the pokemons in the pokedex when the site has loaded
 */
async function displayPokemon() {
    await createPokemonUrl(pokemon);
    await loadPokemon();
}

/**
 * this function renders the pokemon into the pokedex
 */
async function loadPokemon() {
    let pokedex = document.getElementById('pokedex');
    for (let i = 0; i < pokemon_url.length; i++) {
        let url = pokemon_url[i];
        let response = await fetch(url);
        currentPokemon = await response.json();

        pokedex.innerHTML += pokemonTemplate(i);
    }
}

/**
 * this function is a template function and returns the pokemon card
 * @param {number} i - pokemon
 * @returns - a template
 */
function pokemonTemplate(i) {
    return /*html*/`
    <div onclick="openPokemon(${i})" class="pokemon ${currentPokemon['types'][0]['type']['name']}">
        <div class="pokemon-data">
            <div class="pokemon-name">${currentPokemon['name']}</div>
            <div class="pokemon-type">${currentPokemon['types'][0]['type']['name']}</div>
            <div>#${currentPokemon['order']}</div>
        </div>

        <img class="img-pokemon" src="${currentPokemon['sprites']['front_default']}">
    </div>
`;
}

/**
 * this function sets the current pokemon that will be displayed in the overlay
 * @param {number} i - pokemon in the array
 */
async function openPokemon(i) {
    let url = pokemon_url[i];
    let response = await fetch(url);
    currentPokemon = await response.json();
    openOverlay(i);
}

/**
 * this function opens the overlay
 * @param {number} i- pokemon in the array
 */
function openOverlay(i) {
    let overlay = document.getElementById('overlay');
    document.getElementById('page').classList.add('blur');
    overlay.classList.add('zindex');
    displayStats(i);
    document.getElementById('info').classList.add('slide-animation');
}

/**
 * this function displays the abilities in the overlay
 * @param {number} i - pokemon in the array
 */
function displayAbilities(i) {
    switchSelectedOption(i);
    generateAbilities();
}

/**
 * this function renders the buttons into a new design
 * @param {number} i - pokemon in the array
 */
function switchSelectedOption(i) {
    let info_bottom = document.getElementById('info-bottom');
    info_bottom.innerHTML = /*html*/`
        <div class="info-options color-${currentPokemon['types'][0]['type']['name']}">
            <div onclick="displayStats(${i})" class="unselected-option ${currentPokemon['types'][0]['type']['name']}">
                STATS
            </div>
            <div class="selected-option ${currentPokemon['types'][0]['type']['name']}">
                ABILITIES
            </div>
        </div>
        <div id="abilities" class="abilities">
        </div>
    `;
}

/**
 * this function renders the abilities of the pokemon into the overlay
 */
function generateAbilities() {
    let abilities = document.getElementById('abilities');
    abilities.innerHTML = '';
    for (let j = 0; j < currentPokemon['abilities'].length; j++) {
        abilities.innerHTML += /*html*/`
            <div class="selected-option ability-${currentPokemon['types'][0]['type']['name']}">
                ${currentPokemon['abilities'][j]['ability']['name']}
            </div>
        `;
    }
}

/**
 * this function closes the overlay
 */
function closeOverlay() {
    document.getElementById('page').classList.remove('blur');
    document.getElementById('overlay').classList.remove('zindex');
}

/**
 * this function filters the pokemon by the input value and displays them in the pokedex
 */
async function filterAndCreatePokemonUrl() {
    let filter = document.getElementById('search-pokemon').value
    filtered_pokemon.length = 0;
    document.getElementById('pokedex').innerHTML = '';
    for (let i = 0; i < pokemon.length; i++) {
        if (pokemon[i].includes(filter)) {
            filtered_pokemon.push(pokemon[i]);
        }
    }
    pokemon_url.length = 0;
    await createPokemonUrl(filtered_pokemon);
    await loadPokemon();
}

/**
 * this function creates url's
 * @param {string} array - the array being used to create the url's (pokemon/filtered_pokemon)
 */
async function createPokemonUrl(array) {
    let url = 'https://pokeapi.co/api/v2/pokemon/';

    for (let i = 0; i < array.length; i++) {
        let new_pokemon_url = url + array[i]
        pokemon_url.push(new_pokemon_url);
    }
}

/**
 * this function renders the stats of the pokemon into the overlay
 * @param {number} i - order of the pokemon in the array
 */
function displayStats(i) {
    overlay.innerHTML = /*html*/`
        <div id="info" class="info">
            <div class="info-top ${currentPokemon['types'][0]['type']['name']}">
                <img onclick="closeOverlay()" class="arrow" src="img/arrow-left.png" alt="">

                <div class="info-poketype">
                    <div>
                        <div class="info-pokemon-name">${currentPokemon['name']}</div>
                        <div class="pokemon-type">${currentPokemon['types'][0]['type']['name']}</div>
                    </div>

                    <div>
                    #${currentPokemon['order']}
                    </div>
                </div>

                <div class="info-pokemon-img-container">
                    <img id="test-img" class="info-pokemon-img" src="${currentPokemon['sprites']['front_default']}" alt="">
                </div>
            </div>

            <div id="info-bottom" class="info-bottom">
                <div class="info-options color-${currentPokemon['types'][0]['type']['name']}">
                    <div class="selected-option ${currentPokemon['types'][0]['type']['name']}">STATS</div>
                    <div onclick="displayAbilities(${i})" class="unselected-option ${currentPokemon['types'][0]['type']['name']}">ABILITIES</div>
                </div>

                <div class="stats">
                    <div class="single-stat">
                        <div class="space-between">
                            <div class="color-${currentPokemon['types'][0]['type']['name']}">HP</div>
                            <div>${currentPokemon['stats'][0]['base_stat']}</div>
                        </div>
                        <div class="w3-light-grey">
                            <div class="w3-container w3-${currentPokemon['types'][0]['type']['name']}" style="width: calc(${currentPokemon['stats'][0]['base_stat']} * 0.65%)"></div>
                        </div>
                    </div>
                    <div class="single-stat">
                        <div class="space-between">
                            <div class="color-${currentPokemon['types'][0]['type']['name']}">ATTACK</div>
                            <div>${currentPokemon['stats'][1]['base_stat']}</div>
                        </div>
                        <div class="w3-light-grey">
                            <div class="w3-container w3-${currentPokemon['types'][0]['type']['name']}" style="width: calc(${currentPokemon['stats'][1]['base_stat']} * 0.65%)"></div>
                        </div>
                    </div>
                    <div class="single-stat">
                        <div class="space-between">
                            <div class="color-${currentPokemon['types'][0]['type']['name']}">DEFENSE</div>
                            <div>${currentPokemon['stats'][2]['base_stat']}</div>
                        </div>
                        <div class="w3-light-grey">
                            <div class="w3-container w3-${currentPokemon['types'][0]['type']['name']}" style="width: calc(${currentPokemon['stats'][2]['base_stat']} * 0.65%)"></div>
                        </div>
                    </div>
                    <div class="single-stat">
                        <div class="space-between">
                            <div class="color-${currentPokemon['types'][0]['type']['name']}">S-ATTACK</div>
                            <div>${currentPokemon['stats'][3]['base_stat']}</div>
                        </div>
                        <div class="w3-light-grey">
                            <div class="w3-container w3-${currentPokemon['types'][0]['type']['name']}" style="width: calc(${currentPokemon['stats'][3]['base_stat']} * 0.65%)"></div>
                        </div>
                    </div>
                    <div class="single-stat">
                        <div class="space-between">
                            <div class="color-${currentPokemon['types'][0]['type']['name']}">S-DEFENSE</div>
                            <div>${currentPokemon['stats'][4]['base_stat']}</div>
                        </div>
                        <div class="w3-light-grey">
                            <div class="w3-container w3-${currentPokemon['types'][0]['type']['name']}" style="width: calc(${currentPokemon['stats'][4]['base_stat']} * 0.65%)"></div>
                        </div>
                    </div>
                    <div class="single-stat">
                        <div class="space-between">
                            <div class="color-${currentPokemon['types'][0]['type']['name']}">SPEED</div>
                            <div>${currentPokemon['stats'][5]['base_stat']}</div>
                        </div>
                        <div class="w3-light-grey">
                            <div class="w3-container w3-${currentPokemon['types'][0]['type']['name']}" style="width: calc(${currentPokemon['stats'][5]['base_stat']} * 0.65%)"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}