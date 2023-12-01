// main.js

async function capturarPokemon() {
  try {
    // Lógica para capturar Pokémon (chamando a sua API)
    const response = await fetch('http://localhost:3000/capturar');
    const data = await response.json();

    // Exibir mensagem de sucesso
    alert(data.message);

    // Exibir informações do Pokémon capturado
    exibirDetalhesPokemon(data);
  } catch (error) {
    console.error('Erro ao capturar Pokémon:', error);
  }
}

function exibirDetalhesPokemon(pokemon, container = null) {
  // Criar uma lista de detalhes do Pokémon
  const detailsList = document.createElement('ul');

  // Iterar sobre as propriedades do Pokémon
  for (const prop in pokemon) {
    if (pokemon.hasOwnProperty(prop)) {
      // Criar um item de lista para cada propriedade
      const listItem = document.createElement('li');
      if (prop === 'sprites_url') {
        // Se a propriedade for a URL da imagem, criar um elemento de imagem
        const img = document.createElement('img');
        img.src = pokemon[prop];
        img.alt = pokemon.name;
        listItem.appendChild(img);
      } else {
        listItem.innerHTML = `<strong>${prop}:</strong> ${JSON.stringify(pokemon[prop])}`;
      }
      detailsList.appendChild(listItem);
    }
  }

  // Adicionar a lista de detalhes ao contêiner do Pokémon ou ao corpo do documento
  if (container) {
    container.appendChild(detailsList);
  } else {
    const pokemonImageContainer = document.getElementById('pokemonImage');
    pokemonImageContainer.innerHTML = ''; // Limpar o contêiner antes de adicionar a nova imagem
    pokemonImageContainer.appendChild(detailsList);
  }
}

async function batalharPokemon() {
  try {
    // Lógica para batalhar Pokémon (chamando a sua API)
    const response = await fetch('http://localhost:3000/batalhar/10');
    const data = await response.json();

    // Exibir mensagem de sucesso
    alert(data.message);

    // Exibir informações do Pokémon em batalha
    exibirDetalhesPokemon(data);
  } catch (error) {
    console.error('Erro ao batalhar Pokémon:', error);
  }
}

async function exibirPokedex() {
  try {
    // Lógica para obter a Pokédex (chamando a sua API)
    const response = await fetch('http://localhost:3000/pokedex');
    const pokemons = await response.json();

    // Limpar a seção da Pokédex
    const pokedexSection = document.getElementById('pokedexSection');
    pokedexSection.innerHTML = '';

    // Exibir cada Pokémon na Pokédex
    pokemons.forEach((pokemon) => {
      // Criar um elemento para o Pokémon
      const pokemonContainer = document.createElement('div');
      pokemonContainer.classList.add('pokemon-container');

      // Exibir informações do Pokémon
      exibirDetalhesPokemon(pokemon, pokemonContainer);

      // Adicionar o contêiner do Pokémon à Pokédex
      pokedexSection.appendChild(pokemonContainer);
    });
  } catch (error) {
    console.error('Erro ao obter a Pokédex:', error);
  }
}
