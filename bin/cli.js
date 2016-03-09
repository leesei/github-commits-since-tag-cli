#!/usr/bin/env node
'use strict';

const Chalk = require('chalk');
const Fs = require('fs');
const GHcst = require('github-commits-since-tag');
const Homedir = require('os-homedir');
const Program = require('commander');
const pkg = require('../package.json');

const FULLPATH_RE = /^([\w-]+)\/([\w-]+)$/;

// free GitHub public tokens!!!
const TOKENS = [
  '414eea174d561acd6ba0d63844509165fcc48526',
  'eda5d0b22cb2d01b08e533a345862ae2a4de30a3',
  'e75b90eaf40f2bf6c317d41f845fd2fe4b2a0f10',
  '714053f83645a319d5c679528fd3a495730c8a55'
];

let options = {
  user: 'GHcst',  // this is dummy
  token: TOKENS[Math.floor(Math.random() * 4)]
};
try {
  // try to load `~/.ghcstrc`
  Object.assign(options,
    JSON.parse(Fs.readFileSync(`${Homedir()}/.ghcstrc`))
  );
} catch (err) {
  if (err.code !== 'ENOENT') {
    console.log(Chalk.bgYellow.bold('WARNING') + ' malformed `~/.ghcstrc`, using default options');
  }
}

Program
  .version(pkg.version)
  .description(pkg.description)
  .arguments('<query>')
  .action((query) => {
    if (FULLPATH_RE.test(query)) {
      Program.repo = query;
    } else {
      Program.owner = query;
    }
  });

Program.on('--help', () => {
  console.log(
    `  See ${pkg.homepage} for details.`
  );
});

Program.parse(process.argv);

const ghcst = new GHcst(options);

if (Program.repo) {
  // list specific repo
  ghcst.commitsForRepo(Program.repo)
    .then(result => {
      // `outputResults()` takes array
      outputResults([result]);
    })
    .catch(err => console.log(Chalk.red(err)));
} else if (Program.owner) {
  // list all repo
  ghcst.commitsForOwner(Program.owner)
    .then(outputResults)
    .catch(err => console.log(Chalk.red(err)));
} else {
  Program.outputHelp();
  console.log();
  console.log(Chalk.red('missing argument'));
  process.exit(-1);
}

function outputResults (results) {
  // TODO: add dump file, JSON, colorize
  // console.log(JSON.stringify(results, null, 2));

  results.forEach(result => {
    console.log(Chalk.green.bold(`[${result.repo}]`) + ` has ${Chalk.red.bold(result.numCommits)} commits after tag ${Chalk.cyan.bold(result.tag)}`);
    result.commits.forEach(commit => {
      console.log(`- ${Chalk.blue.bold(commit.author.name)} <${Chalk.blue(commit.author.email)}> ${Chalk.yellow.bold(commit.author.date)}`);
      console.log(`  ${Chalk.gray(commit.message.split('\n')[0])}`);
    });
    console.log();
  });
}
