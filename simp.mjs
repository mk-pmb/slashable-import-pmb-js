// -*- coding: utf-8, tab-width: 2 -*-

import pathLib from 'path';

import absdir from 'absdir';
import promisify from 'pify';
import nodeStyleResolve from 'resolve';

const pResolve = promisify(nodeStyleResolve);

const defaultOpt = {
  base: '',
  ext: ['.mjs', '.jsm', '.js'],
  suf: ['__main__', '\n'],
  expo: 'default',
};


function parseBase(base) {
  if (!base) { return process.cwd(); }
  if (typeof base === 'string') { return base; }
  return absdir(base);
}


async function slim(opt, origSpec) {
  const resolveOpt = {
    preserveSymlinks: false,
    extensions: opt.ext,
    ...opt.resolveOpt,
    basedir: parseBase(opt.base),
  };
  const sufRemain = (origSpec.endsWith('/') && ['', ...opt.suf]);
  const bfn = pathLib.basename(origSpec);

  let origErr;
  let nFails = 0;
  async function tryResolve() {
    let add = (sufRemain[nFails] || '');
    if (add) { add = add.replace(/\n/g, bfn); }
    const spec = origSpec + add;
    try {
      return await pResolve(spec, resolveOpt);
    } catch (nope) {
      nFails += 1;
      if (!nope) {
        const bad = ('False-y value "' + String(nope)
          + '" thrown while trying to resolve "' + spec + '"');
        throw new Error(bad);
      }
      if (nope.code !== 'MODULE_NOT_FOUND') { throw nope; }
      if (!origErr) { origErr = nope; }
    }
    if (sufRemain && (nFails < sufRemain.length)) { return tryResolve(); }
    if (origErr) { throw origErr; }
    throw new Error('Control flow error. This should have been impossible.');
  }

  const found = await tryResolve();
  const imported = await import(found);
  return imported[opt.expo];
};



const csi = function configureSlashableImport(opt) {
  const effOpt = { ...defaultOpt, ...opt };
  return function slashableImport(spec) { return slim(effOpt, spec); };
};

Object.assign(csi, {
  defaultOpt,
});

export default csi;
