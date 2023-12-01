var express = require('express');
var router = express.Router();

const axios = require('axios');

// HOME
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/capturar', async function(req, res, next) {
  try {
    const randomPokemonId = Math.floor(Math.random() * 100) + 1;

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
    const pokemonData = response.data;

    const db = req.app.db;
    const result = await db.promise().query('INSERT INTO captured_pokemons (name, abilities_sequence, abilities_name, abilities_slot, base_experience, sprites_url) VALUES (?, ?, ?, ?, ?, ?)',
      [pokemonData.name, getPokemonAbilitiesSequence(pokemonData.abilities), getPokemonAbilitiesNames(pokemonData.abilities), getPokemonAbilitiesSlots(pokemonData.abilities), pokemonData.base_experience, pokemonData.sprites.other.dream_world.front_default]);

    res.json({ message: 'Pokémon capturado com sucesso! Verificar no último item de sua Pokédex!' });
  } catch (error) {
    console.error('Erro ao capturar Pokémon:', error);
    res.status(500).json({ error: 'Erro interno ao capturar Pokémon' });
  }
});

function getPokemonAbilitiesSequence(abilities) {
  return abilities.map((ability) => ability.slot).join(',');
}

function getPokemonAbilitiesNames(abilities) {
  return abilities.map((ability) => ability.ability.name).join(',');
}

function getPokemonAbilitiesSlots(abilities) {
  return abilities.map((ability) => ability.slot).join(',');
}

router.get('/capturar/:id', async function(req, res, next) {
  const pokemonId = req.params.id;

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonData = response.data;

    const db = req.app.db;
    const existingPokemon = await db.promise().query('SELECT * FROM captured_pokemons WHERE id = ?', [pokemonId]);

    if (existingPokemon.length > 0) {
      return res.json({ message: 'Pokémon já está na Pokédex.' });
    }

    const result = await db.promise().query('INSERT INTO captured_pokemons (name, abilities_sequence, abilities_name, abilities_slot, base_experience, sprites_url) VALUES (?, ?, ?, ?, ?, ?)',
      [pokemonData.name, getPokemonAbilitiesSequence(pokemonData.abilities), getPokemonAbilitiesNames(pokemonData.abilities), getPokemonAbilitiesSlots(pokemonData.abilities), pokemonData.base_experience, pokemonData.sprites.other.dream_world.front_default]);

    res.json({ message: 'Pokémon capturado com sucesso! Verificar no último item de sua Pokédex!' });
  } catch (error) {
    console.error('Erro ao capturar Pokémon por ID:', error);
    res.status(500).json({ error: 'Erro interno ao capturar Pokémon por ID' });
  }
});

router.get('/batalhar/:id', async function(req, res, next) {
  const yourPokemonId = req.params.id;

  try {
    // Verificar se o Pokémon existe na tabela captured_pokemons
    const db = req.app.db;
    const [yourPokemon] = await db.promise().query('SELECT * FROM captured_pokemons WHERE id = ?', [yourPokemonId]);

    if (yourPokemon.length === 0) {
      return res.status(404).json({ error: 'Pokémon não encontrado na Pokédex' });
    }

    // Lógica para gerar o oponente
    const opponentPokemonId = Math.floor(Math.random() * 100) + 1;
    const [opponentPokemon] = await db.promise().query('SELECT * FROM captured_pokemons WHERE id = ?', [opponentPokemonId]);

    if (opponentPokemon.length === 0) {
      return res.status(500).json({ error: 'Erro interno ao gerar o oponente' });
    }

    // Calcular o poder de cada Pokémon
    const yourPokemonPower = calculatePokemonPower(yourPokemon[0]);
    const opponentPokemonPower = calculatePokemonPower(opponentPokemon[0]);

    // Determinar o vencedor da batalha
    let winner;
    if (yourPokemonPower > opponentPokemonPower) {
      winner = 'Você';
    } else if (yourPokemonPower < opponentPokemonPower) {
      winner = 'Oponente';
    } else {
      winner = 'Empate';
    }

    // Salvar o resultado da batalha no banco de dados
    await db.promise().query('INSERT INTO battles (pokemon_id, opponent_id, power) VALUES (?, ?, ?)', [yourPokemonId, opponentPokemonId, yourPokemonPower]);

    // Responder com o resultado da batalha
    res.json({ message: `Batalha concluída! Vencedor: ${winner}`, yourPokemonPower, opponentPokemonPower });
  } catch (error) {
    console.error('Erro ao batalhar com Pokémon:', error);
    res.status(500).json({ error: 'Erro interno ao batalhar com Pokémon' });
  }
});

function calculatePokemonPower(pokemonData) {
  const abilitiesCount = pokemonData.abilities_sequence.split(',').length;
  const slotValues = pokemonData.abilities_slot.split(',').map(Number);
  const baseExperience = pokemonData.base_experience;

  return Math.log(abilitiesCount * slotValues.reduce((acc, val) => acc * val, 1) * baseExperience);
}

router.get('/pokedex', async function(req, res, next) {
  try {
    const db = req.app.db;
    const [pokemons] = await db.promise().query('SELECT * FROM captured_pokemons');
    res.json(pokemons);
  } catch (error) {
    console.error('Erro ao obter a Pokédex:', error);
    res.status(500).json({ error: 'Erro interno ao obter a Pokédex' });
  }
});

router.get('/pokedex/:id', async function(req, res, next) {
  const pokemonId = req.params.id;

  try {
    const db = req.app.db;
    const [pokemon] = await db.promise().query('SELECT * FROM captured_pokemons WHERE id = ?', [pokemonId]);

    if (pokemon.length > 0) {
      res.json(pokemon[0]);
    } else {
      res.status(404).json({ error: 'Pokémon não encontrado na Pokédex' });
    }
  } catch (error) {
    console.error('Erro ao obter detalhes do Pokémon na Pokédex:', error);
    res.status(500).json({ error: 'Erro interno ao obter detalhes do Pokémon na Pokédex' });
  }
});

module.exports = router;
