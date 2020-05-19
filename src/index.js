const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const { readdir } = require('./utils');
const cloneTranslationRepository = require('./clone');

async function run() {
  const token = core.getInput('token');
  const repository = core.getInput('repository');
  const sshKkey = core.getInput('ssh-key');
  const localePath = core.getInput('locale-path');

  console.log(repository);

  const localefiles = readdir(`${repository}/${localePath}`);

  console.log(localefiles);
  console.log({ repository, localePath });

  // const { cloneUniqueID, clonePath } = await cloneTranslationRepository();
}

run();
