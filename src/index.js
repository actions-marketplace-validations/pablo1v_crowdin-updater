const io = require('@actions/io');
const exec = require('@actions/exec');
const core = require('@actions/core');

const { isDirectory, resolvePath } = require('./utils');
const cloneTranslationRepository = require('./clone');

async function run() {
  const token = core.getInput('token');

  const repository = core.getInput('repository');

  const localePath = core.getInput('locale-path');
  const uploadPath = core.getInput('upload-path');

  const [owner, repo] = repository.split(/\//g);
  const repositoryName = repo || owner;

  const localePathResolved = resolvePath(
    DIR_PATH,
    repositoryName,
    repositoryName,
    localePath,
  );

  if (!isDirectory(localePathResolved)) {
    throw new Error('The locale path entered is not a absolute path.');
  }

  const { clonePath } = await cloneTranslationRepository();
  const uploadPathResolved = resolvePath(clonePath, uploadPath);

  if (!isDirectory(uploadPathResolved)) {
    throw new Error('The upload path entered is not a absolute path.');
  }

  // await io.rmRF(uploadPathResolved);
  await io.cp(localePathResolved, uploadPathResolved, {
    recursive: true,
    force: true,
  });

  const options = { cwd: uploadPathResolved };

  // await exec.exec(
  //   'ssh-keygen',
  //   ['-t rsa', '-b', '4096', '-C "your_email@example.com'],
  //   options,
  // );

  await exec.exec('git', ['status'], options);
  await exec.exec('git', ['commit', '-m', '"Upload Translates"'], options);
  await exec.exec('git', ['push'], options);
}

run();
