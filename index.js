import { promises as fs } from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function statesFullInfo() {
  const cidades = JSON.parse(await fs.readFile('./datasets/cidades.json'));
  const estados = JSON.parse(await fs.readFile('./datasets/estados.json'));

  const cidadesDosEstados = [];

  for (let i = 0; i < estados.length; i++)
    cidadesDosEstados.push([estados[i].ID, estados[i].Sigla, []]);


  for (let i = 0; i < cidades.length; i++)
    cidadesDosEstados[cidades[i].Estado - 1][2].push(cidades[i].Nome);

  return [cidades, estados, cidadesDosEstados];
}

// Questão 1
async function writeJsonFiles() {
  try {
    const [, estados, cidadesDosEstados] = await statesFullInfo();

    for (let i = 0; i < estados.length; i++)
      await fs.writeFile(`./datasets/${estados[i].Sigla}.json`, JSON.stringify(
        cidadesDosEstados[i][2]
      ));

    console.clear();
    console.log(`${estados.length} JSON files generated`);
    setTimeout(function () { console.clear(); init(); }, 1000);
  } catch (error) {
    console.log(error);
  }
}

// Questão 2
async function countCities(uf) {
  try {
    const cidades = JSON.parse(await fs.readFile(`./datasets/${uf}.json`));
    return cidades.length;
  } catch (error) {
    return error;
  }
}

// Questão 2
function askForUf() {
  rl.question('Insira a UF ou -1 para retornar ao menu: ', async uf => {
    if (uf === '-1') {
      console.clear();
      init();
    }
    else {
      const promise = await countCities(uf.toUpperCase());
      console.clear();
      console.log(`${uf.toUpperCase()} possui ${promise} cidades.`);
      try {
        const cidades = await countCities(uf.toUpperCase());
        console.clear();
        console.log(`${uf.toUpperCase()} possui ${cidades} cidades.`);
        setTimeout(function () {
          console.clear();
          askForUf();
        }, 3500);
      } catch (error) {
        console.clear();
        console.log(error);
        setTimeout(function () {
          console.clear();
          askForUf();
        }, 4000);
      }
    }
  });
}

// Questão 3
async function topFiveStatesWithMostCities() {
  let numCidadesPorEstado = [];
  const [, , cidadesDosEstados] = await statesFullInfo();

  for (let i = 0; i < cidadesDosEstados.length; i++)
    numCidadesPorEstado.push([cidadesDosEstados[i][1], cidadesDosEstados[i][2].length]);

  numCidadesPorEstado = numCidadesPorEstado.sort((a, b) => b[1] - a[1]);

  console.log('Top 5 Estados com mais municípios\n');
  for (let i = 0; i < 5; i++)
    console.log(`${numCidadesPorEstado[i][0]} tem ${numCidadesPorEstado[i][1]} municípios`);

  setTimeout(function () { console.clear(); init(); }, 4000);
}
// Questão 4
async function topFiveStatesWithLessCities() {
  let numCidadesPorEstado = [];
  const [, , cidadesDosEstados] = await statesFullInfo();

  for (let i = 0; i < cidadesDosEstados.length; i++)
    numCidadesPorEstado.push([cidadesDosEstados[i][1], cidadesDosEstados[i][2].length]);

  numCidadesPorEstado = numCidadesPorEstado.sort((a, b) => a[1] - b[1]);

  console.log('Top 5 Estados com menos municípios\n');
  for (let i = 0; i < 5; i++)
    console.log(`${numCidadesPorEstado[i][0]} tem ${numCidadesPorEstado[i][1]} municípios`);

  setTimeout(function () { console.clear(); init(); }, 4000);
}

// Questão 5
async function biggestCityNameLengthPerState() {
  rl.question('Insira a UF ou -1 para retornar ao menu: ', async uf => {
    if (uf === '-1') {
      console.clear();
      init();
    }
    else {
      try {
        let cities = JSON.parse(await fs.readFile(`./datasets/${uf.toUpperCase()}.json`));
        cities = cities.sort((a, b) => b.length - a.length);

        console.clear();
        console.log(`${cities[0]} - ${uf.toUpperCase()}`);
        setTimeout(function () {
          console.clear();
          biggestCityNameLengthPerState();
        }, 2000);
      } catch (error) {
        console.clear();
        console.log(error);
        setTimeout(function () {
          console.clear();
          biggestCityNameLengthPerState();
        }, 2000);
      }
    }
  });
}

// Questão 6
async function smallestCityNameLengthPerState() {
  rl.question('Insira a UF ou -1 para retornar ao menu: ', async uf => {
    if (uf === '-1') {
      console.clear();
      init();
    }
    else {
      try {
        let cities = JSON.parse(await fs.readFile(`./datasets/${uf.toUpperCase()}.json`));
        cities = cities.sort((a, b) => a.length - b.length);

        console.clear();
        console.log(`${cities[0]} - ${uf.toUpperCase()}`);
        setTimeout(function () {
          console.clear();
          smallestCityNameLengthPerState();
        }, 2000);
      } catch (error) {
        console.clear();
        console.log(error);
        setTimeout(function () {
          console.clear();
          smallestCityNameLengthPerState();
        }, 2000);
      }
    }
  });
}

function setMenu() {
  return `  ============MENU===========
  1 - GERAR ARQUIVOS JSON
  2 - CONTAR CIDADES POR UF
  3 - 5 ESTADOS C/ MAIS CIDADES
  4 - 5 ESTADOS C/ MENOS CIDADES
  5 - CIDADE C/ MAIOR NOME P/ ESTADO
  6 - CIDADE C/ MENOR NOME P/ ESTADO
  0 - SAIR
  ============MENU===========\n`;
}

function init() {
  rl.question(setMenu(), async option => {
    switch (option) {
      case '1': {
        console.clear();
        await writeJsonFiles();
        break;
      }
      case '2': {
        console.clear();
        askForUf();
        break;
      }
      case '3': {
        console.clear();
        topFiveStatesWithMostCities();
        break;
      }
      case '4': {
        console.clear();
        topFiveStatesWithLessCities();
        break;
      }
      case '5': {
        console.clear();
        biggestCityNameLengthPerState();
        break;
      }
      case '6': {
        console.clear();
        smallestCityNameLengthPerState();
        break;
      }
      case '0': {
        console.clear();
        console.log('Finalizando...');
        setTimeout(function () { rl.close() }, 1000);
        break;
      }
      default: {
        console.clear();
        console.log('Opção inválida! Finalizando...');
        setTimeout(function () { rl.close() }, 1000);
      }
    }
  });
}

init();